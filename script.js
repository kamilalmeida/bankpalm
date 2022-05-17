
async function criarConta() {
  const elementNome = document.getElementById("nome");
  const elementOverdraftProtection = document.getElementById("cheque-especial");


  if (elementNome.value != "") {
    let objConta = {
      name: elementNome.value,
      overdraftProtection: Number(elementOverdraftProtection.value),
    };
    // chamar POST na API
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objConta),
    };


    try {
      const response = await fetch("http://localhost:4567/accounts/", init);
      const dados = await response.json();
      window.location.href = `http://localhost:3000/transacoes.html?id=${dados.id}`;
      //console.log(dados);
    } catch (error) {
      console.error("erro");
    }
  } else if (!elementNome.value || typeof elementNome.value != "string") {
    let resposta = document.querySelector("div#resposta");
    resposta.classList.add("res");
    resposta.innerHTML = `Por favor, preencha o campo nome`;
  }

}

function load() {
  if (window.location.pathname == "/transacoes.html") {
    getContentPorId();
  }

}

window.onload = load;

//PEGAR USUÁRIO POR ID

async function getContentPorId() {
  let pegarParametro = new URLSearchParams(location.search);
  let parametroId = pegarParametro.get("id");
  console.log(parametroId);

  const init = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // chamar GET na API

  const response = await fetch(`http://localhost:4567/accounts/${parametroId}`, init);
  const dados = await response.json();
  console.log(dados);

  const nomeUser = dados.name;
  const valorSaldo = dados.currentBalance;
  const chequeEspecial = dados.overdraftProtection
  console.log(chequeEspecial);
  const elementoChequeEspecial = document.getElementById("cheque-especial")
  elementoChequeEspecial.innerHTML = chequeEspecial.toFixed(2).replace(".",",")
  const elementoNomeuser = document.getElementById("nome-user");
  elementoNomeuser.innerHTML = `Olá, ${nomeUser}`;
  const elementSaldo = document.getElementById("saldo");
  elementSaldo.innerHTML = valorSaldo;

  gerarHTML(dados);
  handleChange(dados);
}

async function fazerDeposito() {
  let elementCurrentBalance = document.getElementById("transacao-valor");
  let pegarParametro = new URLSearchParams(location.search);
  let parametroId = pegarParametro.get("id");

  let objConta = {
    amount: Number(elementCurrentBalance.value),
    data: gerarData(),
    tipo: "deposito",
  };
  console.log(objConta);

  // chamar post por ID na API
  const init = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objConta),
  };

  const response = await fetch(`http://localhost:4567/accounts/${parametroId}/deposit`, init);
  const dados = await response.json();
  console.log(dados);

  gerarHTML(dados);
  handleChange(dados);
}

async function fazerSaque() {
  const amount = document.getElementById("transacao-valor");
  let pegarParametro = new URLSearchParams(location.search);
  let parametroId = pegarParametro.get("id");

  if (amount.value != '') {
    const objConta = {
      amount: Number(amount.value),
      data: gerarData(),
      tipo: "saque",
    };
    // console.log(objConta);

    // chamar post por ID na API
    const init = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(objConta),
    };

    const response = await fetch(`http://localhost:4567/accounts/${parametroId}/saque`, init);

    const dados = await response.json();
    console.log(dados);

    const resposta = document.querySelector("div#res");
    const resposta2 = document.querySelector("div#res2");

    if (amount.value <= dados.currentBalance) {
      resposta.classList.add("actived");
      setTimeout(() => {
        resposta.classList.remove("actived");
      }, 2000);

      resposta.innerHTML = `Saque realizado!`;

    } else {
      resposta2.classList.add("actived2");
      setTimeout(() => {
        resposta2.classList.remove("actived2");
      }, 2000);

      resposta.classList.add("display-none")

      resposta2.innerHTML = `Saldo insuficiente!`;
    }

    gerarHTML(dados);
  }
}

function gerarHTML(dados) {
  const elementContainer2 = document.getElementById("transacoesDep");
  document.getElementById("transacoesDep").innerHTML = "";
  const elementSaldo = document.getElementById("saldo");
  let saldoNumber = dados.currentBalance
  let saldoString = saldoNumber.toFixed(2).replace(".", ",")
  elementSaldo.innerHTML = `R$ ${saldoString}`;

  dados.arrayDeposit.forEach((dado) => {
    let date = dado.data;
    let valorSaque = dado.valor;
    const element = `
    <div class="saque">
        <strong>${dado.tipo == "deposito" ? "Depósito" : "Saque"}</strong>
        <p>${date}</p>
        <div class="price ${dado.tipo == "deposito" ? "valor-deposito" : "valor-saque"}">
        <strong>R$ ${valorSaque}</strong>
        </div>
    </div>
           `;
    elementContainer2.innerHTML += element;
  });
}

function gerarData() {
  let data = new Date();
  let dia = String(data.getDate()).padStart(2, "0");
  let mes = String(data.getMonth() + 1).padStart(2, "0");
  let ano = data.getFullYear();

  return `${dia}/${mes}/${ano}`;
}

function handleChange(dados) {
  let elementSaldo = document.getElementById("saldo");
  let saldo = dados.currentBalance;
  if (saldo) {
    elementSaldo.innerHTML = `R$ ${saldo}`;
  }
}

function toggleClass(elementToAdd, classToAdd, elementToRevemo, classToRemove) {
  document.getElementById(elementToAdd).classList.add(classToAdd);
  document.getElementById(elementToRevemo).classList.remove(classToRemove);
}

function transacaoSaque() {
  const textoSaque = document.getElementById("textlabel")
  textoSaque.innerHTML = 'Digite o valor de saque'
  document.getElementById("botaoPrincipal2").classList.add("display-block");
  document.getElementById("botaoPrincipal2").classList.remove("display-none");
  document.getElementById("botaoPrincipal").classList.remove("display-block");
  document.getElementById("botaoPrincipal").classList.add("display-none");

  toggleClass("bnt2", "button-actived", "bnt1", "button-actived");
}

function transacaoDeposito() {
  const textoDeposito = document.getElementById("textlabel")
  textoDeposito.innerHTML = 'Digite o valor de depósito'
  document.getElementById("botaoPrincipal").classList.add("display-block");
  document.getElementById("botaoPrincipal").classList.remove("display-none");
  document.getElementById("botaoPrincipal2").classList.remove("display-block");
  document.getElementById("botaoPrincipal2").classList.add("display-none");

  // document.getElementById("bnt1").classList.add("button-actived");
  // document.getElementById("bnt2").classList.remove("button-actived");

  toggleClass("bnt1", "button-actived", "bnt2", "button-actived");
}

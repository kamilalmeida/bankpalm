const valorSaldo = dados.currentBalance;
const chequeEspecial = dados.overdraftProtection
console.log(chequeEspecial);
const elementoChequeEspecial = document.getElementById("cheque-especial")
elementoChequeEspecial.innerHTML = chequeEspecial.toFixed(2).replace(".",",")
const elementoNomeuser = document.getElementById("nome-user");
elementoNomeuser.innerHTML = `Olá, ${nomeUser}`;
const elementSaldo = document.getElementById("saldo");
elementSaldo.innerHTML = valorSaldo;

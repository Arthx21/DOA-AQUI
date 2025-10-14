window.addEventListener("pageshow", () => {
    document.querySelectorAll(".item.selecionado").forEach(item => {
        item.classList.remove("selecionado");
    });
});

const nome = sessionStorage.getItem("nome");
const tipo = sessionStorage.getItem("tipo");
const id = sessionStorage.getItem("id");

// Se não houver dados (usuário não logado), redireciona
if (!nome || !tipo || !id) {
    window.location.href = "login.html";
}

async function carregarpessoa() {
    document.getElementById("nome-usuario").innerHTML = `${nome}`;
}

carregarpessoa();


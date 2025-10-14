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


const API_URL = "http://localhost:5000";

// Pega o id da roupa da URL
const params = new URLSearchParams(window.location.search);
const roupaId = params.get("id");

if (roupaId) {
  // Busca os dados da roupa no backend
  fetch(`${API_URL}/ListarRoupa/${roupaId}`)
    .then(res => res.json())
    .then(roupa => {
      // Preenche o HTML
      document.querySelector(".coluna-esquerda img").src = `data:image/png;base64,${roupa.foto}`;
      document.querySelector(".info-doador p:nth-child(1)").innerHTML = `<strong>ONG:</strong> ${roupa.nomedaong}`;
      document.querySelector(".info-doador p:nth-child(2)").innerHTML = `<strong>Telefone:</strong> ${roupa.telefonedaong}`;
      document.querySelector(".info-doador p:nth-child(3)").innerHTML = `<strong>E-mail:</strong> ${roupa.emaildaong}`;

      document.querySelector(".coluna-direita h2").textContent = roupa.tipo;
      document.querySelector(".coluna-direita p:nth-child(2)").innerHTML = `<strong>Tamanho: ${roupa.tamanho}</strong>`;
      document.querySelector(".coluna-direita p:nth-child(3)").innerHTML = `<strong>Cor: ${roupa.cor}</strong>`;
      document.querySelector(".coluna-direita p:nth-child(4)").innerHTML = `<strong>Gênero: ${roupa.genero}</strong>`;
      document.querySelector(".descricao").innerHTML = `<strong>Descrição:</strong><p>${roupa.descricao}</p>`;
      document.querySelector(".btn-reserv").innerHTML = `<div class="btn-reservar"<a onclick="reservarRoupa(${roupaId})">Quero essa doação</a></div>`;
    })
    .catch(err => console.error("Erro ao carregar roupa:", err));
}

async function reservarRoupa(id) {
  try {
    const response = await fetch(`${API_URL}/AlterarStatus/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      alert("Erro ao reservar!");
      return;
    }

    alert("Roupa reservada com sucesso!");
  } catch (error) {
    console.error(error);
    alert("Ocorreu um erro ao tentar reservar a roupa.");
  }
}


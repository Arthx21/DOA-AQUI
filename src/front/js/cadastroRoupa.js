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


const API_URL = "http://3.91.78.43:5000";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formRoupa");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = document.getElementById("imagem").files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64Image = reader.result.split(",")[1];

      const roupa = {
        Iddoador: sessionStorage.getItem("id"),
        Idong: document.getElementById("idong").value,
        Tipo: document.getElementById("tipo").value,
        Tamanho: document.getElementById("tamanho").value,
        Cor: document.getElementById("cor").value,
        Genero: document.getElementById("genero").value,
        Descricao: document.getElementById("descricao").value,
        Foto: base64Image,
      };

      console.log(roupa);

      const res = await fetch(`${API_URL}/CadastrarRoupa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roupa),
      });

      const msg = await res.text();
      alert(msg);
    };

    reader.readAsDataURL(file);
  });

  carregarONGs(); // carrega as ONGs depois de o DOM existir
});

async function carregarONGs() {
  try {
    const res = await fetch(`${API_URL}/ListarOng`);
    if (!res.ok) throw new Error("Erro ao carregar ONGs");

    const data = await res.json();
    const select = document.getElementById("idong");
    select.innerHTML = "";

    const opcaoPadrao = document.createElement("option");
    opcaoPadrao.value = "";
    opcaoPadrao.disabled = true;
    opcaoPadrao.selected = true;
    opcaoPadrao.textContent = "Selecione a Instituição";
    select.appendChild(opcaoPadrao);

    data.forEach((ong) => {
      const option = document.createElement("option");
      option.value = ong.idong;
      option.textContent = ong.nomedaong;
      select.appendChild(option);
    });


  } catch (error) {
    console.error(error);
    document.getElementById("escolher-ong").innerHTML =
      "<p>Não foi possível carregar as ONGs.</p>";
  }
}

const inputImagem = document.getElementById('imagem');
const botaoImagem = document.querySelector('.botao-imagem');

inputImagem.addEventListener('change', () => {
  if (inputImagem.files.length > 0) {
    botaoImagem.innerHTML = `<span class="circulo">✔</span> Imagem selecionada`;
  } else {
    botaoImagem.innerHTML = `<span class="circulo">+</span> Imagem`;
  }
});


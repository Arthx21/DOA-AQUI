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

const API_URL = "https://doa-aqui.onrender.com";

function rolar(tipo, direcao) {
  document.getElementById(`carrossel-${tipo}`)
    .scrollBy({ left: direcao, behavior: 'smooth' });
}


let todasRoupas = [];

async function getRoupas() {
  const res = await fetch(`${API_URL}/ListarRoupa`);
  const res2 = await fetch(`${API_URL}/ListarOng`);
  const ongs = await res2.json();
  const data = await res.json();

  let ong = {};
    ongs.forEach(o => {
        ong[o.idong] = o.nomedaong;
    });

    data.forEach(r => {

        r.nomedaong = ong[r.idong] || "Desconhecido";
    });

  todasRoupas = data;
  

  // Filtra por status
  const pendentes = data.filter(r => r.status === "Pendente" && r.iddoador == id);
  const disponiveis = data.filter(r => r.status === "Disponivel" && r.iddoador == id);
  const doadas = data.filter(r => r.status === "Doado" && r.iddoador == id);

  // Renderiza cada carrossel
  renderizarRoupas("pendente", pendentes);
  renderizarRoupas("disponivel", disponiveis);
  renderizarRoupas("doado", doadas);
}

function renderizarRoupas(tipo, roupas) {
  const container = document.getElementById(`carrossel-${tipo}`);

  container.innerHTML = roupas.length
    ? roupas.map(r => `
      <div class="item">
        
          <img src="data:image/png;base64,${r.foto}" alt="${r.descricao}">
          <p>${r.tipo} | ${r.cor} | ${r.tamanho}</p>
        
        ${tipo === "pendente"
        ? `
              <div class="botoes-acao">
                <button class="btn-editar" onclick="editarRoupa(${r.idroupa})">
                  <i class="fa fa-edit"></i> Editar
                </button>
                <button class="btn-excluir" onclick="excluirRoupa(${r.idroupa})">
                  <i class="fa fa-trash"></i> Excluir
                </button>
              </div>
            `
        : ""
      }
        ${tipo === "disponivel" || "doado"
        ? `<strong>ONG:</strong><p style="display: inline-block; padding-left: 2px; margin-top: 0;">${r.nomedaong}</p>`
        : ""
      }
      </div>
    `).join("")
    : `<div class="carrossel-vazio">Nenhuma roupa encontrada.</div>`;

}

// Abre o modal e preenche os dados
function editarRoupa(idRoupa) {
  const roupa = todasRoupas.find(r => r.idroupa === idRoupa);
  if (!roupa) return;

  document.getElementById("editar-id").value = roupa.idroupa;
  document.getElementById("editar-tipo").value = roupa.tipo;
  document.getElementById("editar-cor").value = roupa.cor;
  document.getElementById("editar-tamanho").value = roupa.tamanho;
  document.getElementById("editar-descricao").value = roupa.descricao || "";

  document.getElementById("modal-editar").style.display = "flex";
}

// Fecha o modal
function fecharModal() {
  document.getElementById("modal-editar").style.display = "none";
}

// Evento de salvar alterações
document.getElementById("form-editar").addEventListener("submit", async (e) => {
  e.preventDefault();

  const idRoupa = document.getElementById("editar-id").value;
  const roupaAtualizada = {
    Tipo: document.getElementById("editar-tipo").value,
    Cor: document.getElementById("editar-cor").value,
    Tamanho: document.getElementById("editar-tamanho").value,
    Descricao: document.getElementById("editar-descricao").value,
  };

  try {
    const res = await fetch(`${API_URL}/AlterarRoupa/${idRoupa}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roupaAtualizada),
    });

    if (res.ok) {
      alert("Roupa atualizada com sucesso!");
      fecharModal();
      getRoupas(); // recarrega as listas
    } else {
      alert("Erro ao atualizar a roupa.");
    }
  } catch (error) {
    console.error(error);
    alert("Erro ao enviar atualização.");
  }
});


async function excluirRoupa(idRoupa) {
  if (!confirm("Tem certeza que deseja excluir esta roupa?")) return;

  try {
    const res = await fetch(`${API_URL}/ExcluirRoupa/${idRoupa}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Roupa excluída com sucesso!");
      getRoupas(); // Atualiza a lista
    } else {
      alert("Erro ao excluir a roupa.");
    }
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao excluir a roupa.");
  }
}

getRoupas();

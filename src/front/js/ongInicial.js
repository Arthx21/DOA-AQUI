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


async function getRoupas() {
    const id = Number(sessionStorage.getItem("id")); // id da ONG
    const res = await fetch(`${API_URL}/ListarRoupa`);
    const res2 = await fetch(`${API_URL}/ListarOng`);
    const ongs = await res2.json();
    const data = await res.json();

    const ong = ongs.find(o => o.idong === id);

    document.getElementById("nome-usuario").innerHTML = ong.nomedaong;



    // Filtra por status e ONG
    const pendentes = data.filter(r => r.status === "Pendente" && r.idong === id);
    const disponiveis = data.filter(r => r.status === "Disponivel" && r.idong === id);
    const doadas = data.filter(r => r.status === "Doado" && r.idong === id);

    renderizarRoupas("pendentes", pendentes);
    renderizarRoupas("disponiveis", disponiveis);
    renderizarRoupas("doadas", doadas);
}

async function carregarEnderecoOng() {
    const id = Number(sessionStorage.getItem("id"));

    try {
        const res = await fetch(`${API_URL}/ListarOng`);
        const ongs = await res.json();
        const ong = ongs.find(o => o.idong === id);

        if (!ong) {
            alert("ONG não encontrada!");
            return;
        }


        // Preenche os campos do formulário com os dados atuais
        document.getElementById("rua").value = ong.endereco?.rua || "";
        document.getElementById("numero").value = ong.endereco?.numero || "";
        document.getElementById("bairro").value = ong.endereco?.bairro || "";
        document.getElementById("cidade").value = ong.endereco?.cidade || "";
        document.getElementById("estado").value = ong.endereco?.estado || "";

    } catch (erro) {
        console.error("Erro ao carregar informações da ONG:", erro);
        alert("Erro ao carregar dados da ONG.");
    }
}

function renderizarRoupas(tipo, roupas) {
    const container = document.getElementById(`carrossel-${tipo}`);

    container.innerHTML = roupas.length ? roupas.map(r => `
  <div class="item" onclick='abrirModalRoupa(${JSON.stringify(r)})'>
    <img src="data:image/png;base64,${r.foto}" alt="${r.descricao}">
    <p>${r.tipo} | ${r.cor} | ${r.tamanho}</p>
    ${tipo === "pendentes" ? `
      <button class="btn-registrar" onclick="event.stopPropagation(); registrarRoupa(${r.idroupa})">
        Registrar
      </button>` : ""}
  </div>
`).join('') : "<p>Nenhuma roupa encontrada.</p>";

}

// Função para registrar roupa como disponível
async function registrarRoupa(idRoupa) {
    if (!confirm("Deseja registrar esta roupa como disponível?")) return;

    try {
        const res = await fetch(`${API_URL}/RegistrarRoupa/${idRoupa}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idong: id, status: "Disponivel" })
        });

        if (res.ok) {
            alert("Roupa registrada com sucesso!");
            getRoupas(); // Atualiza todos os carrosséis
        } else {
            alert("Erro ao registrar roupa.");
        }
    } catch (error) {
        console.error(error);
        alert("Erro ao registrar roupa.");
    }
}

function abrirModalRoupa(roupa) {
    document.getElementById("detalhe-foto").src = `data:image/png;base64,${roupa.foto}`;
    document.getElementById("detalhe-tipo").textContent = roupa.tipo;
    document.getElementById("detalhe-cor").textContent = roupa.cor;
    document.getElementById("detalhe-tamanho").textContent = roupa.tamanho;
    document.getElementById("detalhe-descricao").textContent = roupa.descricao;
    document.getElementById("detalhe-status").textContent = roupa.status;

    document.getElementById("modal-roupa").style.display = "flex";
}

function fecharModalRoupa() {
    document.getElementById("modal-roupa").style.display = "none";
}

// Fecha o modal clicando fora
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal-roupa");
    if (e.target === modal) {
        fecharModalRoupa();
    }
});


getRoupas();

// Abrir modal
document.querySelector(".user-info button").addEventListener("click", async () => {
    await carregarEnderecoOng(); // carrega os dados atuais antes de abrir
    document.getElementById("modal-endereco").style.display = "flex";
});

// Fechar modal
function fecharModalEndereco() {
    document.getElementById("modal-endereco").style.display = "none";
}

// Fechar ao clicar fora do conteúdo
window.addEventListener("click", (e) => {
    const modal = document.getElementById("modal-endereco");
    if (e.target === modal) {
        fecharModalEndereco();
    }
});

// Submissão do formulário
document.getElementById("form-endereco").addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = Number(sessionStorage.getItem("id")); // id da ONG

    // Pega os dados do formulário
    const rua = document.getElementById("rua").value.trim();
    const numero = document.getElementById("numero").value.trim();
    const cidade = document.getElementById("cidade").value.trim();
    const estado = document.getElementById("estado").value.trim();
    const bairro = document.getElementById("bairro").value.trim();

    const enderecoCompleto = `${rua}, ${numero}, ${cidade}, ${estado}, ${bairro}`;

    // Consulta ao Nominatim para pegar latitude e longitude
    let latitude = "";
    let longitude = "";

    try {
        const resposta = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(enderecoCompleto)}`
        );
        const dados = await resposta.json();

        if (dados.length > 0) {
            latitude = dados[0].lat;
            longitude = dados[0].lon;
        } else {
            alert("Endereço não encontrado! Verifique os dados digitados.");
            return;
        }
    } catch (erro) {
        console.error("Erro ao consultar o OpenStreetMap:", erro);
        alert("Erro ao buscar coordenadas do endereço.");
        return;
    }

    // Monta o objeto atualizado da ONG
    const ongAtualizada = {
        endereco: {
            Rua: rua,
            Numero: numero,
            Cidade: cidade,
            Estado: estado,
            Bairro: bairro
        },
        Latitude: latitude,
        Longitude: longitude
    };

    console.log(latitude + "      " + longitude);

    try {
        // Envia para o backend via PUT
        const res = await fetch(`${API_URL}/AtualizarEndereco/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ongAtualizada)
        });

        if (res.ok) {
            alert("Endereço atualizado com sucesso!");
            fecharModalEndereco();
        } else {
            alert("Erro ao atualizar endereço.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao enviar atualização para o servidor.");
    }
});


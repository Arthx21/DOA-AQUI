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

const searchBar = document.querySelector(".search-bar");

searchBar.addEventListener("input", () => {
    const searchText = searchBar.value.toLowerCase();

    const items = document.querySelectorAll("#carrossel .item, #carrossel2 .item");

    items.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(searchText)) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
});



function rolarEsquerda() {
    document.getElementById("carrossel")
        .scrollBy({ left: -220, behavior: 'smooth' });
}

function rolarDireita() {
    document.getElementById("carrossel")
        .scrollBy({ left: 220, behavior: 'smooth' });
}

function rolarEsquerda2() {
    document.getElementById("carrossel2")
        .scrollBy({ left: -220, behavior: 'smooth' });
}

function rolarDireita2() {
    document.getElementById("carrossel2")
        .scrollBy({ left: 220, behavior: 'smooth' });
}

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links.mobile');
    navLinks.classList.toggle('active');
}




/* Back-END   */

const API_URL = "https://doa-aqui.onrender.com";


async function getRoupas() {
    const res = await fetch(`${API_URL}/ListarRoupa`);
    const res2 = await fetch(`${API_URL}/ListarOng`);
    const ongs = await res2.json();
    const data = await res.json();

    // Cria mapa idong → nome
    let ongMap = {};
    ongs.forEach(o => {
        ongMap[o.idong] = o.nomedaong;
    });

    // Pega o idong da URL
    const params = new URLSearchParams(window.location.search);
    const idongParam = params.get("idong");

    // Adiciona nome da ONG nas roupas
    data.forEach(r => {
        r.nomedaong = ongMap[r.idong] || "Desconhecido";
    });

    // Se tiver idong, filtra apenas as roupas dessa ONG
    let roupasFiltradas = data;
    if (idongParam) {
        roupasFiltradas = data.filter(r => r.idong == idongParam);
    }

    // Filtra apenas as roupas disponíveis
    const roupasDisponiveis = roupasFiltradas.filter(r =>
        r.status && r.status.toLowerCase() === "disponivel"
    );

    // Se tiver idong, mostra o nome da ONG no HTML
    if (idongParam && ongMap[idongParam]) {
        const titulo = document.getElementById("tituloOng");
        titulo.textContent = `Roupas da ONG: ${ongMap[idongParam]}`;

        // Se não houver roupas, mostra aviso
        if (roupasDisponiveis.length === 0) {
            titulo.textContent += " — Nenhuma roupa disponível no momento 😕";
        }
    }

    // Agrupa roupas por gênero
    const roupasPorGenero = roupasDisponiveis.reduce((grupos, roupa) => {
        const genero = roupa.genero || "Outros";
        if (!grupos[genero]) grupos[genero] = [];
        grupos[genero].push(roupa);
        return grupos;
    }, {});

    // Seleciona as listas no HTML
    const listaMasculina = document.getElementById("carrossel");
    const listaFeminina = document.getElementById("carrossel2");

    // Renderiza roupas masculinas
    listaMasculina.innerHTML = roupasPorGenero["Masculino"]
        ?.map(r => `
            <div class="item">
                <a href="visualizacaoRoupa.html?id=${r.idroupa}">
                    <img src="data:image/png;base64,${r.foto}" alt="${r.descricao}">
                    <p>${r.tipo} | ${r.cor} | ${r.tamanho}<br> ONG: ${r.nomedaong}</p>
                </a>
            </div>
        `).join("") || "";

    // Renderiza roupas femininas
    listaFeminina.innerHTML = roupasPorGenero["Feminino"]
        ?.map(r => `
            <div class="item">
                <a href="visualizacaoRoupa.html?id=${r.idroupa}">
                    <img src="data:image/png;base64,${r.foto}" alt="${r.descricao}">
                    <p>${r.tipo} | ${r.cor} | ${r.tamanho}<br> ONG: ${r.nomedaong}</p>
                </a>
            </div>
        `).join("") || "";
}




getRoupas();

document.addEventListener("DOMContentLoaded", () => {
    const tipo = sessionStorage.getItem("tipo");

    // Seleciona todos os botões "Quero doar"
    const botoesDoar = document.querySelectorAll(".btn-doar");

    if (tipo === "Receptor") {
        botoesDoar.forEach(botao => botao.style.display = "none");
    } else if (tipo === "Doador") {
        botoesDoar.forEach(botao => botao.style.display = "inline");
    }
});
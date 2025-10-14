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

    let ong = {};
    ongs.forEach(o => {
        ong[o.idong] = o.nomedaong;
    });

    data.forEach(r => {

        r.nomedaong = ong[r.idong] || "Desconhecido";
    });

    const roupasDisponiveis = data.filter(r => 
        r.status && r.status.toLowerCase() === "disponivel"
    );

    const roupasPorGenero = roupasDisponiveis.reduce((grupos, roupa) => {
        const genero = roupa.genero || "Outros";
        if (!grupos[genero]) grupos[genero] = []; 
        grupos[genero].push(roupa);
        return grupos;
    }, {});

    const listaFeminina = document.getElementById("carrossel2");


    listaFeminina.innerHTML = roupasPorGenero["Feminino"]
        ?.map(r => `
            <div class="item"><a href="visualizacaoRoupa.html?id=${r.idroupa}">
                <img src="data:image/png;base64,${r.foto}" alt="${r.descricao}">
                <p>${r.tipo} | ${r.cor} | ${r.tamanho} | <br> ONG: ${r.nomedaong}</p></a>
            </div>
        `).join("") || "";
}

getRoupas();
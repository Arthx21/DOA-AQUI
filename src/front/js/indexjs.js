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

const API_URL = "http://3.91.78.43:5000"; 


async function getRoupas() {
    const res = await fetch(`${API_URL}/ListarRoupa`);
    const data = await res.json();

    const roupasPorGenero = data.reduce((grupos, roupa) => {
        const genero = roupa.genero || "Outros";
        if (!grupos[genero]) grupos[genero] = []; 
        grupos[genero].push(roupa);
        return grupos;
    }, {});

    const listaMasculina = document.getElementById("carrossel");
    const listaFeminina = document.getElementById("carrossel2");

    listaMasculina.innerHTML = roupasPorGenero["Masculino"]
        ?.map(r => `
            <div class="item">
                <img src="data:image/png;base64,${r.foto}" alt="${r.descricao}">
                <p>${r.tipo} | ${r.cor} | ${r.tamanho} | Doador: ${r.nomedoador}</p>
            </div>
        `).join("") || "";

    listaFeminina.innerHTML = roupasPorGenero["Feminino"]
        ?.map(r => `
            <div class="item">
                <img src="data:image/png;base64,${r.foto}" alt="${r.descricao}">
                <p>${r.tipo} | ${r.cor} | ${r.tamanho} | Doador: ${r.nomedoador}</p>
            </div>
        `).join("") || "";
}

getRoupas();
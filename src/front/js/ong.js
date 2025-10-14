const nome = sessionStorage.getItem("nome");
const tipo = sessionStorage.getItem("tipo");
const id = sessionStorage.getItem("id");

// Se não houver dados (usuário não logado), redireciona
if (!nome || !tipo || !id) {
    window.location.href = "login.html";
}

const API_URL = "https://doa-aqui.vercel.app";

// Inicializa o mapa
const map = L.map('map').setView([-19.945928, -44.203712], 11); // centro inicial

// Camada do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Função para carregar ONGs do backend
async function carregarONGs() {
    const res = await fetch(`${API_URL}/ListarOng`); // supondo que você tenha GET /getOngs
    const data = await res.json();

    data.forEach(ong => {
        const marker = L.marker([ong.latitude, ong.longitude]).addTo(map);
        marker.bindPopup(`
    <b>${ong.nomedaong}</b><br>
    ${ong.endereco.rua}, ${ong.endereco.numero}<br>
    ${ong.endereco.bairro} - ${ong.endereco.cidade}, ${ong.endereco.estado}<br>
    <br>
    <button onclick="verRoupas(${ong.idong})" 
            style="margin-top:5px; padding:6px 10px; background-color:#2E8B57; color:white; border:none; border-radius:6px; cursor:pointer;">
        Ver roupas
    </button>
    `);
    });
}

function verRoupas(idong) {
    window.location.href = `receptorinicial.html?idong=${idong}`;
}


// Carrega os marcadores ao iniciar
carregarONGs();
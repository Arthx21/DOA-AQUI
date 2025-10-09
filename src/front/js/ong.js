const API_URL = "http://localhost:5000"; // URL do seu backend

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
                CEP: ${ong.endereco.cep}
            `);
        });
    }

    // Carrega os marcadores ao iniciar
    carregarONGs();
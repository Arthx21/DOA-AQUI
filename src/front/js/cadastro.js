const API_URL = "https://doa-aqui.onrender.com";

function mudarFormulario(tipo, botao) {
  const formularios = document.querySelectorAll(".formulario");
  formularios.forEach(f => f.classList.remove("ativo"));
  document.getElementById(`form-${tipo}`).classList.add("ativo");

  const botoes = document.querySelectorAll(".btn-tipo");
  botoes.forEach(b => b.classList.remove("ativo"));
  botao.classList.add("ativo");
}

function validarSenhas(senha, confirmar) {
  if (senha !== confirmar) {
    alert("As senhas não coincidem!");
    return false;
  }
  return true;
}

// Função para aplicar a máscara de telefone automaticamente
function aplicarMascaraTelefone(input) {
  input.addEventListener("input", (e) => {
    let valor = e.target.value.replace(/\D/g, ""); // remove tudo que não for número

    if (valor.length > 11) valor = valor.slice(0, 11); // limita a 11 dígitos

    if (valor.length > 10) {
      // Formato (99) 99999-9999
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (valor.length > 6) {
      // Formato (99) 9999-9999
      valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else if (valor.length > 2) {
      // Formato (99) 9999
      valor = valor.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (valor.length > 0) {
      // Formato (9
      valor = valor.replace(/^(\d{0,2})/, "($1");
    }

    e.target.value = valor;
  });
}

// Aplica a máscara em todos os campos de telefone
document.addEventListener("DOMContentLoaded", () => {
  const telefones = document.querySelectorAll('input[type="tel"], input[id*="telefone"]');
  telefones.forEach(input => aplicarMascaraTelefone(input));
});


// --- DOADOR ---
document.getElementById("form-doador").addEventListener("submit", async (e) => {
  e.preventDefault();

  const senha = document.getElementById("senha-doador").value.trim();
  const confirmar = document.getElementById("confirmar-doador").value.trim();
  if (!validarSenhas(senha, confirmar)) return;

  const pessoa = {
    Nome: document.getElementById("nome-doador").value.trim(),
    Email: document.getElementById("email-doador").value.trim(),
    Telefone: document.getElementById("telefone-doador").value.trim(),
    Senha: senha,
    Tipo: "Doador"
  };

  const response = await fetch(`${API_URL}/CadastrarDoador`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pessoa)
  });

  if (!response.ok) {
    alert("Erro ao cadastrar doador!");
    return;
  }

  alert("Cadastro de Doador realizado com sucesso!");
  window.location.href = "login.html";
});

// --- RECEPTOR ---
document.getElementById("form-receptor").addEventListener("submit", async (e) => {
  e.preventDefault();

  const senha = document.getElementById("senha-receptor").value.trim();
  const confirmar = document.getElementById("confirmar-receptor").value.trim();
  if (!validarSenhas(senha, confirmar)) return;

  const pessoa = {
    Nome: document.getElementById("nome-receptor").value.trim(),
    Email: document.getElementById("email-receptor").value.trim(),
    Telefone: document.getElementById("telefone-receptor").value.trim(),
    Senha: senha,
    Tipo: "Receptor"
  };

  const response = await fetch(`${API_URL}/CadastrarReceptor`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pessoa)
  });

  if (!response.ok) {
    alert("Erro ao cadastrar receptor!");
    return;
  }

  alert("Cadastro de Receptor realizado com sucesso!");
  window.location.href = "login.html";
});

// --- ONG ---
document.getElementById("form-ong").addEventListener("submit", async (e) => {
  e.preventDefault();

  const senha = document.getElementById("senha-ong").value.trim();
  const confirmar = document.getElementById("confirmar-ong").value.trim();
  if (!validarSenhas(senha, confirmar)) return;

  // Monta o endereço para consulta
  const rua = document.getElementById("rua-ong").value.trim();
  const numero = document.getElementById("numero-ong").value.trim();
  const bairro = document.getElementById("bairro-ong").value.trim();
  const cidade = document.getElementById("cidade-ong").value.trim();
  const estado = document.getElementById("estado-ong").value.trim();

  const enderecoCompleto = `${rua}, ${numero}, ${bairro}, ${cidade}, ${estado}`;

  // Faz requisição ao Nominatim
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

  // Cria o objeto da ONG
  const ong = {
    Nome: document.getElementById("nome-ong").value.trim(),
    Email: document.getElementById("email-ong").value.trim(),
    Telefone: document.getElementById("telefone-ong").value.trim(),
    Senha: senha,
    Tipo: "Ong",
    NomeDaOng: document.getElementById("nomedaong-ong").value.trim(),
    Latitude: latitude,
    Longitude: longitude,
    Endereco: {
      Bairro: bairro,
      Estado: estado,
      Rua: rua,
      Cidade: cidade,
      Numero: numero
    }
  };

  // Envia para o backend
  const response = await fetch(`${API_URL}/CadastrarOng`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ong)
  });

  if (!response.ok) {
    alert("Erro ao cadastrar ONG!");
    return;
  }

  alert("Cadastro da ONG realizado com sucesso!");
  window.location.href = "login.html";
});


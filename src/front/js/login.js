const API_URL = "https://doa-aqui.vercel.app";

document.querySelector("form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  const response = await fetch(`${API_URL}/Login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha })
  });

  if (!response.ok) {
    alert("Email ou senha incorretos!");
    return;
  }

  const data = await response.json();

  sessionStorage.setItem("id", data.id);
  sessionStorage.setItem("nome", data.nome);
  sessionStorage.setItem("tipo", data.tipo);

  if (data.tipo === "Ong") {
    window.location.href = "ongInicial.html";
    return;
  } else if (data.tipo === "Doador") {
    window.location.href = "doadorinicial.html";
    return;
  } else if (data.tipo === "Receptor") {
    window.location.href = "receptorinicial.html";
    return;
  }
  
});

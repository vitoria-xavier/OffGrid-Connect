// Detecta se o dispositivo está conectado à internet
function atualizarStatusConexao() {
    const status = document.getElementById("status-conexao");

    if (navigator.onLine) {
        status.textContent = "Conectado";
    } else {
        status.textContent = "Sem conexão";
    }
}

// Verifica o estado atual
atualizarStatusConexao();

// Atualiza quando a conexão muda
window.addEventListener("online", atualizarStatusConexao);
window.addEventListener("offline", atualizarStatusConexao);

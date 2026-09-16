// ================================
// OFFGRID CONNECT
// ================================

// Detecta o estado da conexão
function atualizarStatusConexao() {
    const status = document.getElementById("status-conexao");
    const ponto = document.querySelector(".status-ponto");

    if (navigator.onLine) {
        status.textContent = "Conectado";
        ponto.style.background = "#22c55e";
    } else {
        status.textContent = "Sem conexão";
        ponto.style.background = "#ef4444";
    }
}

// Verifica a conexão ao abrir
atualizarStatusConexao();

// Atualiza quando a conexão muda
window.addEventListener("online", atualizarStatusConexao);
window.addEventListener("offline", atualizarStatusConexao);


// ================================
// ABRIR FORMULÁRIO
// ================================

function mostrarFormulario(categoria) {

    const formulario = document.getElementById("area-formulario");

    formulario.style.display = "block";

    document.getElementById("categoria").value = categoria;

    formulario.scrollIntoView({
        behavior: "smooth"
    });
}


// ================================
// SALVAR INFORMAÇÃO
// ================================

function salvarInformacao() {

    const titulo = document.getElementById("titulo").value.trim();
    const categoria = document.getElementById("categoria").value;
    const descricao = document.getElementById("descricao").value.trim();

    if (titulo === "" || descricao === "") {
        alert("Preencha o título e a descrição.");
        return;
    }

    const informacao = {
        id: Date.now(),
        titulo: titulo,
        categoria: categoria,
        descricao: descricao
    };

    const informacoes = JSON.parse(
        localStorage.getItem("offgrid_informacoes")
    ) || [];

    informacoes.push(informacao);

    localStorage.setItem(
        "offgrid_informacoes",
        JSON.stringify(informacoes)
    );

    document.getElementById("titulo").value = "";
    document.getElementById("descricao").value = "";

    mostrarInformacoes();

    alert("Informação salva com sucesso!");
}


// ================================
// MOSTRAR INFORMAÇÕES
// ================================

function mostrarInformacoes() {

    const area = document.getElementById("informacoes-salvas");

    const informacoes = JSON.parse(
        localStorage.getItem("offgrid_informacoes")
    ) || [];

    area.innerHTML = "";

    if (informacoes.length === 0) {

        area.innerHTML = `
            <p class="vazio">
                Nenhuma informação salva ainda.
            </p>
        `;

        return;
    }

    informacoes.forEach(function(informacao) {

        const elemento = document.createElement("div");

        elemento.className = "informacao";

        elemento.innerHTML = `
            <h3>${informacao.titulo}</h3>

            <small>
                ${informacao.categoria}
            </small>

            <p>
                ${informacao.descricao}
            </p>

            <button
                class="botao-excluir"
                onclick="excluirInformacao(${informacao.id})"
            >
                🗑️ Excluir
            </button>
        `;

        area.appendChild(elemento);
    });
}


// ================================
// EXCLUIR INFORMAÇÃO
// ================================

function excluirInformacao(id) {

    let informacoes = JSON.parse(
        localStorage.getItem("offgrid_informacoes")
    ) || [];

    informacoes = informacoes.filter(function(informacao) {
        return informacao.id !== id;
    });

    localStorage.setItem(
        "offgrid_informacoes",
        JSON.stringify(informacoes)
    );

    mostrarInformacoes();
}


// ================================
// CARREGAR INFORMAÇÕES AO ABRIR
// ================================

mostrarInformacoes();

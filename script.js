"use strict";

const CHAVE = "offgrid_informacoes";

function lerInformacoes() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE) || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    console.error("Erro ao ler informações:", erro);
    return [];
  }
}

function salvarLista(lista) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista));
    return true;
  } catch (erro) {
    console.error("Erro ao salvar:", erro);
    alert("Não foi possível salvar. Verifique o espaço disponível no aparelho.");
    return false;
  }
}

function atualizarStatusConexao() {
  const status = document.getElementById("status-conexao");
  const ponto = document.querySelector(".status-ponto");
  if (!status || !ponto) return;

  const conectado = navigator.onLine;
  status.textContent = conectado ? "Conectado" : "Sem conexão";
  ponto.style.background = conectado ? "#22c55e" : "#ef4444";
}

window.addEventListener("online", atualizarStatusConexao);
window.addEventListener("offline", atualizarStatusConexao);

function mostrarFormulario(categoria) {
  const formulario = document.getElementById("area-formulario");
  const campoCategoria = document.getElementById("categoria");
  if (!formulario || !campoCategoria) return;

  campoCategoria.value = categoria;
  formulario.style.display = "block";
  formulario.scrollIntoView({ behavior: "smooth" });
}

function salvarInformacao() {
  const titulo = document.getElementById("titulo").value.trim();
  const categoria = document.getElementById("categoria").value;
  const descricao = document.getElementById("descricao").value.trim();

  if (!titulo || !descricao) {
    alert("Preencha o título e a descrição.");
    return;
  }

  const informacoes = lerInformacoes();
  informacoes.push({
    id: Date.now() + Math.random(),
    titulo,
    categoria,
    descricao,
    criadaEm: new Date().toISOString()
  });

  if (!salvarLista(informacoes)) return;

  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";

  mostrarInformacoes();
  alert("Informação salva com sucesso!");
}

function mostrarInformacoes() {
  const area = document.getElementById("informacoes-salvas");
  if (!area) return;

  area.replaceChildren();
  const informacoes = lerInformacoes();

  if (informacoes.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Nenhuma informação salva ainda.";
    area.appendChild(vazio);
    return;
  }

  informacoes.forEach((info) => {
    const card = document.createElement("div");
    card.className = "informacao";

    const titulo = document.createElement("h3");
    titulo.textContent = info.titulo;

    const categoria = document.createElement("small");
    categoria.textContent = info.categoria;

    const descricao = document.createElement("p");
    descricao.textContent = info.descricao;

    const excluir = document.createElement("button");
    excluir.className = "botao-excluir";
    excluir.type = "button";
    excluir.textContent = "🗑️ Excluir";
    excluir.addEventListener("click", () => {
      excluirInformacao(info.id);
    });

    card.append(titulo, categoria, descricao, excluir);
    area.appendChild(card);
  });
}

function excluirInformacao(id) {
  if (!confirm("Deseja excluir esta informação?")) return;

  const informacoes = lerInformacoes().filter(
    (info) => info.id !== id
  );

  if (salvarLista(informacoes)) {
    mostrarInformacoes();
  }
}

// Mantém as funções acessíveis aos botões do index.html.
window.mostrarFormulario = mostrarFormulario;
window.salvarInformacao = salvarInformacao;
window.mostrarInformacoes = mostrarInformacoes;
window.excluirInformacao = excluirInformacao;

document.addEventListener("DOMContentLoaded", () => {
  atualizarStatusConexao();
  mostrarInformacoes();
});

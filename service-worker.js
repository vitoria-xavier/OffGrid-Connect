
const CACHE_NAME = "offgrid-connect-v2";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ARQUIVOS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(
        nomes
          .filter((nome) =>
            nome.startsWith("offgrid-connect-") &&
            nome !== CACHE_NAME
          )
          .map((nome) => caches.delete(nome))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const requisicao = event.request;
  const url = new URL(requisicao.url);

  if (
    requisicao.method !== "GET" ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  // Para páginas, tenta a rede e usa o cache como alternativa.
  if (requisicao.mode === "navigate") {
    event.respondWith(
      fetch(requisicao)
        .then((resposta) => {
          if (resposta.ok) {
            const copia = resposta.clone();
            caches.open(CACHE_NAME)
              .then((cache) => cache.put("./index.html", copia));
          }
          return resposta;
        })
        .catch(async () => {
          return (
            await caches.match(requisicao) ||
            await caches.match("./index.html") ||
            Response.error()
          );
        })
    );
    return;
  }

  // Para arquivos estáticos, prioriza o cache.
  event.respondWith(
    caches.match(requisicao).then((resposta) => {
      if (resposta) return resposta;

      return fetch(requisicao).then((respostaRede) => {
        if (respostaRede.ok) {
          const copia = respostaRede.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(requisicao, copia));
        }
        return respostaRede;
      });
    })
  );
});

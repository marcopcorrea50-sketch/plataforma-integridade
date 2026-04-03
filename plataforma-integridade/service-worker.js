const CACHE_NAME = "portal-integridade-v7";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./data/projects.js",
  "./projects/relatorio-bfd-silo2/index.html",
  "./projects/formulario-relatorio-inspecao/index.html",
  "./projects/inspectpro-s11d/index.html",
  "./projects/fmds-riscos/index.html",
  "./projects/instrucao-tarefas-industrial/index.html",
  "./projects/instrucao-tarefas-light/index.html",
  "./projects/lista-material-editor/index.html",
  "./projects/fmds-pessoas/index.html",
  "./projects/central-kaizen/index.html",
  "./projects/painel-rotina-performance/index.html",
  "./projects/auditorias-conformidade/index.html",
  "./projects/gestao-mudanca/index.html",
  "./projects/documentos-referencia/index.html"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

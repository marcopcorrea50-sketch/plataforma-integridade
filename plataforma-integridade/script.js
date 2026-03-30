const projectsGrid = document.getElementById("projectsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const resultsText = document.getElementById("resultsText");
const sectionTitle = document.getElementById("sectionTitle");
const emptyState = document.getElementById("emptyState");
const totalModules = document.getElementById("totalModules");
const statCategories = document.getElementById("statCategories");
const sidebarNav = document.getElementById("sidebarNav");

let activeCategory = "Todos";

function getUniqueCategories(projectList) {
  return [...new Set(projectList.map((project) => project.category))].sort((a, b) => {
    if (a === "Documentos de Referência") return 1;
    if (b === "Documentos de Referência") return -1;
    return a.localeCompare(b, "pt-BR");
  });
}

function populateCategories() {
  const categories = getUniqueCategories(projects);

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  statCategories.textContent = 10;
}

function updateStats() {
  totalModules.textContent = projects.length;
}

function createCard(project) {
  const card = document.createElement("article");
  card.className = "module-card";

  card.innerHTML = `
    <div class="module-top">
      <div class="module-icon">${project.icon || "📁"}</div>
      <span class="module-category">${project.category}</span>
    </div>

    <h4 class="module-title">${project.title}</h4>
    <p class="module-description">${project.description}</p>

    <div class="module-meta">
      <span class="module-badge">Prioridade: ${project.priority}</span>
      <span class="module-badge">Público: ${project.audience}</span>
    </div>

    <div class="module-actions">
      <span class="module-id">${project.id}</span>
      <a class="module-link" href="${project.link}" target="_blank" rel="noopener noreferrer">
        Abrir módulo
      </a>
    </div>
  `;

  return card;
}

function setSectionTitle(category, count) {
  if (category === "Todos") {
    sectionTitle.textContent = "Dashboard VPS";
    resultsText.textContent = `${count} módulo(s) disponível(is) no portal.`;
    return;
  }

  sectionTitle.textContent = category;
  resultsText.textContent = `${count} módulo(s) localizado(s) em ${category}.`;
}

function renderProjects(projectList, category = "Todos") {
  projectsGrid.innerHTML = "";

  if (projectList.length === 0) {
    emptyState.classList.remove("hidden");
    setSectionTitle(category, 0);
    resultsText.textContent = "Nenhum módulo corresponde ao filtro atual.";
    return;
  }

  emptyState.classList.add("hidden");

  projectList.forEach((project) => {
    projectsGrid.appendChild(createCard(project));
  });

  setSectionTitle(category, projectList.length);
}

function applyFilters() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  const filtered = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm) ||
      project.category.toLowerCase().includes(searchTerm);

    const matchesCategory =
      activeCategory === "Todos" || project.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  renderProjects(filtered, activeCategory);
}

function handleSidebarClick(event) {
  const button = event.target.closest(".nav-item");
  if (!button) return;

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });

  button.classList.add("active");
  activeCategory = button.dataset.category;
  categoryFilter.value = activeCategory;
  applyFilters();
}

function handleSelectChange() {
  activeCategory = categoryFilter.value;

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.category === activeCategory);
  });

  applyFilters();
}

function init() {
  populateCategories();
  updateStats();
  renderProjects(projects);

  searchInput.addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", handleSelectChange);
  sidebarNav.addEventListener("click", handleSidebarClick);
}

init();
const weekDays = [
  { short: "SEG", label: "Segunda", offset: 0 },
  { short: "TER", label: "Terca", offset: 1 },
  { short: "QUA", label: "Quarta", offset: 2 },
  { short: "QUI", label: "Quinta", offset: 3 },
  { short: "SEX", label: "Sexta", offset: 4 }
];

const STORAGE_KEY = "dssma-digital-oficial-semanal-v2";

const daySessions = weekDays.map((_, index) => ({
  topic: index === 0 ? "DSSMA Digital - Como Estou?" : "",
  conductor: ""
}));

const participants = [
  createPerson("BALBINO JOSE FRAZAO FILHO", "1992511"),
  createPerson("ANA PAULA ALVES MARQUES", "Sem matricula"),
  createPerson("CLEIDE MARIA CARDOSO", "AL08289"),
  createPerson("ELIAS DA COSTA E SILVA", "81055583"),
  createPerson("ELLEN SUENIA RODRIGUES DA COSTA", "6452008"),
  createPerson("EMERSON LENO MOREIRA", "AL08466"),
  createPerson("HERNANDES CANDIDO DE OLIVEIRA", "AL08468"),
  createPerson("HILDOMAR LEMOS MOREIRA", "AL23604"),
  createPerson("IAGO VICTOR CORDEIRO SANTOS", "AL08301"),
  createPerson("JOSUE SAMPAIO MOURA", "AL08525"),
  createPerson("JULIA GABRIELA DA SILVA", "B1024893"),
  createPerson("LINGY SOUZA TAVARES", "AL08382"),
  createPerson("MARCO ANTONIO PENHA CORREA", "1495822"),
  createPerson("MARIA VANEUZA DE ARAUJO", "Sem matricula"),
  createPerson("RAIMUNDO NONATO DA SILVA SANTOS", "AL08336"),
  createPerson("RAIMUNDO SERGIO CARDOSO DE SOUSA", "81046659"),
  createPerson("SAULO DOS SANTOS PEREIRA", "81025170"),
  createPerson("TAMER LOPES DE ANDRADE", "AL08570")
];

let selectedIndex = 0;
let selectedDayIndex = 0;
let selectedMood = "";
let isDrawingSignature = false;
let hasSignature = false;
let isRestoringState = false;

const rows = document.querySelector("#participantRows");
const currentName = document.querySelector("#currentName");
const currentBadge = document.querySelector("#currentBadge");
const currentInitials = document.querySelector("#currentInitials");
const currentStatus = document.querySelector("#currentStatus");
const signatureCanvas = document.querySelector("#signatureCanvas");
const signatureContext = signatureCanvas.getContext("2d");
const alertBox = document.querySelector("#alertBox");
const goodBtn = document.querySelector("#goodBtn");
const badBtn = document.querySelector("#badBtn");

function createPerson(name, badge = "") {
  return {
    name: name.trim().toUpperCase(),
    badge: badge.trim() || "Sem matricula",
    days: weekDays.map(createDayRecord),
    status: "pending",
    mood: "",
    signature: "",
    signedAt: "",
    note: ""
  };
}

function createDayRecord() {
  return {
    status: "pending",
    mood: "",
    signature: "",
    signedAt: "",
    note: ""
  };
}

function dayRecord(person, dayIndex = selectedDayIndex) {
  if (!person.days) {
    person.days = weekDays.map((_, index) => ({
      status: index === 0 ? person.status : "pending",
      mood: index === 0 ? person.mood : "",
      signature: index === 0 ? person.signature : "",
      signedAt: index === 0 ? person.signedAt : "",
      note: index === 0 ? person.note : ""
    }));
  }
  if (!person.days[dayIndex]) person.days[dayIndex] = createDayRecord();
  return person.days[dayIndex];
}

function normalizePerson(value) {
  const person = createPerson(value?.name || "", value?.badge || "");
  person.days = weekDays.map((_, index) => ({
    ...createDayRecord(),
    ...(Array.isArray(value?.days) ? value.days[index] : {})
  }));
  return person;
}

function saveAppState() {
  if (isRestoringState) return;
  try {
    saveCurrentDaySession();
    const state = {
      version: 2,
      selectedIndex,
      selectedDayIndex,
      daySessions,
      session: {
        date: document.querySelector("#sessionDateInput").value,
        time: document.querySelector("#sessionTimeInput").value,
        area: document.querySelector("#sessionArea").value.trim(),
        shift: document.querySelector("#sessionShift").value.trim()
      },
      participants: participants.map((person) => ({
        name: person.name,
        badge: person.badge,
        days: weekDays.map((_, index) => dayRecord(person, index))
      }))
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    document.querySelector("#finalMessage").textContent = "Nao foi possivel salvar automaticamente neste navegador.";
  }
}

function loadAppState() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!state) return;

    isRestoringState = true;
    if (Array.isArray(state.daySessions)) {
      weekDays.forEach((_, index) => {
        daySessions[index].topic = state.daySessions[index]?.topic || "";
        daySessions[index].conductor = state.daySessions[index]?.conductor || "";
      });
    }
    if (Array.isArray(state.participants)) {
      const savedParticipants = state.participants.map(normalizePerson).filter((person) => person.name);
      participants.splice(0, participants.length, ...savedParticipants);
    }
    document.querySelector("#sessionDateInput").value = state.session?.date || defaultWeekStartIso();
    document.querySelector("#sessionTimeInput").value = state.session?.time || "";
    document.querySelector("#sessionArea").value = state.session?.area || "";
    document.querySelector("#sessionShift").value = state.session?.shift || "";
    selectedDayIndex = Math.max(0, Math.min(Number(state.selectedDayIndex) || 0, weekDays.length - 1));
    selectedIndex = Math.max(0, Math.min(Number(state.selectedIndex) || 0, Math.max(0, participants.length - 1)));
    loadDaySession(selectedDayIndex);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  } finally {
    isRestoringState = false;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

function statusLabel(item) {
  const record = item.days ? dayRecord(item) : item;
  if (record.status === "done") return "Assinado";
  if (record.status === "attention") return "Atenção";
  if (record.status === "excused") return record.note || "Ausência";
  return "Pendente";
}

function todayIso() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function parseIsoDate(value) {
  const [year, month, day] = String(value || "").split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function toIsoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date, offset) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + offset);
  return copy;
}

function weekStartDate() {
  return parseIsoDate(document.querySelector("#sessionDateInput").value) || parseIsoDate(defaultWeekStartIso());
}

function dayIso(dayIndex) {
  return toIsoDate(addDays(weekStartDate(), weekDays[dayIndex].offset));
}

function defaultWeekStartIso() {
  const today = parseIsoDate(todayIso());
  const day = today.getDay();
  const offset = day === 0 ? 1 : day === 6 ? 2 : 1 - day;
  return toIsoDate(addDays(today, offset));
}

function getSessionData() {
  saveCurrentDaySession();
  return {
    topic: daySessions[selectedDayIndex].topic,
    conductor: daySessions[selectedDayIndex].conductor,
    date: document.querySelector("#sessionDateInput").value,
    time: document.querySelector("#sessionTimeInput").value,
    area: document.querySelector("#sessionArea").value.trim(),
    shift: document.querySelector("#sessionShift").value.trim()
  };
}

function saveCurrentDaySession() {
  daySessions[selectedDayIndex].topic = document.querySelector("#sessionTopic").value.trim();
  daySessions[selectedDayIndex].conductor = document.querySelector("#sessionConductor").value.trim();
}

function loadDaySession(dayIndex) {
  document.querySelector("#sessionTopic").value = daySessions[dayIndex].topic;
  document.querySelector("#sessionConductor").value = daySessions[dayIndex].conductor;
}

function getDaySession(dayIndex) {
  if (dayIndex === selectedDayIndex) saveCurrentDaySession();
  return daySessions[dayIndex];
}

function syncSessionHeader() {
  const session = getSessionData();
  document.querySelector("#sessionDate").textContent = `${formatDate(dayIso(0))} a ${formatDate(dayIso(4))}`;
  document.querySelector("#sessionHeaderTime").textContent = session.time ? `${weekDays[selectedDayIndex].short} - ${session.time}` : weekDays[selectedDayIndex].label;
  document.querySelector("#finalForm").hidden = true;
  renderWeekDayButtons();
  updateActionState();
  saveAppState();
}

function sessionMissingFields() {
  const required = [
    ["#sessionTopic", "Tema"],
    ["#sessionConductor", "Condutor"],
    ["#sessionDateInput", "Semana"],
    ["#sessionTimeInput", "Horário"]
  ];
  return required.filter(([selector]) => !document.querySelector(selector).value.trim());
}

function validateSession(showMessage = true) {
  const missing = sessionMissingFields();
  if (!missing.length) return true;

  if (showMessage) {
    document.querySelector("#finalMessage").textContent = `Preencha antes de gerar: ${missing.map(([, label]) => label).join(", ")}.`;
    highlightMissingFields(missing);
    const firstField = document.querySelector(missing[0][0]);
    firstField.scrollIntoView({ behavior: "smooth", block: "center" });
    firstField.focus();
  }
  return false;
}

function highlightMissingFields(missing = sessionMissingFields()) {
  document.querySelectorAll(".required-missing").forEach((field) => {
    field.classList.remove("required-missing");
  });
  missing.forEach(([selector]) => {
    document.querySelector(selector).classList.add("required-missing");
  });
}

function renderWeekDayButtons() {
  const wrapper = document.querySelector("#weekDayButtons");
  if (!wrapper) return;
  wrapper.innerHTML = weekDays.map((day, index) => `
    <button type="button" data-day="${index}" class="${index === selectedDayIndex ? "selected" : ""}">
      <strong>${day.short}</strong>
      <span>${formatDate(dayIso(index))}</span>
    </button>
  `).join("");
}

function renderRows() {
  if (!participants.length) {
    rows.innerHTML = `<div class="empty-state">Nenhum participante cadastrado. Use o campo acima para alimentar a lista.</div>`;
    return;
  }

  rows.innerHTML = participants.map((person, index) => {
    const record = dayRecord(person);
    const pillClass = record.status === "attention"
      ? "bad"
      : record.status === "done"
        ? "done"
        : record.status === "excused"
          ? "excused"
          : "";
    return `
      <div class="participant-row ${index === selectedIndex ? "selected" : ""}">
        <button type="button" data-select="${index}">${index + 1}</button>
        <div>
          <strong>${escapeHtml(person.name)}</strong>
          <small>${escapeHtml(person.badge)}</small>
        </div>
        <span class="pill ${pillClass}">${statusLabel(record)}</span>
        <button type="button" class="remove-participant" data-remove="${index}" aria-label="Remover ${escapeHtml(person.name)}">×</button>
      </div>
    `;
  }).join("");
}

function renderFocus() {
  if (!participants.length) {
    currentName.textContent = "Cadastre participantes";
    currentBadge.textContent = "A lista esta vazia";
    currentInitials.textContent = "--";
    currentStatus.textContent = "Aguardando";
    selectedMood = "";
    goodBtn.classList.remove("selected");
    badBtn.classList.remove("selected");
    clearSignatureCanvas(false);
    return;
  }

  selectedIndex = Math.max(0, Math.min(selectedIndex, participants.length - 1));
  const person = participants[selectedIndex];
  const record = dayRecord(person);
  currentName.textContent = person.name;
  currentBadge.textContent = person.badge;
  currentInitials.textContent = initials(person.name);
  currentStatus.textContent = statusLabel(record);
  selectedMood = record.mood;
  goodBtn.classList.toggle("selected", selectedMood === "1");
  badBtn.classList.toggle("selected", selectedMood === "2");
  alertBox.hidden = selectedMood !== "2";
  loadSignature(record.signature);
}

function renderCounters() {
  const closed = participants.filter((person) => ["done", "attention", "excused"].includes(dayRecord(person).status)).length;
  const attention = participants.filter((person) => dayRecord(person).status === "attention").length;
  const pending = participants.length - closed;
  document.querySelector("#doneCount").textContent = closed;
  document.querySelector("#pendingCount").textContent = pending;
  document.querySelector("#attentionCount").textContent = attention;
  document.querySelector("#lockStatus").textContent = pending ? "Impressão bloqueada" : "Impressão liberada";
  document.querySelector("#lockStatus").style.color = pending ? "#8a2a2a" : "#12623f";
  document.querySelector("#lockStatus").style.background = pending ? "#fae5e5" : "#e3f4ec";
  updateActionState();
  if (!participants.length) {
    document.querySelector("#finalMessage").textContent = "Cadastre ou importe participantes para gerar o anexo.";
  } else if (sessionMissingFields().length) {
    document.querySelector("#finalMessage").textContent = "Preencha tema, condutor, semana e horario para gerar o anexo/PDF.";
  } else {
    document.querySelector("#finalMessage").textContent = pending
      ? `Ha pendencias em ${weekDays[selectedDayIndex].label}, mas o anexo semanal ja pode ser gerado.`
      : `${weekDays[selectedDayIndex].label} concluida. Continue preenchendo a semana ou gere o PDF na sexta.`;
  }
}

function updateActionState() {
  const hasParticipants = participants.length > 0;
  document.querySelector("#generateFinalBtn").disabled = !hasParticipants;
  document.querySelector("#printPdfBtn").disabled = !hasParticipants;
  document.querySelector("#exportCsvBtn").disabled = participants.length === 0;
  highlightMissingFields();
}

function renderAll() {
  renderWeekDayButtons();
  renderRows();
  renderFocus();
  renderCounters();
  saveAppState();
}

document.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    const index = Number(removeButton.dataset.remove);
    const person = participants[index];
    if (!person) return;
    if (!window.confirm(`Remover ${person.name} da lista?`)) return;
    participants.splice(index, 1);
    selectedIndex = Math.max(0, Math.min(selectedIndex, participants.length - 1));
    selectedMood = "";
    document.querySelector("#finalForm").hidden = true;
    renderAll();
    return;
  }

  const selectButton = event.target.closest("[data-select]");
  if (selectButton) {
    selectedIndex = Number(selectButton.dataset.select);
    renderAll();
  }

  const dayButton = event.target.closest("[data-day]");
  if (dayButton) {
    saveCurrentDaySession();
    selectedDayIndex = Number(dayButton.dataset.day);
    loadDaySession(selectedDayIndex);
    selectedMood = "";
    document.querySelector("#finalForm").hidden = true;
    syncSessionHeader();
    renderAll();
  }
});

goodBtn.addEventListener("click", () => {
  selectedMood = "1";
  goodBtn.classList.add("selected");
  badBtn.classList.remove("selected");
  alertBox.hidden = true;
});

badBtn.addEventListener("click", () => {
  selectedMood = "2";
  badBtn.classList.add("selected");
  goodBtn.classList.remove("selected");
  alertBox.textContent = "Participante marcou atenção. Converse antes de liberar a atividade.";
  alertBox.hidden = false;
});

document.querySelector("#confirmBtn").addEventListener("click", () => {
  if (!participants.length) return;
  const person = participants[selectedIndex];
  const record = dayRecord(person);
  if (!selectedMood || !hasSignature) {
    alertBox.hidden = false;
    alertBox.textContent = "Para concluir, selecione 1 ou 2 e faça a rubrica na tela.";
    return;
  }

  record.mood = selectedMood;
  record.signature = signatureCanvas.toDataURL("image/png");
  record.status = selectedMood === "2" ? "attention" : "done";
  record.signedAt = new Date().toLocaleString("pt-BR");
  record.note = selectedMood === "2" ? "Conversa obrigatoria antes da atividade" : "";
  alertBox.textContent = selectedMood === "2"
    ? "Participante marcado para atenção. Condutor deve conversar antes da tarefa."
    : "Participação confirmada.";
  alertBox.hidden = false;

  const nextPending = participants.findIndex((item) => dayRecord(item).status === "pending");
  selectedIndex = nextPending >= 0 ? nextPending : selectedIndex;
  document.querySelector("#finalForm").hidden = true;
  renderAll();
});

document.querySelector("#excuseBtn").addEventListener("click", () => {
  if (!participants.length) return;
  const person = participants[selectedIndex];
  const situation = document.querySelector("#situationSelect").value;
  const record = dayRecord(person);
  record.status = "excused";
  record.mood = "";
  record.signature = "";
  record.signedAt = new Date().toLocaleString("pt-BR");
  record.note = situation;
  selectedMood = "";
  clearSignatureCanvas(false);
  alertBox.textContent = `${situation} registrado. Este participante não bloqueia mais o formulário final.`;
  alertBox.hidden = false;

  const nextPending = participants.findIndex((item) => dayRecord(item).status === "pending");
  selectedIndex = nextPending >= 0 ? nextPending : selectedIndex;
  document.querySelector("#finalForm").hidden = true;
  renderAll();
});

document.querySelector("#startBtn").addEventListener("click", () => {
  document.body.classList.remove("access-mode");
  document.body.classList.add("system-mode");
  document.querySelector(".system-panel").scrollIntoView({ behavior: "auto", block: "start" });
  requestAnimationFrame(() => {
    prepareSignatureCanvas();
    loadSignature(participants[selectedIndex] ? dayRecord(participants[selectedIndex]).signature : "");
  });
});

document.querySelector("#addPersonBtn").addEventListener("click", () => {
  const nameInput = document.querySelector("#newName");
  const badgeInput = document.querySelector("#newBadge");
  const name = nameInput.value.trim();
  if (!name) return;

  participants.push(createPerson(name, badgeInput.value));
  selectedIndex = participants.length - 1;
  nameInput.value = "";
  badgeInput.value = "";
  document.querySelector("#finalForm").hidden = true;
  renderAll();
});

document.querySelector("#importPeopleBtn").addEventListener("click", () => {
  const bulkField = document.querySelector("#bulkPeople");
  const imported = bulkField.value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, badge = ""] = line.split(/[;\t,]/).map((part) => part.trim());
      return name ? createPerson(name, badge) : null;
    })
    .filter(Boolean);

  if (!imported.length) return;
  participants.splice(0, participants.length, ...imported);
  selectedIndex = 0;
  selectedMood = "";
  bulkField.value = "";
  document.querySelector("#finalForm").hidden = true;
  renderAll();
});

document.querySelector("#clearPeopleBtn").addEventListener("click", () => {
  participants.splice(0, participants.length);
  selectedIndex = 0;
  selectedMood = "";
  document.querySelector("#finalForm").hidden = true;
  renderAll();
});

document.querySelector("#generateFinalBtn").addEventListener("click", () => {
  if (document.querySelector("#generateFinalBtn").disabled || !validateSession()) return;
  renderFinalForm();
  document.querySelector("#finalForm").hidden = false;
  document.querySelector("#finalForm").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelector("#printPdfBtn").addEventListener("click", () => {
  if (document.querySelector("#printPdfBtn").disabled || !validateSession()) return;
  renderFinalForm();
  document.querySelector("#finalForm").hidden = false;
  setTimeout(() => window.print(), 150);
});

document.querySelector("#exportCsvBtn").addEventListener("click", exportCsv);

document.querySelector("#sessionDateInput").value = defaultWeekStartIso();
loadAppState();
document.querySelectorAll("#sessionTopic, #sessionConductor, #sessionDateInput, #sessionTimeInput, #sessionArea, #sessionShift")
  .forEach((field) => field.addEventListener("input", syncSessionHeader));
syncSessionHeader();

function prepareSignatureCanvas() {
  const rect = signatureCanvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  signatureCanvas.width = Math.max(1, Math.round(rect.width * ratio));
  signatureCanvas.height = Math.max(1, Math.round(rect.height * ratio));
  signatureContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  signatureContext.lineWidth = 2.4;
  signatureContext.lineCap = "round";
  signatureContext.lineJoin = "round";
  signatureContext.strokeStyle = "#132f38";
  clearSignatureCanvas(false);
}

function clearSignatureCanvas(updatePerson = true) {
  const rect = signatureCanvas.getBoundingClientRect();
  signatureContext.clearRect(0, 0, rect.width, rect.height);
  hasSignature = false;
  if (updatePerson && participants[selectedIndex]) {
    dayRecord(participants[selectedIndex]).signature = "";
  }
}

function loadSignature(dataUrl) {
  if (!signatureCanvas.width) prepareSignatureCanvas();
  clearSignatureCanvas(false);
  if (!dataUrl) return;

  const image = new Image();
  image.onload = () => {
    const rect = signatureCanvas.getBoundingClientRect();
    signatureContext.drawImage(image, 0, 0, rect.width, rect.height);
    hasSignature = true;
  };
  image.src = dataUrl;
}

function signaturePoint(event) {
  const rect = signatureCanvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
}

signatureCanvas.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  signatureCanvas.setPointerCapture(event.pointerId);
  isDrawingSignature = true;
  const point = signaturePoint(event);
  signatureContext.beginPath();
  signatureContext.moveTo(point.x, point.y);
});

signatureCanvas.addEventListener("pointermove", (event) => {
  if (!isDrawingSignature) return;
  event.preventDefault();
  const point = signaturePoint(event);
  signatureContext.lineTo(point.x, point.y);
  signatureContext.stroke();
  hasSignature = true;
});

signatureCanvas.addEventListener("pointerup", (event) => {
  if (!isDrawingSignature) return;
  event.preventDefault();
  isDrawingSignature = false;
  if (participants[selectedIndex]) {
    dayRecord(participants[selectedIndex]).signature = hasSignature ? signatureCanvas.toDataURL("image/png") : "";
  }
});

signatureCanvas.addEventListener("pointerleave", () => {
  if (!isDrawingSignature) return;
  isDrawingSignature = false;
  if (participants[selectedIndex]) {
    dayRecord(participants[selectedIndex]).signature = hasSignature ? signatureCanvas.toDataURL("image/png") : "";
  }
});

document.querySelector("#clearSignatureBtn").addEventListener("click", () => {
  clearSignatureCanvas(true);
});

window.addEventListener("resize", () => {
  const currentSignature = participants[selectedIndex] ? dayRecord(participants[selectedIndex]).signature : "";
  prepareSignatureCanvas();
  loadSignature(currentSignature);
});

function renderFinalForm() {
  const tableRows = renderAuditRows();
  document.querySelector("#finalTableWrap").innerHTML = `
    <div class="final-block">
      <h4>Registro digital com assinatura e banco de dados da chamada</h4>
      <table class="final-table">
        <thead>
          <tr>
            <th>Nº</th>
            <th>Nome</th>
            <th>Matrícula</th>
            <th>Como estou?</th>
            <th>Status</th>
            <th>Rubrica</th>
            <th>Data/hora</th>
            <th>Observação</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
    <div class="final-block">
      <h4>Anexo 1 padrão DSSMA para impressão e assinatura manual</h4>
      ${renderAuditSheet()}
    </div>
  `;
}

function exportCsv() {
  const session = getSessionData();
  const header = [
    "Tema",
    "Condutor",
    "Data",
    "Horario",
    "Area",
    "Turma",
    "Dia",
    "Data do dia",
    "Numero",
    "Nome",
    "Matricula",
    "Como estou",
    "Status",
    "Data hora",
    "Observacao"
  ];
  const rows = participants.flatMap((person, index) => weekDays.map((day, dayIndex) => {
    const record = dayRecord(person, dayIndex);
    const daySession = getDaySession(dayIndex);
    return [
      daySession.topic,
      daySession.conductor,
      `${formatDate(dayIso(0))} a ${formatDate(dayIso(4))}`,
      session.time,
      session.area,
      session.shift,
      day.label,
      formatDate(dayIso(dayIndex)),
      index + 1,
      person.name,
      person.badge,
      record.mood === "1" ? "1 - Estou bem" : record.mood === "2" ? "2 - Atencao" : "",
      statusLabel(record),
      record.signedAt,
      record.note
    ];
  }));
  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(";"))
    .join("\n");
  downloadBlob(csv, `dssma-digital-semanal-${dayIso(0)}.csv`, "text/csv;charset=utf-8");
}

function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function renderAuditRows() {
  return participants.map((person, index) => {
    const record = dayRecord(person);
    const statusClass = record.status === "attention" ? "attention" : record.status === "excused" ? "excused" : "done";
    const mood = record.mood === "1" ? "1 - Estou bem" : record.mood === "2" ? "2 - Atenção" : "-";
    const signature = record.signature ? `<img src="${record.signature}" alt="Rubrica de ${escapeHtml(person.name)}">` : "-";
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(person.name)}</td>
        <td>${escapeHtml(person.badge)}</td>
        <td>${mood}</td>
        <td><span class="final-status ${statusClass}">${statusLabel(record)}</span></td>
        <td>${signature}</td>
        <td>${escapeHtml(record.signedAt || "-")}</td>
        <td>${escapeHtml(record.note || "-")}</td>
      </tr>
    `;
  }).join("");
}

function renderAuditSheet() {
  const session = getSessionData();
  return `
    <section class="audit-sheet">
      <header class="audit-head">
        <strong>Comunicação, Participação e Consulta em Saúde, Segurança, Meio Ambiente e Qualidade</strong>
        <img src="assets/vale-logo.png" alt="Vale">
      </header>
      <div class="audit-docline">
        <span>PRO-025202, Rev.: 06 - 29/08/2023 - Classificação: Uso Interno - Pág. 1 de 1</span>
        <span>Diretoria Emitente: Diretoria Corredor Norte</span>
      </div>
      <h3>Anexo 1 - Registro de Participação no DSSMA / Como Estou?</h3>
      <table class="audit-meta">
        <tbody>
          <tr>
            <th>GERÊNCIA</th>
            <td>Integridade Estrutural - PA</td>
            <th>ÁREA</th>
            <td>${escapeHtml(session.area)}</td>
            <td>Administrativo □ &nbsp; Operacional ☒ &nbsp; Turma ${escapeHtml(session.shift)}</td>
            <th>Horário</th>
            <td>${escapeHtml(session.time)}</td>
          </tr>
        </tbody>
      </table>
      <div class="audit-plan">
        <div class="audit-guidance">
          <div class="audit-legend">
            <div>${renderSmallMoodIcon("good")}<strong>1 - BOM</strong><span>Hoje está tudo normal comigo. Me sinto bem. Estou de bom humor. Hoje estou sem problemas.</span></div>
            <div>${renderSmallMoodIcon("bad")}<strong>2 - RUIM</strong><span>Não me sinto bem. Estou triste, preocupado ou desconcentrado.</span></div>
          </div>
          <p><strong>ORIENTAÇÕES GERAIS</strong><br>Para preenchimento do registro de DDSMA, marque diariamente a opção que melhor represente como você está se sentindo antes do início das atividades. Caso marque 2, converse com o condutor, liderança ou equipe de segurança.</p>
        </div>
        <table>
          <tbody>
            <tr><th>Tema =&gt;</th>${weekDays.map((_, index) => `<td>${escapeHtml(getDaySession(index).topic)}</td>`).join("")}</tr>
            <tr><th>Condutor =&gt;</th>${weekDays.map((_, index) => `<td>${escapeHtml(getDaySession(index).conductor)}</td>`).join("")}</tr>
            <tr><th>Data =&gt;</th>${weekDays.map((day, index) => `<td><strong>${day.short}</strong> ${formatDate(dayIso(index))}</td>`).join("")}</tr>
          </tbody>
        </table>
      </div>
      <table class="audit-attendance">
      <thead>
        <tr>
            <th rowspan="2" class="num-col">Nº</th>
            <th rowspan="2" class="name-col">NOME</th>
            <th rowspan="2" class="badge-col">MATRÍCULA</th>
            ${weekDays.map((day, index) => `<th colspan="2">${day.short} - Como me sinto hoje?<br><span>${formatDate(dayIso(index))}</span></th><th>Rubrica</th>`).join("")}
          </tr>
          <tr>
            ${Array.from({ length: 5 }, () => `<th>1</th><th>2</th><th></th>`).join("")}
        </tr>
      </thead>
        <tbody>${renderAuditSheetRows()}</tbody>
      </table>
    </section>
  `;
}

function renderAuditSheetRows() {
  const totalRows = Math.max(22, participants.length);
  return Array.from({ length: totalRows }, (_, index) => {
    const person = participants[index];
    if (!person) {
      return `
        <tr>
          <td>${index + 1}</td><td></td><td></td>
          ${Array.from({ length: 5 }, () => `<td>1</td><td>2</td><td></td>`).join("")}
        </tr>
      `;
    }

    return `
      <tr>
        <td>${index + 1}</td>
        <td>${escapeHtml(person.name)}</td>
        <td><strong>${escapeHtml(person.badge)}</strong></td>
        ${weekDays.map((_, dayIndex) => {
          const record = dayRecord(person, dayIndex);
          return renderMoodPrintCells(record, renderRubrica(record));
        }).join("")}
      </tr>
    `;
  }).join("");
}

function renderRubrica(record) {
  if (record.signature) return `<img class="audit-signature" src="${record.signature}" alt="Rubrica">`;
  if (record.status === "excused") return `<span class="audit-note">${escapeHtml(record.note || "Ausência")}</span>`;
  return "";
}

function renderMoodPrintCells(record, rubrica) {
  const one = record.mood === "1" ? renderSmallMoodIcon("good") : "1";
  const two = record.mood === "2" ? renderSmallMoodIcon("bad") : "2";
  return `<td>${one}</td><td>${two}</td><td>${rubrica}</td>`;
}

function renderSmallMoodIcon(kind) {
  const color = kind === "good" ? "#12805c" : "#b94747";
  const mouth = kind === "good"
    ? `<path d="M5.2 9.2c1.5 2 4.1 2 5.6 0" />`
    : `<path d="M5.2 11c1.5-2 4.1-2 5.6 0" />`;
  return `
    <svg class="audit-mood ${kind}" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="${color}" stroke="rgba(0,0,0,.24)" stroke-width=".7" />
      <circle cx="5.7" cy="6.2" r="1" fill="#fff" />
      <circle cx="10.3" cy="6.2" r="1" fill="#fff" />
      <g fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round">${mouth}</g>
    </svg>
  `;
}

prepareSignatureCanvas();
renderAll();

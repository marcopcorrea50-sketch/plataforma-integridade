const STORAGE_KEY = "registro-dssma-digital-v1";
const MIN_ROWS = 22;

const defaultParticipants = [
  ["BALBINO JOSE FRAZAO FILHO", "1992511"],
  ["ANA PAULA ALVES MARQUES", ""],
  ["CLEIDE MARIA CARDOSO", "AL08289"],
  ["ELIAS DA COSTA E SILVA", "81055583"],
  ["ELLEN SUENIA RODRIGUES DA COSTA", "6452008"],
  ["EMERSON LENO MOREIRA", "AL08466"],
  ["HERNANDES CANDIDO DE OLIVEIRA", "AL08468"],
  ["HILDOMAR LEMOS MOREIRA", "AL23604"],
  ["IAGO VICTOR CORDEIRO SANTOS", "AL08301"],
  ["JOSUE SAMPAIO MOURA", "AL08525"],
  ["JULIA GABRIELA DA SILVA", "B1024893"],
  ["LINGY SOUZA TAVARES", "AL08382"],
  ["MARCO ANTONIO PENHA CORREA", "1495822"],
  ["MARIA VANEUZA DE ARAUJO", ""],
  ["RAIMUNDO NONATO DA SILVA SANTOS", "AL08336"],
  ["RAIMUNDO SERGIO CARDOSO DE SOUSA", "81046659"],
  ["SAULO DOS SANTOS PEREIRA", "81025170"],
  ["TAMER LOPES DE ANDRADE", "AL08570"]
];

const baseState = {
  doc: {
    header: "Comunicação, Participação e Consulta em Saúde, Segurança, Meio Ambiente e Qualidade",
    procedure: "PRO-025202, Rev.: 06 - 29/08/2023 - Classificação: Uso Interno - Pág. 1 de 1",
    directorate: "Diretoria Emitente: Diretoria Corredor Norte",
    title: "Anexo 1 - Registro de Participação no DSSMA / Como Estou?",
    management: "Integridade Estrutural - PA",
    area: "",
    profile: "Operacional",
    shift: "",
    time: ""
  },
  meetings: [
    { topic: "", conductor: "", date: "" },
    { topic: "", conductor: "", date: "" },
    { topic: "", conductor: "", date: "" },
    { topic: "", conductor: "", date: "" },
    { topic: "", conductor: "", date: "" }
  ],
  participants: defaultParticipants.map(([name, badge]) => ({
    id: createId(),
    name,
    badge,
    moods: ["", "", "", "", ""],
    signatures: ["", "", "", "", ""]
  }))
};

let state = loadState();

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(baseState));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return cloneDefaultState();
    const parsed = JSON.parse(saved);
    return normalizeState(parsed);
  } catch {
    return cloneDefaultState();
  }
}

function normalizeState(nextState) {
  const normalized = {
    doc: { ...baseState.doc, ...(nextState.doc || {}) },
    meetings: Array.isArray(nextState.meetings) && nextState.meetings.length
      ? nextState.meetings
      : cloneDefaultState().meetings,
    participants: Array.isArray(nextState.participants)
      ? nextState.participants
      : cloneDefaultState().participants
  };

  normalized.meetings = normalized.meetings.slice(0, 7).map((meeting) => ({
    topic: meeting.topic || "",
    conductor: meeting.conductor || "",
    date: meeting.date || ""
  }));

  normalized.participants = normalized.participants.map((participant) => ({
    id: participant.id || createId(),
    name: participant.name || "",
    badge: participant.badge || "",
    moods: Array.isArray(participant.moods) ? participant.moods : [],
    signatures: Array.isArray(participant.signatures) ? participant.signatures : []
  }));

  alignParticipantColumns(normalized);
  return normalized;
}

function alignParticipantColumns(targetState = state) {
  const count = targetState.meetings.length;
  targetState.participants.forEach((participant) => {
    participant.moods = Array.from({ length: count }, (_, index) => participant.moods[index] || "");
    participant.signatures = Array.from({ length: count }, (_, index) => participant.signatures[index] || "");
  });
}

function saveState(message = "Salvo automaticamente.") {
  alignParticipantColumns();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  $("#saveStatus").textContent = message;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function todayIso() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function syncDocumentFields() {
  $$("[data-field]").forEach((field) => {
    field.value = state.doc[field.dataset.field] || "";
  });
  $("#meetingCount").value = state.meetings.length;
  syncCover();
}

function syncCover() {
  const dateElement = $("#coverDate");
  const profileElement = $("#coverProfile");
  if (dateElement) dateElement.textContent = formatDate(todayIso());
  if (profileElement) profileElement.textContent = state.doc.profile || "Operacional";
}

function renderMeetingEditor() {
  const editor = $("#meetingEditor");
  editor.innerHTML = state.meetings.map((meeting, index) => `
    <div class="meeting-card" data-meeting-editor="${index}">
      <span class="meeting-number">${index + 1}</span>
      <label>
        Tema
        <input data-meeting-field="topic" type="text" value="${escapeHtml(meeting.topic)}">
      </label>
      <label>
        Condutor
        <input data-meeting-field="conductor" type="text" value="${escapeHtml(meeting.conductor)}">
      </label>
      <label>
        Data
        <input data-meeting-field="date" type="date" value="${escapeHtml(meeting.date)}">
      </label>
    </div>
  `).join("");
}

function renderParticipantEditor() {
  const editor = $("#participantEditor");
  editor.innerHTML = state.participants.map((participant, index) => `
    <div class="participant-row" data-participant-editor="${participant.id}">
      <label>
        ${index + 1}. Nome
        <input data-participant-field="name" type="text" value="${escapeHtml(participant.name)}">
      </label>
      <label>
        Matrícula
        <input data-participant-field="badge" type="text" value="${escapeHtml(participant.badge)}">
      </label>
      <button class="remove-participant" type="button" title="Remover participante">×</button>
    </div>
  `).join("");
}

function renderSheet() {
  const sheet = $("#sheet");
  sheet.innerHTML = `
    <header class="sheet-header">
      <div class="sheet-header-title">${escapeHtml(state.doc.header)}</div>
      <div class="sheet-logo"><img src="assets/vale-logo.png" alt="Vale"></div>
    </header>
    <div class="doc-line">
      <span>${escapeHtml(state.doc.procedure)}</span>
      <span>${escapeHtml(state.doc.directorate)}</span>
    </div>
    <div class="doc-title">${escapeHtml(state.doc.title)}</div>
    ${renderMetaTable()}
    ${renderUpperGrid()}
    ${renderAttendanceTable()}
  `;
}

function renderMetaTable() {
  const isAdministrative = state.doc.profile === "Administrativo";
  const isOperational = state.doc.profile === "Operacional";
  return `
    <table class="meta-table" aria-label="Dados do registro">
      <tbody>
        <tr>
          <th>GERÊNCIA</th>
          <td>${escapeHtml(state.doc.management)}</td>
          <th>ÁREA</th>
          <td>${escapeHtml(state.doc.area)}</td>
          <td>
            <div class="checkline">
              <span class="check-option">Administrativo <span class="checkbox-print">${isAdministrative ? "X" : ""}</span></span>
              <span class="check-option">Operacional <span class="checkbox-print">${isOperational ? "X" : ""}</span></span>
              <span class="check-option">Turma <span class="checkbox-print">${escapeHtml(state.doc.shift)}</span></span>
            </div>
          </td>
          <th>Horário</th>
          <td>${escapeHtml(state.doc.time)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

function renderUpperGrid() {
  return `
    <div class="upper-grid">
      <div class="orientation-box">
        <div class="mood-legend">
          <div class="mood-item">
            <div class="mood-code good">${renderMoodIcon("good", true)}1 - BOM</div>
            <div class="mood-text">Hoje está tudo normal comigo. Me sinto bem. Estou de bom humor. Hoje estou sem problemas.</div>
          </div>
          <div class="mood-item">
            <div class="mood-code bad">${renderMoodIcon("bad", true)}2 - RUIM</div>
            <div class="mood-text">Não me sinto bem. Estou triste, preocupado ou gostaria de ficar sozinho. Estou desconcentrado.</div>
          </div>
        </div>
        <div class="instructions">
          <strong>ORIENTAÇÕES GERAIS</strong>
          Para preenchimento do registro de DDSMA, marque diariamente a opção que melhor represente como você está se sentindo antes do início das atividades. Caso marque 2, converse com o condutor, liderança ou equipe de segurança para receber apoio antes da execução da tarefa. Use a rubrica para confirmar participação.
        </div>
      </div>
      <table class="meeting-plan" aria-label="Programação das reuniões">
        <tbody>
          <tr>
            <th>Tema =&gt;</th>
            ${state.meetings.map((meeting) => `<td>${escapeHtml(meeting.topic)}</td>`).join("")}
          </tr>
          <tr>
            <th>Condutor =&gt;</th>
            ${state.meetings.map((meeting) => `<td>${escapeHtml(meeting.conductor)}</td>`).join("")}
          </tr>
          <tr>
            <th>Data =&gt;</th>
            ${state.meetings.map((meeting) => `<td class="date-cell">${escapeHtml(formatDate(meeting.date))}</td>`).join("")}
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function renderAttendanceTable() {
  const rowCount = Math.max(MIN_ROWS, state.participants.length);
  const rows = Array.from({ length: rowCount }, (_, index) => {
    const participant = state.participants[index];
    if (!participant) return renderEmptyRow(index);
    return `
      <tr data-participant-id="${participant.id}">
        <td class="row-number">${index + 1}</td>
        <td class="person-name">${escapeHtml(participant.name)}</td>
        <td class="person-badge">${escapeHtml(participant.badge)}</td>
        ${state.meetings.map((_, meetingIndex) => renderParticipantMeetingCells(participant, meetingIndex)).join("")}
      </tr>
    `;
  }).join("");

  return `
    <table class="attendance-table" aria-label="Lista de participação">
      <thead>
        <tr>
          <th class="number-col" rowspan="2">Nº</th>
          <th class="name-col" rowspan="2">NOME</th>
          <th class="badge-col" rowspan="2">MATRÍCULA</th>
          ${state.meetings.map((_, index) => `<th colspan="2">Como me sinto hoje?</th><th>Rubrica</th>`).join("")}
        </tr>
        <tr>
          ${state.meetings.map(() => `<th>1</th><th>2</th><th></th>`).join("")}
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderParticipantMeetingCells(participant, meetingIndex) {
  const selected = participant.moods[meetingIndex] || "";
  return `
    <td class="mood-cell" colspan="2">
      <div class="mood-pair">
        ${renderMoodChoice(participant.id, meetingIndex, "1", "good", selected)}
        ${renderMoodChoice(participant.id, meetingIndex, "2", "bad", selected)}
      </div>
    </td>
    <td class="signature-cell">
      <input class="signature-input" data-signature="${participant.id}|${meetingIndex}" value="${escapeHtml(participant.signatures[meetingIndex] || "")}" aria-label="Rubrica">
    </td>
  `;
}

function renderMoodChoice(participantId, meetingIndex, value, kind, selected) {
  const isSelected = selected === value;
  return `
    <span class="mood-choice ${kind} ${isSelected ? "selected" : ""}" data-mood="${participantId}|${meetingIndex}|${value}" aria-label="Marcar ${value}">
      <span class="choice-number">${value}</span>
      ${isSelected ? renderMoodIcon(kind) : ""}
    </span>
  `;
}

function renderMoodIcon(kind, large = false) {
  const title = kind === "good" ? "Bom" : "Ruim";
  const mouth = kind === "good"
    ? '<path d="M5.2 9.2c1.5 2 4.1 2 5.6 0" />'
    : '<path d="M5.2 11c1.5-2 4.1-2 5.6 0" />';
  return `
    <svg class="mood-icon ${kind} ${large ? "large" : ""}" viewBox="0 0 16 16" role="img" aria-label="${title}">
      <circle cx="8" cy="8" r="7" />
      <circle class="eye" cx="5.7" cy="6.2" r="1" />
      <circle class="eye" cx="10.3" cy="6.2" r="1" />
      ${mouth}
    </svg>
  `;
}

function renderEmptyRow(index) {
  return `
    <tr class="empty-row">
      <td class="row-number">${index + 1}</td>
      <td></td>
      <td></td>
      ${state.meetings.map(() => `
        <td class="mood-cell" colspan="2">
          <div class="mood-pair"><span class="mood-choice">1</span><span class="mood-choice">2</span></div>
        </td>
        <td></td>
      `).join("")}
    </tr>
  `;
}

function renderAll(message) {
  alignParticipantColumns();
  syncDocumentFields();
  renderMeetingEditor();
  renderParticipantEditor();
  renderSheet();
  if (message) $("#saveStatus").textContent = message;
}

function setMeetingCount(count) {
  const safeCount = Math.max(1, Math.min(7, Number(count) || 5));
  while (state.meetings.length < safeCount) {
    state.meetings.push({ topic: "", conductor: "", date: "" });
  }
  state.meetings = state.meetings.slice(0, safeCount);
  alignParticipantColumns();
  saveState("Quantidade de reuniões atualizada.");
  renderAll();
}

function importParticipantText(text) {
  const imported = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, badge = ""] = line.split(/[;\t,]/).map((part) => part.trim());
      return {
        id: createId(),
        name: (name || "").toUpperCase(),
        badge,
        moods: Array(state.meetings.length).fill(""),
        signatures: Array(state.meetings.length).fill("")
      };
    })
    .filter((participant) => participant.name);

  if (!imported.length) {
    $("#saveStatus").textContent = "Nenhum participante encontrado para importar.";
    return;
  }

  state.participants = imported;
  saveState(`${imported.length} participante(s) importado(s).`);
  renderAll();
}

function exportCsvFile() {
  const header = ["Nº", "Nome", "Matrícula"];
  state.meetings.forEach((meeting, index) => {
    header.push(`Reunião ${index + 1} - Tema`, `Reunião ${index + 1} - Data`, `Reunião ${index + 1} - Como estou`, `Reunião ${index + 1} - Rubrica`);
  });

  const rows = state.participants.map((participant, participantIndex) => {
    const row = [participantIndex + 1, participant.name, participant.badge];
    state.meetings.forEach((meeting, meetingIndex) => {
      row.push(meeting.topic, formatDate(meeting.date), participant.moods[meetingIndex] || "", participant.signatures[meetingIndex] || "");
    });
    return row;
  });

  const csv = [header, ...rows]
    .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(";"))
    .join("\n");

  downloadBlob(csv, `registro-dssma-${todayIso()}.csv`, "text/csv;charset=utf-8");
}

function downloadJsonFile() {
  downloadBlob(JSON.stringify(state, null, 2), `backup-registro-dssma-${todayIso()}.json`, "application/json");
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

document.addEventListener("input", (event) => {
  const docField = event.target.closest("[data-field]");
  if (docField) {
    state.doc[docField.dataset.field] = docField.value;
    saveState();
    renderSheet();
    return;
  }

  const meetingCard = event.target.closest("[data-meeting-editor]");
  if (meetingCard) {
    const index = Number(meetingCard.dataset.meetingEditor);
    const field = event.target.dataset.meetingField;
    if (field) {
      state.meetings[index][field] = event.target.value;
      saveState();
      renderSheet();
    }
    return;
  }

  const participantRow = event.target.closest("[data-participant-editor]");
  if (participantRow) {
    const participant = state.participants.find((item) => item.id === participantRow.dataset.participantEditor);
    const field = event.target.dataset.participantField;
    if (participant && field) {
      participant[field] = field === "name" ? event.target.value.toUpperCase() : event.target.value;
      saveState();
      renderSheet();
    }
    return;
  }

  const signature = event.target.closest("[data-signature]");
  if (signature) {
    const [participantId, meetingIndex] = signature.dataset.signature.split("|");
    const participant = state.participants.find((item) => item.id === participantId);
    if (participant) {
      participant.signatures[Number(meetingIndex)] = signature.value;
      saveState();
    }
  }
});

document.addEventListener("click", (event) => {
  const mood = event.target.closest("[data-mood]");
  if (mood) {
    const [participantId, meetingIndex, value] = mood.dataset.mood.split("|");
    const participant = state.participants.find((item) => item.id === participantId);
    if (participant) {
      const index = Number(meetingIndex);
      participant.moods[index] = participant.moods[index] === value ? "" : value;
      saveState("Marcação atualizada.");
      renderSheet();
    }
    return;
  }

  const removeButton = event.target.closest(".remove-participant");
  if (removeButton) {
    const row = removeButton.closest("[data-participant-editor]");
    state.participants = state.participants.filter((participant) => participant.id !== row.dataset.participantEditor);
    saveState("Participante removido.");
    renderAll();
  }
});

$("#meetingCount").addEventListener("change", (event) => setMeetingCount(event.target.value));

$("#addParticipant").addEventListener("click", () => {
  state.participants.push({
    id: createId(),
    name: "",
    badge: "",
    moods: Array(state.meetings.length).fill(""),
    signatures: Array(state.meetings.length).fill("")
  });
  saveState("Participante adicionado.");
  renderAll();
});

$("#importParticipants").addEventListener("click", () => {
  importParticipantText($("#bulkParticipants").value);
});

$("#setTodayDates").addEventListener("click", () => {
  const today = todayIso();
  state.meetings.forEach((meeting) => {
    meeting.date = today;
  });
  saveState("Datas preenchidas.");
  renderAll();
});

$("#clearMeetings").addEventListener("click", () => {
  state.meetings.forEach((meeting) => {
    meeting.topic = "";
    meeting.conductor = "";
    meeting.date = "";
  });
  saveState("Reuniões limpas.");
  renderAll();
});

$("#fillGood").addEventListener("click", () => {
  state.participants.forEach((participant) => {
    participant.moods = Array(state.meetings.length).fill("1");
  });
  saveState("Todos marcados como 1.");
  renderSheet();
});

$("#clearMoods").addEventListener("click", () => {
  state.participants.forEach((participant) => {
    participant.moods = Array(state.meetings.length).fill("");
  });
  saveState("Marcações limpas.");
  renderSheet();
});

$("#clearSignatures").addEventListener("click", () => {
  state.participants.forEach((participant) => {
    participant.signatures = Array(state.meetings.length).fill("");
  });
  saveState("Rubricas limpas.");
  renderSheet();
});

$("#resetModel").addEventListener("click", () => {
  state = cloneDefaultState();
  saveState("Modelo original restaurado.");
  renderAll();
});

$("#exportCsv").addEventListener("click", exportCsvFile);
$("#downloadJson").addEventListener("click", downloadJsonFile);
$("#printSheet").addEventListener("click", () => window.print());
$("#coverPrint").addEventListener("click", () => {
  document.body.classList.add("cover-is-hidden");
  window.print();
});
$("#openSystem").addEventListener("click", () => {
  document.body.classList.add("cover-is-hidden");
  $(".workspace").scrollTo({ top: 0, left: 0, behavior: "smooth" });
});
$("#showCover").addEventListener("click", () => {
  document.body.classList.remove("cover-is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("#uploadJson").addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    const text = await file.text();
    state = normalizeState(JSON.parse(text));
    saveState("Backup carregado.");
    renderAll();
  } catch {
    $("#saveStatus").textContent = "Não foi possível carregar esse backup.";
  } finally {
    event.target.value = "";
  }
});

renderAll();

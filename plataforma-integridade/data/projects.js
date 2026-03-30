const projects = [
  {
    id: "IE-001",
    title: "Propósito e Diretrizes da Área",
    description: "Módulo para propósito, diretrizes, requisitos normativos e base institucional da Integridade Estrutural.",
    category: "Prática 1 – Propósito e Diretrizes",
    icon: "🎯",
    priority: "Alta",
    audience: "Todos",
    link: "projects/pratica-1-proposito-diretrizes/index.html"
  },
  {
    id: "IE-002",
    title: "Estratégia para Criar Valor",
    description: "Módulo para metas, objetivos, prioridades e planejamento estratégico da área.",
    category: "Prática 2 – Estratégia para Criar Valor",
    icon: "🧭",
    priority: "Alta",
    audience: "Gestão",
    link: "projects/pratica-2-estrategia-valor/index.html"
  },
  {
    id: "IE-003",
    title: "Liderança e Engajamento",
    description: "Módulo para ritos de liderança, alinhamento, comunicação e engajamento da equipe.",
    category: "Prática 3 – Liderança e Engajamento",
    icon: "🧑‍💼",
    priority: "Alta",
    audience: "Gestão",
    link: "projects/pratica-3-lideranca-engajamento/index.html"
  },
  {
    id: "IE-004",
    title: "FMDS de Pessoas",
    description: "Módulo de acompanhamento e organização de pessoas vinculado à gestão da área.",
    category: "Prática 4 – Pessoas",
    icon: "👥",
    priority: "Média",
    audience: "Gestão",
    link: "projects/fmds-pessoas/index.html"
  },
  {
    id: "IE-005",
    title: "Relatório de Inspeção BFD Silo 2",
    description: "Relatório técnico voltado ao acompanhamento de inspeção estrutural do BFD Silo 2.",
    category: "Prática 5 – Riscos e Segurança",
    icon: "🧱",
    priority: "Alta",
    audience: "Operacional",
    link: "projects/relatorio-bfd-silo2/index.html"
  },
  {
  id: "IE-006",
  title: "InspectPro S11D",
  description: "Sistema operacional voltado ao processo de inspeção estrutural com navegação dedicada.",
  category: "Prática 5 – Riscos e Segurança",
  icon: "🏗️",
  priority: "Alta",
  audience: "Campo",
  link: "projects/Inspectpro-modo-light/index.html"
  },
  {
    id: "IE-007",
    title: "InspectPro S11D",
    description: "Sistema operacional voltado ao processo de inspeção estrutural com navegação dedicada.",
    category: "Prática 5 – Riscos e Segurança",
    icon: "🏗️",
    priority: "Alta",
    audience: "Campo",
    link: "projects/inspectpro-s11d/index.html"
  },
  {
    id: "IE-008",
    title: "FMDS Gestão de Riscos",
    description: "Ferramenta executiva para consolidação e acompanhamento de riscos da integridade estrutural.",
    category: "Prática 5 – Riscos e Segurança",
    icon: "⚠️",
    priority: "Alta",
    audience: "Gestão",
    link: "projects/fmds-riscos/index.html"
  },
  {
    id: "IE-009",
    title: "Instrução de Tarefas Industrial",
    description: "Módulo padronizado para consulta de instruções operacionais em ambiente industrial.",
    category: "Prática 6 – Execução com Excelência e Foco no Cliente",
    icon: "📘",
    priority: "Média",
    audience: "Operacional",
    link: "projects/instrucao-tarefas-industrial/index.html"
  },
  {
    id: "IE-010",
    title: "Instrução de Tarefas Light",
    description: "Versão enxuta para consulta rápida de instruções de tarefas da área.",
    category: "Prática 6 – Execução com Excelência e Foco no Cliente",
    icon: "📗",
    priority: "Média",
    audience: "Operacional",
    link: "projects/instrucao-tarefas-light/index.html"
  },
  {
    id: "IE-011",
    title: "Lista de Material Editor",
    description: "Ferramenta para consulta e edição de lista de materiais aplicada ao contexto da integridade.",
    category: "Prática 6 – Execução com Excelência e Foco no Cliente",
    icon: "🧰",
    priority: "Média",
    audience: "Apoio",
    link: "projects/lista-material-editor/index.html"
  },
  {
    id: "IE-012",
    title: "Painel de Rotina e Performance",
    description: "Área para acompanhamento de indicadores, ritos de rotina, desvios e performance operacional.",
    category: "Prática 7 – Rotina e Performance",
    icon: "📊",
    priority: "Alta",
    audience: "Gestão",
    link: "projects/painel-rotina-performance/index.html"
  },
  {
    id: "IE-013",
    title: "Auditorias e Conformidade",
    description: "Módulo para controle de auditorias internas, evidências, não conformidades e eficácia das ações.",
    category: "Prática 8 – Avaliações e Auditorias",
    icon: "🔎",
    priority: "Alta",
    audience: "Gestão",
    link: "projects/auditorias-conformidade/index.html"
  },
  {
    id: "IE-014",
    title: "Central Kaizen",
    description: "Central executiva para iniciativas de melhoria contínua da área de integridade estrutural.",
    category: "Prática 9 – Melhoria Contínua e Inovação",
    icon: "📈",
    priority: "Média",
    audience: "Gestão",
    link: "projects/central-kaizen/index.html"
  },
  {
    id: "IE-015",
    title: "Gestão da Mudança e Evolução do Sistema",
    description: "Módulo para registro, acompanhamento e sustentação de mudanças técnicas e organizacionais.",
    category: "Prática 10 – Mudança e Evolução do Sistema de Gestão",
    icon: "🔄",
    priority: "Alta",
    audience: "Gestão",
    link: "projects/gestao-mudanca-sistema/index.html"
  },
  {
  id: "IE-016",
  title: "Documentos de Referência",
  description: "Área de consulta aos documentos normativos, referências VPS e base institucional do sistema.",
  category: "Documentos de Referência",
  icon: "📚",
  priority: "Média",
  audience: "Todos",
  link: "projects/documentos-referencia/index.html"
},
{
  id: "IE-017",
  title: "FMDS Pessoas Moderno",
  description: "Versão modernizada do módulo de acompanhamento e organização de pessoas da área.",
  category: "Prática 4 – Pessoas",
  icon: "👥",
  priority: "Média",
  audience: "Gestão",
  link: "projects/fmds-pessoas-moderno/index.html"
}
];





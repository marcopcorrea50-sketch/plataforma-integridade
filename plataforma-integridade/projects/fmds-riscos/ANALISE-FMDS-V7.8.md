# FMDS Gestão de Riscos — Serra Sul · Atualizações V7.1 → V7.8 LIGHT

## V7.8 — PPT executivo redesenhado
O painel HTML não mudou; a apresentação foi refeita do zero.

**Menos cor.** Saiu a paleta de 8 cores (verde, dourado, roxo, teal, azul, laranja, vermelho). Agora são neutros — grafite para números, cinza para rótulos — com **um único acento verde** e **vermelho reservado exclusivamente a alertas** (notas vencidas, ordens atrasadas, vencimento em 10 dias). Sem gradientes, sem caixas translúcidas, sem fundos escuros.

**Sem repetição.** Os mesmos cinco indicadores apareciam na capa, no sumário executivo, no slide de cada seção e no fechamento — quatro vezes. Correções:

| Antes | Agora |
|---|---|
| Capa com faixa de 5 KPIs | Capa só com título e data |
| Slide de fechamento repetindo tudo | Removido |
| Farol: números grandes + rosca com os mesmos 27/1 | Só os números + tabela de próximos vencimentos |
| Ativos: total + 2 cards + lista "Distribuição por Criticidade" repetindo os cards + gráfico | Total + MINA/USINA + um gráfico |
| Alertas repetindo as fichas de testes já mostradas no Farol | Slide de próximos passos, sem repetir códigos |

**9 → 8 slides**, e o código da função caiu de 28.309 para 17.165 caracteres. Cada informação aparece uma única vez, e cada slide termina com o que exige ação: os 4 vencimentos próximos, as 4 ordens atrasadas com dias de atraso, as 5 prioridades do próximo ciclo.

Gráficos passaram a ser barras de cor única (a rosca de prioridade virou barra, mais legível), com rótulos de valor e sem linhas de grade.

---


## V7.7 — Ordens de Inspeção somente do INSES
A seção passou a exibir exclusivamente o centro de trabalho **INSES (Inspeção Estrutural)**: **30 ordens**, todas de 2026. Foram removidas as 44 ordens do **INSFER** (ferrovia — planos de inspeção dos silos) e as 2 do SC23 (inspeção topográfica); se quiser o SC23 de volta, é só avisar.

**Situação das 30 ordens INSES:** 2 concluídas · 11 em execução · 13 programadas · **4 atrasadas**. Distribuição: MINA 9 / USINA 21. Entrada em 2026: junho 6, julho 15, agosto 9.

**As 4 atrasadas** (com selo de dias de atraso no card):

| Ordem | Início prog. | Atraso | Descrição |
|---|---|---|---|
| 202603222147 | 27/07/2026 | 20 dias | INSP ESTRUTURAL ESPECIAL RC2092KS04 |
| 202603221959 | 28/07/2026 | 19 dias | INSP ESTRUTURAL ESPECIAL RC2092KS03 |
| 202603533526 | 10/08/2026 | 6 dias | RC2092KS02 — INSPEÇÃO ESTRUTURAL MP |
| 202603558122 | 10/08/2026 | 6 dias | EP2091KS03 — INSPEÇÃO ESTRUTURAL MP |

Com a saída do INSFER, o backlog de 40 ordens de silo apontado na V7.5 deixa de aparecer no painel — vale acompanhá-lo por outro caminho, já que os atrasos chegavam a 563 dias. Filtros de centro de trabalho removidos (só há INSES agora); KPIs, gráficos e PPT atualizados.

---


## V7.6 — Ativos Críticos apenas com estruturais
Componentes saíram do escopo. Dos 172 vínculos da base SAP, **56 foram removidos** e restaram **116 ativos estruturais** (MINA 56 / USINA 60) em 108 locais de instalação, sob os mesmos 26 controles — nenhum controle ficou sem ativos.

**O que foi removido (56):** deck, estrutura de acesso, proteção, sustentação, coluna e torre de sustentação, alçapão de manutenção, silo pulmão e intermediário, sistema SPDA, grade de piso e canaleta — além de **duplicações do mesmo ativo em dois níveis da hierarquia** (ex.: `TR1080KS83-ST1` e `TR1080KS83-ST1-ST01` são o mesmo transportador; ficou apenas um).

**O que foi mantido como estrutural**, conforme sua orientação: batentes físicos (CTH-000021799 com 10 e CTH-000021855 com 8), coberturas de correia (CTH-000013586 com 4) e FIT stations (CTH-000031773 com 3).

**Validação:** a nova contagem faz **23 dos 26 controles baterem exatamente com o Bwise** (antes eram 20) — indicação forte de que o critério está correto. Os 3 que ainda divergem estão sinalizados em laranja no card: CTH-000014809 (4 × Bwise 32), CTH-000031305 (2 × 4) e CTH-000013586 (4 × 5).

A coluna "Nível" e os selos de componente foram removidos da tabela, já que todos os ativos agora são estruturais. KPIs, gráficos e PPT atualizados.

---


## V7.5 — atualização de 16/08/2026 (4 planilhas novas)
Fontes: `gridexport.xlsx` (Bwise), `CODIGO DE CONTROLES.xlsx` (base SAP de ativos), `Notas.xlsx`, `Ordems sistematicas.xlsx`.

### Tratamento de duplicidades (todas as fontes)
| Fonte | Bruto | Duplicidades | Resultado |
|---|---|---|---|
| Base de ativos | 224 registros | **52 pares risco-ativo repetidos** | 172 vínculos únicos |
| Notas SAP | 559 notas | 0 nº repetido · **7 rejeitadas (REJE)** excluídas | 552 notas ativas |
| Ordens sistemáticas | 459 ordens | 0 nº repetido · filtro atividade INP | 76 ordens de inspeção |
| Controles (Bwise) | 28 | 0 | 28 controles |

### 1. Farol de Testes — ciclo de julho encerrado
- **Os 2 testes de julho foram concluídos**: CTH-000022830 (vencia 15/07) → **15/01/2027** e CTH-000014809 (vencia 26/07) → **26/01/2027**. Ambos destacados em verde na tabela com a marcação "✔ teste de julho concluído no Bwise".
- **0 testes vencidos** na carteira. Situação: 27 Funciona · 1 ND (CTH-000030055).
- Todos os "dias para vencimento" foram recalculados para **16/08/2026** (antes estavam na base de 14/07).
- ⚠️ **Próximos 60 dias — 4 testes**: CTH-000021836 (**26/08 — 10 dias**), CTH-000021818 (08/09), CTH-000031159 (09/09), CTH-000030053 (11/10).
- Periodicidade e status agora vêm direto do `gridexport` (Bwise): 17 controles de 6m, 10 de 12m, 1 de 24m.

### 2. Ativos Críticos — base SAP completa
- **172 vínculos únicos** risco-ativo (67 MINA / 105 USINA) em **164 locais distintos**, sob **26 controles**.
- Cada card separa **103 estruturas-mãe** (nível -ST1/-ST01) de **69 componentes** (deck, estrutura de acesso, proteção, sustentação, torre, silos, SPDA), com selo por linha.
- Reconciliação com o Bwise exibida em cada card. **6 controles divergem** da base SAP e merecem verificação: CTH-000014809 (Bwise 32 × base 22), CTH-000031784 (9 × 18), CTH-000013440 (6 × 22), CTH-000031305 (4 × 14), CTH-000013586 (5 × 4), CTH-000031159 (1 × 2). Os outros 20 batem exatamente.
- CTH-000031774 e CTH-000030055 seguem sem ativos vinculados na base.

### 3. Notas SAP — carteira bem maior
- **552 notas ativas** em **72 locais** (MINA 277 / USINA 275) — antes eram 189.
- Prioridade: **P1 40 · P2 486 · P3 26**. O bloco vermelho de Risco Alto foi reconstruído com as 40 notas P1 (com rolagem).
- ⚠️ **19 notas vencidas** (conclusão desejada anterior a 16/08/2026) — antes eram 0. Filtro dedicado disponível.
- Top centros de trabalho: SC25 (259), SC21 (133), SC28 (41), EESS01ME (34).

### 4. Ordens de Inspeção — INSES + INSFER
- **76 ordens** com atividade de inspeção (INP), de 459 sistemáticas: **INSES 30 · INSFER 44 · SC23 2**.
- Situação: 2 concluídas · 11 em execução · 17 programadas · **46 atrasadas**.
- 🔴 **Achado relevante**: das 46 atrasadas, **40 são INSFER** (planos de inspeção dos silos 1 e 2), em aberto (status ABER) com início programado desde **janeiro/2025** — atraso mediano de **251 dias**, máximo de 563. O INSES tem apenas 4 atrasos, todos de 6 a 11 dias.
- Detalhes de cada ordem trazem Status Usuário, Status Sistema, tipo, datas de entrada/base/programação/conclusão e plano. Novos filtros por centro de trabalho e por situação.

### Verificação
HTML com tags balanceadas; ambos os blocos JS aprovados no `node --check`; contagens conferidas por script (28 linhas do farol, 26 cards/172 ativos, 72 cards/552 notas sem nº repetido, 76 ordens sem nº repetido); PPT gerado e inspecionado visualmente — 9 slides, sem sobreposição.

### Ações recomendadas
1. Programar o teste do **CTH-000021836** — vence 26/08/2026.
2. Tratar o **backlog de 40 ordens INSFER** dos silos (algumas com mais de 500 dias).
3. Repactuar ou concluir as **19 notas vencidas**.
4. Conferir os **6 controles com divergência** de quantidade de ativos entre Bwise e SAP.

---


## Novidade da V7.4 — Farol de Testes
Destaque explícito de que **CTH-000021832** e **CTH-000013440** (venciam 13/07/2026) **já foram tratados e concluídos no Bwise em 06/07/2026** — novo vencimento 13/01/2027: callout dedicado no banner verde, linhas dos dois controles realçadas em verde na tabela com a nota "✔ concluído no Bwise em 06/07", e chips correspondentes no PPT (slides 3 e 8) com a marcação "✔ Bwise 06/07".

---


## Novidades da V7.3 — Ordens de Inspeção com status e tolerância
Fonte: nova "Ordens de Inspeção.xlsx" (aba Tolerância consolidada nas colunas Data Planejada / Tol. Mínima / Tol. Máxima).

- Cada ordem agora exibe um **selo de situação** calculado pela janela de tolerância (base 14/07/2026): **8 Concluídas · 36 Na Janela · 8 Programadas · 4 Sem Tolerância · 0 Fora da Tolerância**.
- Ao expandir a ordem: **Status Usuário** (ex.: AGDO AGPR ATCR, EXEC ATCR VPTS, ENCR...), **Status Sistema** (LIB/ABER + flags), Data Planejada, **Tolerância Mínima e Máxima**, Início Programado e Conclusão Real. A janela mín → máx também aparece no canto do card.
- Novos **filtros por situação** (Concluídas / Na Janela / Programadas / Sem Tolerância / Fora da Tolerância) e cards ordenados por urgência (janela vencendo primeiro; concluídas ao final).
- Card "Normal (0)" substituído por **"Fora da Tolerância: 0 — 100% dentro dos prazos"**; gráfico "Status das Ordens" agora mostra a distribuição por situação.
- **PPT (slide 6)**: faixa vermelha passa a ler os números direto do painel — "56 ORDENS · 100% ATIVO CRÍTICO — 8 CONCLUÍDAS · 36 NA JANELA · 8 PROGRAMADAS · 0 FORA DA TOLERÂNCIA". Testado: 9 slides OK.
- Observação: 4 ordens sem datas de tolerância na planilha (202603375055, 202603597162, 202603597163, 202603597165) — marcadas como "Sem Tolerância".

---


## Novidades da V7.2 (solicitação de 14/07)
1. **Ativos Críticos — nova base "Cópia de BASES.xlsx"**: agora são **26 controles** com ativos vinculados (antes 23; entraram CTH-000003935, CTH-000021912 e CTH-000021919) e **118 vínculos únicos risco-ativo**. Quantidade de ativos por controle disponível em cada card e no gráfico "Top Controles": 20229 (22), 21799 (10), 12891/21836/21855/31784 (8), 13440/21832 (7), 21818 (6), 13586/14809/31305 (4), 21823/31773 (3), 19610/22830/23137/30267 (2), e 3935/14836/21912/21919/29514/29541/30053/31159 (1 cada). CTH-000031774 e CTH-000030055 não têm ativos vinculados na base atual (nota exibida na seção).
2. **Contagem corrigida no Painel de Controle**: agora fecha — **MINA 55 + USINA 63 = 118 vínculos** (47% / 53%). O card informa também os 110 ativos físicos únicos. Antes, misturava vínculos (113) com ativos físicos (49+52=101), o que causava a inconsistência que você notou.
3. **Notas SAP — bloco "Risco Alto"**: nova tabela destacada em vermelho no topo da seção com as **15 notas P1** (13 USINA · 2 MINA), com local, descrição, CT e prazos — além do filtro P1 já existente.
4. **PPT sincronizado**: slide de Ativos Críticos com 118, MINA 55/USINA 63 e ranking Top 8 por nº de ativos. Regenerado e testado — 9 slides OK.

---

# Histórico V7.1
**Data-base dos dados: 14/07/2026** · Fontes: Testes de Controle (GRC/Bwise, 185.292 linhas), Notas.xlsx, Ordens de Inspeção.xlsx, Base real Ativos únicos = 113.xlsx

## 1. Dados atualizados

| Indicador | V7 (antes) | V7.1 (agora) | Fonte |
|---|---|---|---|
| Controles | 28 (27 Funciona · 1 ND) | 28 (27 Funciona · 1 ND) — sem alteração | Testes de Controle |
| Farol de testes | datas de 8 controles desatualizadas | **28 vencimentos recalculados** p/ 14/07/2026 | Testes de Controle |
| Ativos críticos | 113 vínculos · 23 CTHs | confirmados (113 vínculos · 101 ativos físicos: 49 MINA / 52 USINA) | Base 113 |
| Notas SAP | 207 notas · 71 locais | **189 notas · 24 locais** (MINA 126 / USINA 63) | Notas.xlsx |
| Prioridade notas | P1 22 · P2 179 · P3 6 | **P1 15 · P2 161 · P3 13** · 0 vencidas | Notas.xlsx |
| Centros de trabalho | 6 CTs (SC25 99…) | **4 CTs: SC25 159 · SC76 15 · SC28 13 · SC27 2** | Notas.xlsx |
| Ordens de inspeção | 45 (32 MINA / 13 USINA) | **56 (36 MINA / 20 USINA)** · 100% Ativo Crítico | Ordens.xlsx |
| Timeline ordens | Jan–Jun | **Mar 1 · Jun 45 · Jul 10** (entrada 2026) | Ordens.xlsx |
| Planos de ação | 8 (6 concluídas · 2 no prazo) | mantido — sem base nova no anexo | Bwise |

### Farol de Testes — principais mudanças
- **CTH-000021832 e CTH-000013440**: testados em **06/07/2026** (Funciona) → novo vencimento **13/01/2027**. A captura de tela anexa (com vencimento 13/07) refletia a situação anterior ao teste.
- **⚠️ CTH-000022830 vence em 15/07/2026 (amanhã)** e **CTH-000014809 em 26/07/2026** — únicos testes pendentes de julho.
- Novos vencimentos também para: CTH-000003935 (24/11), CTH-000021912 (24/11), CTH-000019610 (03/12), CTH-000030267/31773/31774/31784 (15/12), CTH-000014836 (28/05/27), CTH-000029514 (28/06/27), CTH-000023137 (15/06/27), CTH-000021799/21855 (17/06/27).
- CTH-000030055 permanece **ND** (monitoramento por inclinômetros — agenda de tratativa já existente).
- Banner atualizado: **11 testes concluídos em jun–jul/2026** (9 em junho, incluindo CTH-000029514 em 30/06, + 2 em julho).

## 2. Erros de código encontrados e corrigidos
1. **Gráfico "Nível de Risco" (ch7)**: array de labels tinha 5 itens para 3 fatias (percentuais como labels) — fatias exibiam rótulos errados. Corrigido.
2. **Gráficos Mina vs Usina (ch3/ch5)**: usavam 68/70 (=138), inconsistente com a base (101 ativos físicos: 49/52). Corrigido.
3. **PPT — slide Notas**: pizza de prioridades usava [8, 170, 29], divergente do painel. Agora [15, 161, 13].
4. **PPT — slide Alertas**: "CTH-000014809 vence em 07/07/2026 (19 dias)" — data errada (era 26/07). Corrigido para o alerta real (CTH-000022830, 15/07).
5. **PPT — alerta de julho** listava 3 testes e omitia o CTH-000022830; painel dizia 4. Unificado: 2 testes pendentes.
6. **Cards de ativos**: listas internas incompletas (ex.: CTH-000031784 mostrava 8 de 9 ativos). Reconstruídos os 23 cards — soma agora fecha em 113.
7. Rótulos imprecisos: "Total de Ativos 113" ao lado de MINA 49 + USINA 52 (=101) — esclarecido como "vínculos únicos risco-ativo" vs "ativos físicos".

**Verificação realizada:** HTML com tags balanceadas; os 2 blocos JavaScript passaram no `node --check`; contagens conferidas programaticamente (28 linhas farol, 23 cards/113 ativos, 24 cards/189 notas, 56 ordens).

## 3. Exportação PowerPoint — testada de verdade
A função `expPPT()` foi executada em ambiente simulado (Node + jsdom + PptxGenJS 3.12): gerou **FMDS_Serra_Sul_2026-07-14.pptx com 9 slides**, sem erros. Slides renderizados e inspecionados visualmente (capa, farol, alertas) — valores novos presentes (189, 56, 36/20, SC25 159, 11 testes, CTH-000022830 15/07) e sem sobreposição de layout após o ajuste para 11 chips de testes concluídos. No navegador, basta clicar em **"Exportar PPT"** na barra lateral (requer internet para carregar a biblioteca na 1ª vez).

## 4. Avaliação geral da ferramenta
Pontos fortes: arquivo único e leve (~264 KB), sem dependência de servidor; filtros, busca e exportações Excel/CSV funcionais; visual executivo consistente entre painel e PPT.

Atenções:
- Os botões **"Importar"** apenas contam as linhas do arquivo e mostram notificação — não atualizam tabelas/gráficos (dados são estáticos no HTML). Atualizações exigem regerar o arquivo (como feito agora).
- As notas do anexo abrangem **criação 2024–2026** (48+65+76); o subtítulo da seção foi ajustado de "criadas em 2026" para "carteira ativa".
- Planos de Ação seguem com os 8 registros de dezembro — se houver base Bwise nova, posso atualizar.
- Bibliotecas (Chart.js, XLSX, PptxGenJS) vêm de CDN — exigem internet no 1º carregamento.

## 5. Ação recomendada imediata
Registrar no Bwise o teste do **CTH-000022830 até 15/07/2026 (amanhã)** e programar o **CTH-000014809 (26/07)**.

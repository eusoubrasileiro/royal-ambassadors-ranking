# Jogos na Embaixada - Documentacao

## Estrutura do games.json

O arquivo `public/data/games.json` armazena todos os jogos/gincanas realizados na embaixada.

### Campos principais

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| updatedAt | string | Sim | Data/hora da ultima atualizacao (ISO 8601) |
| defaultRules | array | Sim | Regras padrao de pontuacao |
| games | array | Sim | Lista de jogos realizados |

### Estrutura de um jogo

| Campo | Tipo | Obrigatorio | Descricao |
|-------|------|-------------|-----------|
| id | number | Sim | ID unico do jogo |
| name | string | Sim | Nome do jogo/gincana |
| date | string | Sim | Data do jogo (YYYY-MM-DD) |
| description | string | Nao | Descricao opcional |
| icon | string | Nao | Nome do icone lucide-react |
| rules | array | Nao | Regras customizadas (sobrescreve defaultRules) |
| results | array | Sim | Resultados com participantes |

### Estrutura de um resultado

| Campo | Tipo | Descricao |
|-------|------|-----------|
| participantId | number | ID do participante (ver tabela abaixo) |
| position | number | Posicao no jogo (1 = primeiro lugar) |
| points | number | Pontos ganhos |

---

## Exemplos

### Jogo Individual (competicao com posicoes)

Quando cada participante compete individualmente:

```json
{
  "id": 1,
  "name": "Futebol de Mesa",
  "date": "2026-01-03",
  "description": "Torneio de pebolim",
  "results": [
    { "participantId": 2, "position": 1, "points": 50 },
    { "participantId": 1, "position": 2, "points": 30 },
    { "participantId": 3, "position": 3, "points": 20 }
  ]
}
```

### Jogo de Time (todos ganham mesmos pontos)

Quando um **TIME** vence, todos os membros recebem a mesma posicao e pontos:

```json
{
  "id": 2,
  "name": "Gincana de Times",
  "date": "2026-01-10",
  "description": "Time campeao da gincana",
  "icon": "Users",
  "results": [
    { "participantId": 1, "position": 1, "points": 50 },
    { "participantId": 2, "position": 1, "points": 50 },
    { "participantId": 3, "position": 1, "points": 50 },
    { "participantId": 4, "position": 1, "points": 50 }
  ]
}
```

**Nota:** Todos os membros do time campeao tem `"position": 1` e recebem os mesmos pontos.

### Jogo com Regras Customizadas

Quando o jogo tem pontuacao diferente do padrao:

```json
{
  "id": 3,
  "name": "Quiz Biblico",
  "date": "2026-01-15",
  "icon": "Brain",
  "rules": [
    { "position": 1, "label": "Campeao", "points": 60 },
    { "position": 2, "label": "Vice", "points": 40 },
    { "position": 3, "label": "3o Lugar", "points": 25 }
  ],
  "results": [
    { "participantId": 2, "position": 1, "points": 60 },
    { "participantId": 5, "position": 2, "points": 40 }
  ]
}
```

---

## IDs dos Participantes

Use estes IDs no campo `participantId`:

| ID | Nome |
|----|------|
| 1 | Arthur |
| 2 | Daniel |
| 3 | Richarlyson |
| 4 | Miguel |
| 5 | Felipe |
| 6 | Caio |
| 7 | Elias |
| 8 | Joao |
| 9 | Kaique / Davi |

**Importante:** Consulte `public/data/leaderboard.json` para lista atualizada de participantes e seus IDs.

---

## Icones Disponiveis

Icones do [lucide-react](https://lucide.dev/icons) que podem ser usados no campo `icon`:

| Icone | Uso sugerido |
|-------|--------------|
| `Gamepad2` | Jogos em geral (padrao) |
| `Trophy` | Competicoes/campeonatos |
| `Target` | Jogos de precisao |
| `Zap` | Jogos rapidos/relampago |
| `Brain` | Quiz/perguntas |
| `Users` | Jogos de time |
| `Flag` | Corridas/estafetas |
| `Puzzle` | Jogos de logica |
| `Dices` | Jogos de tabuleiro |

---

## Regras Padrao

As regras padrao definidas em `defaultRules` sao:

| Posicao | Label | Pontos |
|---------|-------|--------|
| 1 | 1o Lugar | 50 |
| 2 | 2o Lugar | 30 |
| 3 | 3o Lugar | 20 |

Para usar pontuacao diferente, adicione o campo `rules` ao jogo com suas proprias regras.

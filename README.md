# Projeto-de-Desenvolvimento-de-uma-Solucao-de-Business-Intelligence-BI-
Projeto Desenvolvimento de um painel de BI.

## Painel de Capacidade e Atendimento · KX Soluções

Painel de BI da Etapa 4 do projeto: mostra como o tempo da KX se divide entre
clientes e tipos de atividade, quanto da capacidade está ocupada, o que pode ser
delegado e quanto tempo vai para prospecção.

Feito com Next.js (App Router, JavaScript), CSS puro (CSS Modules) e Chart.js.

## Como rodar

Precisa do Node.js 20 ou mais novo. Na pasta do repositório:

```bash
npm install
npm run dev
```

Abra http://localhost:3000. Cada arquivo salvo atualiza a página sozinho.

## O que o painel mostra

| Visual | Pergunta que responde | Feito com |
| --- | --- | --- |
| Cartões no topo | Quanto da capacidade está ocupada? Quanto é delegável? Quanto vai para prospecção? | HTML + CSS |
| Horas por semana | A carga cabe na capacidade dos sócios? | Chart.js |
| Tempo por cliente | Qual cliente consome mais tempo? | HTML + CSS |
| Tempo por atividade | O que mais ocupa a rotina e o que dá para delegar? | HTML + CSS |
| Cliente × atividade | Em que tipo de trabalho vai o tempo de cada cliente? | `<table>` + `color-mix()` |
| Apontamentos | De onde saíram os números? | `<table>` |

Filtros: mês, cliente e pessoa. Todos os visuais recalculam juntos.

## Estrutura

```
├── app/
│   ├── layout.js          título da aba e idioma
│   ├── page.js            lê os dados e entrega para o Painel
│   └── globals.css        cores e medidas (variáveis CSS)
├── components/
│   ├── Painel.js          guarda os filtros e monta a tela (único com estado)
│   ├── Filtros.js
│   ├── CartaoKpi.js       cartão de indicador
│   ├── Medidor.js         barra de ocupação com status
│   ├── Bloco.js           moldura de cada visual (título + pergunta + legenda)
│   ├── Legenda.js
│   ├── GraficoSemanal.js  único componente com Chart.js
│   ├── BarrasHorizontais.js
│   ├── MapaDeCalor.js
│   └── TabelaRegistros.js
├── lib/
│   ├── calculos.js        toda a matemática (funções puras)
│   ├── config.js          horas por dia, feriados, lista de atividades
│   ├── datas.js
│   └── formatar.js        números em pt-BR
├── data/
│   └── registros.json     apontamentos de horas (hoje: fictícios)
└── scripts/
    └── gerar-dados-ficticios.mjs
```

Cada componente tem um `.module.css` com o mesmo nome: as classes só valem
dentro dele. As cores ficam todas em `app/globals.css`.

## Dados

`data/registros.json` hoje tem **dados fictícios** (459 apontamentos de 2 sócios,
de 07/09 a 13/11/2026), gerados por `npm run dados:ficticios`.

Para usar a base anonimizada:

1. Substitua `data/registros.json` mantendo os campos abaixo.
2. Em `lib/config.js`, mude `USANDO_DADOS_FICTICIOS` para `false`.

Filtros, clientes, pessoas e meses saem dos próprios dados; não precisa mudar
mais nada no código.

```json
{
  "id": 1,
  "data": "2026-10-06",
  "colaborador": "Sócio 1",
  "cliente": "Cliente A",
  "atividade": "Desenvolvimento",
  "horas": 2.5,
  "delegavel": false,
  "descricao": "Tela de cadastro"
}
```

| Campo | Regra |
| --- | --- |
| `data` | texto `AAAA-MM-DD` |
| `colaborador`, `cliente` | já anonimizados; nome real não entra no repositório |
| `atividade` | um dos tipos de `lib/config.js` (tipos novos aparecem no fim do mapa de calor) |
| `horas` | número decimal: `1.5` é 1h30 |
| `delegavel` | `true` quando outra pessoa poderia fazer a tarefa |

## O que confirmar com a KX

Ficam em `lib/config.js`:

- `HORAS_POR_DIA`: horas por pessoa por dia útil (hoje 8).
- `FERIADOS`: hoje só os nacionais de 2026.
- `ATIVIDADES`: a lista de tipos de atividade.

O status da ocupação (`lib/calculos.js`, `statusDaOcupacao`) considera
"Perto do limite" a partir de 85% e "Acima da capacidade" acima de 100%.

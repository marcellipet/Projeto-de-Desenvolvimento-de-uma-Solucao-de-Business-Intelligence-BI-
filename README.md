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

## Layout

O painel imita uma página do Power BI: uma tela de 1280 × 720 que aumenta ou
diminui inteira para caber na janela (`public/escala.js`). Em cima ficam o
cabeçalho e a barra de filtros; embaixo, as abas das páginas. No celular (até
760px) a tela vira uma página comum que rola. Segue o tema claro ou escuro do
sistema.

**Filtros** (botões, um ativo por grupo): período, cliente, pessoa e tipo
(delegável ou não). Todas as páginas recalculam juntas.

| Página | Indicadores | Visuais |
| --- | --- | --- |
| Visão Geral | horas registradas, ocupação da capacidade, horas delegáveis, prospecção | tempo por cliente, tempo por atividade (delegável em laranja), faixa de uso da capacidade |
| Por Cliente | cliente com mais horas, clientes atendidos, concentração nos 2 maiores, trabalho interno | mapa de calor cliente × atividade, resumo por cliente |
| Tendência | média semanal, semana mais cheia, semanas acima da capacidade, média por pessoa por dia | horas por semana × capacidade (Chart.js), horas por pessoa |
| Decisão de Contratação | tempo delegável, liberável por semana, equivalente em pessoas, prospecção | horas delegáveis por atividade, rosca delegável × não delegável |
| Apontamentos | | tabela com todos os registros filtrados |

Só o gráfico semanal usa Chart.js. Barras, rosca, mapa de calor e medidores são
HTML + CSS (`width` em %, `conic-gradient`, `color-mix`). As animações (barras
crescendo, rosca girando, páginas entrando) são CSS e ficam desligadas para quem
pediu menos movimento no sistema.

## Estrutura

```
├── app/
│   ├── layout.js          fonte, título da aba e o script de escala
│   ├── page.js            lê os dados e entrega para o Painel
│   └── globals.css        cores (claro e escuro) e medidas
├── components/
│   ├── Painel.js          guarda filtros e aba aberta, monta a tela (único com estado)
│   ├── Filtros.js         barra de segmentadores
│   ├── paginas/           uma página por aba + a grade comum (Pagina.module.css)
│   ├── CartaoKpi.js       cartão de indicador
│   ├── Medidor.js         barra fina de ocupação com status
│   ├── Bloco.js           cartão de cada visual (título + pergunta + legenda)
│   ├── Legenda.js
│   ├── GraficoSemanal.js  único componente com Chart.js
│   ├── BarrasHorizontais.js
│   ├── MapaDeCalor.js
│   ├── Rosca.js
│   ├── UsoDaCapacidade.js
│   ├── TabelaClientes.js
│   └── TabelaRegistros.js
├── lib/
│   ├── calculos.js        toda a matemática (funções puras); resumir() alimenta as páginas
│   ├── config.js          horas por dia, feriados, lista de atividades
│   ├── datas.js
│   └── formatar.js        números em pt-BR
├── public/
│   └── escala.js          encaixa a tela 1280 × 720 na janela
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

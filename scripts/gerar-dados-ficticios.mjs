// Gera data/registros.json com apontamentos FICTÍCIOS para desenvolver o painel
// enquanto a base anonimizada real não chega.
//
// Uso: npm run dados:ficticios
//
// Imita a rotina de 2 sócios de uma software house entre 07/09 e 13/11/2026.
// A semente é fixa: rodar de novo gera exatamente os mesmos dados.

import { writeFileSync } from "node:fs";

/* ---------- sorteio com semente fixa (mulberry32) ---------- */
function criarSorteio(semente) {
  return function () {
    semente |= 0;
    semente = (semente + 0x6d2b79f5) | 0;
    let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const sorteio = criarSorteio(20261117);

// pesos: [[valor, peso], ...]
function sortearComPeso(pesos) {
  let total = 0;
  for (const [, peso] of pesos) total += peso;
  let x = sorteio() * total;
  for (const [valor, peso] of pesos) {
    x -= peso;
    if (x < 0) return valor;
  }
  return pesos[pesos.length - 1][0];
}

const umDe = (lista) => lista[Math.floor(sorteio() * lista.length)];

/* ---------- parâmetros ---------- */
const INICIO = new Date(2026, 8, 7); // 07/09/2026
const FIM = new Date(2026, 10, 13); // 13/11/2026
const PESSOAS = ["Sócio 1", "Sócio 2"];
const FERIADOS = ["2026-09-07", "2026-10-12", "2026-11-02"];

// chance de cada atividade ser delegável e descrições de exemplo
const ATIVIDADES = {
  "Desenvolvimento": { chanceDelegavel: 0.25, descricoes: ["Tela de cadastro", "API de pedidos", "Integração de pagamento", "Correção de bug", "Relatório em PDF", "Revisão de código"] },
  "Sustentação e suporte": { chanceDelegavel: 0.7, descricoes: ["Chamado de usuário", "Ajuste em relatório", "Atualização de dependências", "Correção em produção", "Monitoramento"] },
  "Reuniões com cliente": { chanceDelegavel: 0.05, descricoes: ["Alinhamento semanal", "Levantamento de requisitos", "Apresentação de entrega", "Planejamento de sprint"] },
  "Consultoria técnica": { chanceDelegavel: 0.1, descricoes: ["Revisão de arquitetura", "Parecer técnico", "Modelagem de banco", "Diagnóstico de performance"] },
  "Infraestrutura AWS": { chanceDelegavel: 0.45, descricoes: ["Ajuste de custos AWS", "Deploy em produção", "Configuração de servidor", "Rotina de backup"] },
  "Administrativo": { chanceDelegavel: 0.8, descricoes: ["Notas fiscais", "Financeiro", "Contratos", "E-mails e agenda"] },
  "Prospecção": { chanceDelegavel: 0, descricoes: ["Proposta comercial", "Contato com lead", "Reunião com possível cliente"] },
};

// cada cliente tem um perfil de trabalho diferente
const PERFIL_DO_CLIENTE = {
  "Cliente A": [["Desenvolvimento", 0.6], ["Sustentação e suporte", 0.15], ["Reuniões com cliente", 0.15], ["Infraestrutura AWS", 0.1]],
  "Cliente B": [["Sustentação e suporte", 0.55], ["Desenvolvimento", 0.2], ["Reuniões com cliente", 0.15], ["Infraestrutura AWS", 0.1]],
  "Cliente C": [["Infraestrutura AWS", 0.45], ["Desenvolvimento", 0.25], ["Reuniões com cliente", 0.15], ["Sustentação e suporte", 0.15]],
  "Cliente D": [["Consultoria técnica", 0.55], ["Reuniões com cliente", 0.3], ["Desenvolvimento", 0.15]],
  "Cliente E": [["Desenvolvimento", 0.5], ["Reuniões com cliente", 0.25], ["Sustentação e suporte", 0.25]],
  "Cliente F": [["Sustentação e suporte", 0.5], ["Consultoria técnica", 0.3], ["Reuniões com cliente", 0.2]],
};
const PESO_DO_CLIENTE = [["Cliente A", 0.32], ["Cliente B", 0.24], ["Cliente C", 0.16], ["Cliente D", 0.12], ["Cliente E", 0.09], ["Cliente F", 0.07]];
const DURACOES = [[0.5, 1], [1, 3], [1.5, 3], [2, 4], [2.5, 2], [3, 2], [4, 1]];

/* ---------- geração ---------- */
const doisDigitos = (n) => String(n).padStart(2, "0");
const paraTexto = (d) => `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;

const registros = [];
let id = 1;

for (let dia = new Date(INICIO); dia <= FIM; dia.setDate(dia.getDate() + 1)) {
  const diaDaSemana = dia.getDay();
  if (diaDaSemana === 0 || diaDaSemana === 6) continue;
  const data = paraTexto(dia);
  if (FERIADOS.includes(data)) continue;

  for (const pessoa of PESSOAS) {
    // quantas horas a pessoa trabalha nesse dia
    const meta = pessoa === "Sócio 1" ? 7.5 + sorteio() * 2.5 : 6.5 + sorteio() * 3;
    let feito = 0;

    while (feito < meta - 0.25) {
      let horas = sortearComPeso(DURACOES);
      horas = Math.min(horas, Math.round((meta - feito) * 2) / 2);
      if (horas < 0.5) break;

      let cliente;
      let atividade;
      if (sorteio() < 0.15) {
        cliente = "Interno";
        atividade = sorteio() < 0.27 ? "Prospecção" : "Administrativo";
      } else {
        cliente = sortearComPeso(PESO_DO_CLIENTE);
        atividade = sortearComPeso(PERFIL_DO_CLIENTE[cliente]);
      }

      registros.push({
        id: id++,
        data,
        colaborador: pessoa,
        cliente,
        atividade,
        horas,
        delegavel: sorteio() < ATIVIDADES[atividade].chanceDelegavel,
        descricao: umDe(ATIVIDADES[atividade].descricoes),
      });
      feito += horas;
    }
  }
}

const destino = new URL("../data/registros.json", import.meta.url);
writeFileSync(destino, JSON.stringify(registros, null, 2) + "\n");
console.log(`${registros.length} registros fictícios gravados em data/registros.json`);

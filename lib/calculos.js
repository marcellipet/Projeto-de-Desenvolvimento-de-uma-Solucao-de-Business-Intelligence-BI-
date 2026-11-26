// Toda a matemática do painel, em funções puras:
// recebem a lista de registros e devolvem números ou listas.
// Não dependem do React, então dá para testar no console do navegador.

import {
  ATIVIDADE_PROSPECCAO,
  ATIVIDADES,
  CLIENTE_INTERNO,
  FERIADOS,
  HORAS_POR_DIA,
} from "./config";
import { dataCurta, diasUteisEntre, segundaDaSemana } from "./datas";

/* ---------- filtros ---------- */

// filtros = { mes, cliente, pessoa, tipo }
// tipo: "todos" | "delegavel" | "nao-delegavel"
export function filtrar(registros, filtros) {
  return registros.filter((r) => {
    const tipoOk =
      filtros.tipo === "todos" ||
      (filtros.tipo === "delegavel" ? r.delegavel : !r.delegavel);

    return (
      (filtros.mes === "todos" || r.data.startsWith(filtros.mes)) &&
      (filtros.cliente === "todos" || r.cliente === filtros.cliente) &&
      (filtros.pessoa === "todas" || r.colaborador === filtros.pessoa) &&
      tipoOk
    );
  });
}

// valoresUnicos(registros, "cliente") → ["Cliente A", "Cliente B", ...]
export function valoresUnicos(registros, campo) {
  const unicos = new Set(registros.map((r) => r[campo]));
  return [...unicos].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

// ["2026-09", "2026-10", "2026-11"]
export function mesesDisponiveis(registros) {
  const meses = new Set(registros.map((r) => r.data.slice(0, 7)));
  return [...meses].sort();
}

/* ---------- somas ---------- */

export function somarHoras(registros) {
  return registros.reduce((total, r) => total + r.horas, 0);
}

// somarPor(registros, "cliente")
// → [{ nome: "Cliente A", horas: 248, delegavel: 41 }, ...] do maior para o menor
export function somarPor(registros, campo) {
  const totais = {};

  for (const r of registros) {
    const nome = r[campo];
    if (!totais[nome]) {
      totais[nome] = { nome, horas: 0, delegavel: 0 };
    }
    totais[nome].horas += r.horas;
    if (r.delegavel) {
      totais[nome].delegavel += r.horas;
    }
  }

  return Object.values(totais).sort((a, b) => b.horas - a.horas);
}

// Horas de cada combinação cliente + atividade, para o mapa de calor.
// horasPorCombinacao(registros)["Cliente A|Desenvolvimento"] → 148
export function horasPorCombinacao(registros) {
  const valores = {};
  for (const r of registros) {
    const chave = `${r.cliente}|${r.atividade}`;
    valores[chave] = (valores[chave] || 0) + r.horas;
  }
  return valores;
}

// Colunas do mapa de calor: as atividades da config que existem nos dados,
// na ordem da config, mais qualquer atividade nova que apareça nos dados.
export function atividadesPresentes(registros) {
  const nosDados = valoresUnicos(registros, "atividade");
  const conhecidas = ATIVIDADES.filter((a) => nosDados.includes(a.nome));
  const novas = nosDados
    .filter((nome) => !ATIVIDADES.some((a) => a.nome === nome))
    .map((nome) => ({ nome, curto: nome }));
  return [...conhecidas, ...novas];
}

/* ---------- capacidade ---------- */

// Dias úteis do período coberto pelos dados (do primeiro ao último registro).
// Com filtro de mês, só os dias daquele mês.
export function diasUteisDoPeriodo(registros, mes) {
  if (!registros.length) return [];

  const datas = registros.map((r) => r.data).sort();
  const dias = diasUteisEntre(datas[0], datas[datas.length - 1], FERIADOS);

  return mes === "todos" ? dias : dias.filter((d) => d.startsWith(mes));
}

export function capacidadeEmHoras(diasUteis, pessoas) {
  return diasUteis.length * HORAS_POR_DIA * pessoas;
}

function novaSemana(chave) {
  return {
    chave, // "2026-10-05" (segunda-feira)
    rotulo: dataCurta(chave), // "05/10"
    dias: 0,
    capacidade: 0,
    delegavel: 0,
    naoDelegavel: 0,
  };
}

// Uma linha por semana: horas delegáveis, não delegáveis e a capacidade daquela
// semana (semana com feriado tem menos capacidade).
export function horasPorSemana(registros, diasUteis, pessoas) {
  const semanas = {};

  for (const dia of diasUteis) {
    const chave = segundaDaSemana(dia);
    if (!semanas[chave]) semanas[chave] = novaSemana(chave);
    semanas[chave].dias += 1;
    semanas[chave].capacidade += HORAS_POR_DIA * pessoas;
  }

  for (const r of registros) {
    const chave = segundaDaSemana(r.data);
    if (!semanas[chave]) semanas[chave] = novaSemana(chave);
    if (r.delegavel) semanas[chave].delegavel += r.horas;
    else semanas[chave].naoDelegavel += r.horas;
  }

  return Object.values(semanas).sort((a, b) => a.chave.localeCompare(b.chave));
}

// Acima de 100% é crítico; a partir de 85% é alerta
export function statusDaOcupacao(ocupacao) {
  if (ocupacao > 1) return { tipo: "critico", texto: "Acima da capacidade" };
  if (ocupacao >= 0.85) return { tipo: "alerta", texto: "Perto do limite" };
  return { tipo: "bom", texto: "Com folga" };
}

/* ---------- por cliente ---------- */

// Para a tabela da página Por Cliente:
// [{ nome, horas, delegavel, principal: "Desenvolvimento", horasPrincipal: 150 }]
export function resumoPorCliente(registros) {
  const valores = horasPorCombinacao(registros);

  return somarPor(registros, "cliente").map((cliente) => {
    let principal = "";
    let horasPrincipal = 0;
    for (const chave of Object.keys(valores)) {
      const [nome, atividade] = chave.split("|");
      if (nome === cliente.nome && valores[chave] > horasPrincipal) {
        principal = atividade;
        horasPrincipal = valores[chave];
      }
    }
    return { ...cliente, principal, horasPrincipal };
  });
}

/* ---------- resumo usado por todas as páginas ---------- */

// Calcula de uma vez tudo o que as páginas mostram.
// O Painel chama esta função toda vez que um filtro muda.
export function resumir(registros, filtros) {
  const visiveis = filtrar(registros, filtros);

  const pessoas =
    filtros.pessoa === "todas" ? valoresUnicos(registros, "colaborador").length : 1;
  const diasUteis = diasUteisDoPeriodo(registros, filtros.mes);
  const capacidade = capacidadeEmHoras(diasUteis, pessoas);

  const total = somarHoras(visiveis);
  const delegavel = somarHoras(visiveis.filter((r) => r.delegavel));
  const prospeccao = somarHoras(
    visiveis.filter((r) => r.atividade === ATIVIDADE_PROSPECCAO)
  );
  const interno = somarHoras(visiveis.filter((r) => r.cliente === CLIENTE_INTERNO));

  return {
    visiveis,
    pessoas,
    diasUteis,
    semanasUteis: diasUteis.length / 5, // período medido em semanas de 5 dias
    capacidade,
    total,
    delegavel,
    naoDelegavel: total - delegavel,
    prospeccao,
    interno,
    ocupacao: capacidade ? total / capacidade : 0,
    semanas: horasPorSemana(visiveis, diasUteis, pessoas),
    porCliente: somarPor(visiveis, "cliente"),
    porAtividade: somarPor(visiveis, "atividade"),
    porPessoa: somarPor(visiveis, "colaborador"),
  };
}

// Números no padrão brasileiro: 1.234,5
const formatoNumero = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

// Totais, arredondados: 812.5 → "813 h"
export function horas(valor) {
  return `${formatoNumero.format(Math.round(valor))} h`;
}

// Valor exato, para a tabela: 1.5 → "1,5 h"
export function horasExatas(valor) {
  return `${formatoNumero.format(valor)} h`;
}

// numero(31.27) → "31,3"; numero(0.8, 1) → "0,8"
export function numero(valor, casas = 1) {
  return valor.toLocaleString("pt-BR", {
    minimumFractionDigits: casas,
    maximumFractionDigits: casas,
  });
}

// porcentagem(30, 120) → "25%".
// Com total zero devolve "0%" em vez de "NaN%".
export function porcentagem(parte, total) {
  if (!total) return "0%";
  return `${Math.round((parte / total) * 100)}%`;
}

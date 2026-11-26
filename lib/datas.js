// Datas circulam como texto "AAAA-MM-DD", igual ao JSON.
// Ao virar Date, usamos meio-dia para o fuso horário não trocar o dia.

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_DA_SEMANA = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function paraData(texto) {
  return new Date(texto + "T12:00:00");
}

export function paraTexto(data) {
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

// "2026-10-08" (quinta) → "2026-10-05" (a segunda-feira daquela semana)
export function segundaDaSemana(texto) {
  const data = paraData(texto);
  data.setDate(data.getDate() - ((data.getDay() + 6) % 7));
  return paraTexto(data);
}

// Dias de segunda a sexta entre duas datas (inclusive), sem os feriados
export function diasUteisEntre(inicio, fim, feriados) {
  const dias = [];
  const data = paraData(inicio);
  const ultima = paraData(fim);

  while (data <= ultima) {
    const texto = paraTexto(data);
    const fimDeSemana = data.getDay() === 0 || data.getDay() === 6;
    if (!fimDeSemana && !feriados[texto]) {
      dias.push(texto);
    }
    data.setDate(data.getDate() + 1);
  }

  return dias;
}

// "2026-10-06" → "06/10"
export function dataCurta(texto) {
  return `${texto.slice(8, 10)}/${texto.slice(5, 7)}`;
}

// "2026-10-06" → "ter"
export function diaDaSemana(texto) {
  return DIAS_DA_SEMANA[paraData(texto).getDay()];
}

// "2026-10-06" → "06/10/2026"
export function dataCompleta(texto) {
  return texto.split("-").reverse().join("/");
}

// "2026-10" → "Outubro/2026"
export function nomeDoMes(chave) {
  const [ano, mes] = chave.split("-");
  return `${MESES[Number(mes) - 1]}/${ano}`;
}

// "2026-10" → "Out"
export function mesCurto(chave) {
  return MESES[Number(chave.slice(5, 7)) - 1].slice(0, 3);
}

// Configurações do painel. Ajuste aqui quando a KX confirmar os valores.

// Horas de trabalho de cada pessoa por dia útil (usado na capacidade)
export const HORAS_POR_DIA = 8;

// Mude para false quando data/registros.json tiver a base anonimizada real
export const USANDO_DADOS_FICTICIOS = true;

// Atividade que conta como prospecção de novos clientes
export const ATIVIDADE_PROSPECCAO = "Prospecção";

// Cliente usado para trabalho interno (administrativo, prospecção)
export const CLIENTE_INTERNO = "Interno";

// Feriados nacionais de 2026: não contam como dia útil na capacidade.
// Acrescente feriados municipais ou pontos facultativos se a KX parar neles.
export const FERIADOS = {
  "2026-01-01": "Confraternização Universal",
  "2026-04-03": "Sexta-feira Santa",
  "2026-04-21": "Tiradentes",
  "2026-05-01": "Dia do Trabalho",
  "2026-09-07": "Independência do Brasil",
  "2026-10-12": "Nossa Senhora Aparecida",
  "2026-11-02": "Finados",
  "2026-11-15": "Proclamação da República",
  "2026-11-20": "Consciência Negra",
  "2026-12-25": "Natal",
};

// Tipos de atividade na ordem em que aparecem no mapa de calor.
// "curto" é o nome usado no cabeçalho da tabela, onde o espaço é pequeno.
// Atividades que aparecerem nos dados e não estiverem aqui entram no fim.
export const ATIVIDADES = [
  { nome: "Desenvolvimento", curto: "Desenv." },
  { nome: "Sustentação e suporte", curto: "Suporte" },
  { nome: "Reuniões com cliente", curto: "Reuniões" },
  { nome: "Consultoria técnica", curto: "Consult." },
  { nome: "Infraestrutura AWS", curto: "AWS" },
  { nome: "Administrativo", curto: "Admin." },
  { nome: "Prospecção", curto: "Prospec." },
];

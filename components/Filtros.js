import { mesCurto, nomeDoMes } from "@/lib/datas";
import styles from "./Filtros.module.css";

// Um grupo de botões, como o segmentador do Power BI: só um fica ativo por vez.
// opcoes: [{ valor, texto, dica }]. "dica" é o nome completo (tooltip e leitor de tela).
function Segmentador({ rotulo, valor, opcoes, onEscolher }) {
  return (
    <div className={styles.grupo} role="group" aria-label={rotulo}>
      <span className={styles.rotulo}>{rotulo}</span>
      {opcoes.map((opcao) => (
        <button
          key={opcao.valor}
          type="button"
          className={styles.chip}
          aria-pressed={valor === opcao.valor}
          aria-label={opcao.dica}
          title={opcao.dica}
          onClick={() => onEscolher(opcao.valor)}
        >
          {opcao.texto}
        </button>
      ))}
    </div>
  );
}

// Não guarda estado: recebe os filtros do Painel e avisa quando algo muda
export default function Filtros({ filtros, opcoes, onMudar, onLimpar }) {
  function mudar(campo, valor) {
    onMudar({ ...filtros, [campo]: valor });
  }

  const algumFiltroAtivo =
    filtros.mes !== "todos" ||
    filtros.cliente !== "todos" ||
    filtros.pessoa !== "todas" ||
    filtros.tipo !== "todos";

  return (
    <div className={styles.filtros}>
      <Segmentador
        rotulo="Período"
        valor={filtros.mes}
        onEscolher={(valor) => mudar("mes", valor)}
        opcoes={[
          { valor: "todos", texto: "Todos", dica: "Todo o período" },
          ...opcoes.meses.map((mes) => ({
            valor: mes,
            texto: mesCurto(mes),
            dica: nomeDoMes(mes),
          })),
        ]}
      />

      <Segmentador
        rotulo="Cliente"
        valor={filtros.cliente}
        onEscolher={(valor) => mudar("cliente", valor)}
        opcoes={[
          { valor: "todos", texto: "Todos" },
          ...opcoes.clientes.map((cliente) => ({
            valor: cliente,
            texto: cliente.replace(/^Cliente /, ""), // "Cliente A" vira "A"
            dica: cliente,
          })),
        ]}
      />

      <Segmentador
        rotulo="Pessoa"
        valor={filtros.pessoa}
        onEscolher={(valor) => mudar("pessoa", valor)}
        opcoes={[
          { valor: "todas", texto: "Todas" },
          ...opcoes.pessoas.map((pessoa) => ({ valor: pessoa, texto: pessoa })),
        ]}
      />

      <Segmentador
        rotulo="Tipo"
        valor={filtros.tipo}
        onEscolher={(valor) => mudar("tipo", valor)}
        opcoes={[
          { valor: "todos", texto: "Todos" },
          { valor: "delegavel", texto: "Delegável" },
          { valor: "nao-delegavel", texto: "Não delegável" },
        ]}
      />

      {algumFiltroAtivo && (
        <button
          type="button"
          className={styles.limpar}
          onClick={onLimpar}
          title="Limpar filtros"
        >
          Limpar
        </button>
      )}
    </div>
  );
}

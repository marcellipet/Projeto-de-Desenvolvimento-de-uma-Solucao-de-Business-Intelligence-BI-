import { nomeDoMes } from "@/lib/datas";
import styles from "./Filtros.module.css";

// Não guarda estado: recebe os filtros do Painel e avisa quando algo muda
export default function Filtros({ filtros, opcoes, onMudar, onLimpar }) {
  function mudar(campo, valor) {
    onMudar({ ...filtros, [campo]: valor });
  }

  return (
    <div className={styles.filtros}>
      <label className={styles.campo}>
        Mês
        <select
          value={filtros.mes}
          onChange={(e) => mudar("mes", e.target.value)}
        >
          <option value="todos">Todos</option>
          {opcoes.meses.map((mes) => (
            <option key={mes} value={mes}>
              {nomeDoMes(mes)}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        Cliente
        <select
          value={filtros.cliente}
          onChange={(e) => mudar("cliente", e.target.value)}
        >
          <option value="todos">Todos</option>
          {opcoes.clientes.map((cliente) => (
            <option key={cliente} value={cliente}>
              {cliente}
            </option>
          ))}
        </select>
      </label>

      <label className={styles.campo}>
        Pessoa
        <select
          value={filtros.pessoa}
          onChange={(e) => mudar("pessoa", e.target.value)}
        >
          <option value="todas">Todas</option>
          {opcoes.pessoas.map((pessoa) => (
            <option key={pessoa} value={pessoa}>
              {pessoa}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className={styles.limpar} onClick={onLimpar}>
        Limpar filtros
      </button>
    </div>
  );
}

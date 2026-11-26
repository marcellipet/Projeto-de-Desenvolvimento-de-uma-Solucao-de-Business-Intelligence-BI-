import { horas, porcentagem } from "@/lib/formatar";
import styles from "./TabelaClientes.module.css";

// Uma linha por cliente: horas, participação, parte delegável e a atividade
// em que ele mais consome tempo.
// clientes: saída de resumoPorCliente() (lib/calculos.js)
export default function TabelaClientes({ clientes, total }) {
  if (!clientes.length) {
    return <p className={styles.vazio}>Nenhum registro com esses filtros.</p>;
  }

  return (
    <table className={styles.tabela}>
      <thead>
        <tr>
          <th scope="col">Cliente</th>
          <th scope="col" className={styles.numero}>Horas</th>
          <th scope="col" className={styles.numero}>% do total</th>
          <th scope="col" className={styles.numero}>Delegável</th>
          <th scope="col">Atividade principal</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((c) => (
          <tr key={c.nome}>
            <td>{c.nome}</td>
            <td className={styles.numero}>{horas(c.horas)}</td>
            <td className={styles.numero}>{porcentagem(c.horas, total)}</td>
            <td className={styles.numero}>{porcentagem(c.delegavel, c.horas)}</td>
            <td>
              {c.principal}{" "}
              <span className={styles.fraco}>({porcentagem(c.horasPrincipal, c.horas)})</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

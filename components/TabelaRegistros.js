import { useState } from "react";
import { dataCurta, diaDaSemana } from "@/lib/datas";
import { horasExatas } from "@/lib/formatar";
import styles from "./TabelaRegistros.module.css";

const POR_VEZ = 10;

// Lista dos apontamentos filtrados, do mais recente para o mais antigo
export default function TabelaRegistros({ registros }) {
  const [quantos, setQuantos] = useState(POR_VEZ);

  if (!registros.length) {
    return <p className={styles.vazio}>Nenhum registro com esses filtros.</p>;
  }

  const ordenados = [...registros].sort(
    (a, b) => b.data.localeCompare(a.data) || b.id - a.id
  );
  const mostrados = ordenados.slice(0, quantos);

  return (
    <div className={styles.conteudo}>
      <div className={styles.rolagem}>
        <table className={styles.tabela}>
          <thead>
            <tr>
              <th scope="col">Data</th>
              <th scope="col">Pessoa</th>
              <th scope="col">Cliente</th>
              <th scope="col">Atividade</th>
              <th scope="col">Descrição</th>
              <th scope="col" className={styles.numero}>
                Horas
              </th>
              <th scope="col">Delegável</th>
            </tr>
          </thead>
          <tbody>
            {mostrados.map((r) => (
              <tr key={r.id}>
                <td className={styles.data}>
                  {diaDaSemana(r.data)} {dataCurta(r.data)}
                </td>
                <td>{r.colaborador}</td>
                <td>{r.cliente}</td>
                <td>{r.atividade}</td>
                <td>{r.descricao}</td>
                <td className={styles.numero}>{horasExatas(r.horas)}</td>
                <td>
                  {r.delegavel ? (
                    <span className={styles.delegavel}>Sim</span>
                  ) : (
                    <span className={styles.fraco}>Não</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.rodape}>
        <span>
          Mostrando {mostrados.length} de {ordenados.length} registros
        </span>
        {mostrados.length < ordenados.length && (
          <button
            type="button"
            className={styles.botao}
            onClick={() => setQuantos(quantos + POR_VEZ)}
          >
            Mostrar mais {POR_VEZ}
          </button>
        )}
      </div>
    </div>
  );
}

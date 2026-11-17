import { horasPorCombinacao, valoresUnicos } from "@/lib/calculos";
import { horasExatas } from "@/lib/formatar";
import styles from "./MapaDeCalor.module.css";

// Tabela cliente × atividade. A cor da célula mistura a cor da série com o
// fundo (color-mix) na proporção das horas: quanto mais horas, mais forte.
// atividades: [{ nome, curto }] na ordem das colunas
export default function MapaDeCalor({ registros, atividades }) {
  if (!registros.length) {
    return <p className={styles.vazio}>Nenhum registro com esses filtros.</p>;
  }

  const valores = horasPorCombinacao(registros);
  const valorDe = (cliente, atividade) => valores[`${cliente}|${atividade}`] || 0;
  const clientes = valoresUnicos(registros, "cliente");
  const maior = Math.max(...Object.values(valores));

  return (
    <div className={styles.conteudo}>
      <div className={styles.rolagem}>
        <table className={styles.mapa}>
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              {atividades.map((a) => (
                <th key={a.nome} scope="col" title={a.nome}>
                  {a.curto}
                </th>
              ))}
              <th scope="col">Total</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => {
              const totalDoCliente = atividades.reduce(
                (total, a) => total + valorDe(cliente, a.nome),
                0
              );

              return (
                <tr key={cliente}>
                  <th scope="row">{cliente}</th>
                  {atividades.map((a) => {
                    const valor = valorDe(cliente, a.nome);
                    if (!valor) {
                      return (
                        <td key={a.nome} className={styles.zero}>
                          ·
                        </td>
                      );
                    }

                    const forca = Math.round(8 + (valor / maior) * 80); // de 8% a 88%
                    return (
                      <td
                        key={a.nome}
                        title={`${cliente} · ${a.nome}: ${horasExatas(valor)}`}
                        style={{
                          background: `color-mix(in oklab, var(--serie-1) ${forca}%, var(--superficie))`,
                          color: forca > 55 ? "#ffffff" : "var(--texto)",
                        }}
                      >
                        {Math.round(valor)}
                      </td>
                    );
                  })}
                  <td className={styles.total}>{Math.round(totalDoCliente)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={styles.escala}>
        <span>menos horas</span>
        <span className={styles.gradiente} aria-hidden="true" />
        <span>mais horas</span>
      </p>
    </div>
  );
}

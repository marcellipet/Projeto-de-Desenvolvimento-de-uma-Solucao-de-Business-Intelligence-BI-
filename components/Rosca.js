import { horas, porcentagem } from "@/lib/formatar";
import styles from "./Rosca.module.css";

// Gráfico de rosca em CSS puro: um conic-gradient (as fatias) com um furo no meio.
// partes: [{ rotulo, valor, cor: "serie-1" | "serie-2" }]
// centro: texto grande no meio da rosca
export default function Rosca({ partes, centro, legendaDoCentro }) {
  const total = partes.reduce((soma, p) => soma + p.valor, 0);

  if (!total) {
    return <p className={styles.vazio}>Nenhum registro com esses filtros.</p>;
  }

  // Cada fatia começa onde a anterior terminou:
  // "var(--serie-1) 0% 63%, var(--serie-2) 63% 100%"
  const fatias = partes.reduce((lista, p) => {
    const inicio = lista.length ? lista[lista.length - 1].fim : 0;
    return [...lista, { ...p, inicio, fim: inicio + (p.valor / total) * 100 }];
  }, []);
  const gradiente = fatias
    .map((f) => `var(--${f.cor}) ${f.inicio}% ${f.fim}%`)
    .join(", ");

  return (
    <div className={styles.rosca}>
      <div
        className={styles.disco}
        style={{ background: `conic-gradient(${gradiente})` }}
        role="img"
        aria-label={partes
          .map((p) => `${p.rotulo}: ${porcentagem(p.valor, total)}`)
          .join(", ")}
      >
        <div className={styles.furo}>
          <strong className={styles.centro}>{centro}</strong>
          <span className={styles.legendaDoCentro}>{legendaDoCentro}</span>
        </div>
      </div>

      <ul className={styles.legenda}>
        {partes.map((p) => (
          <li key={p.rotulo}>
            <span
              className={styles.amostra}
              style={{ background: `var(--${p.cor})` }}
              aria-hidden="true"
            />
            <span>
              {p.rotulo}
              <span className={styles.fraco}>
                {" "}
                · {horas(p.valor)} ({porcentagem(p.valor, total)})
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

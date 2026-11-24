import { horas, porcentagem } from "@/lib/formatar";
import styles from "./BarrasHorizontais.module.css";

// Gráfico de barras sem biblioteca: cada barra é uma <div> com width em %.
// itens: [{ nome, horas, delegavel }] já ordenados do maior para o menor.
// Com dividirDelegavel, a barra mostra a parte delegável em outra cor.
export default function BarrasHorizontais({ itens, total, dividirDelegavel = false }) {
  if (!itens.length) {
    return <p className={styles.vazio}>Nenhum registro com esses filtros.</p>;
  }

  const maior = itens[0].horas || 1;

  return (
    <ul className={styles.lista}>
      {itens.map((item) => {
        const naoDelegavel = item.horas - item.delegavel;
        const dica = dividirDelegavel
          ? `${item.nome}: ${horas(item.horas)}, sendo ${horas(item.delegavel)} delegáveis`
          : `${item.nome}: ${horas(item.horas)}, ${porcentagem(item.horas, total)} do total`;

        return (
          <li key={item.nome} className={styles.linha} title={dica}>
            <span className={styles.nome}>{item.nome}</span>

            <div className={styles.trilho} aria-hidden="true">
              <div
                className={styles.barra}
                style={{ width: `${(item.horas / maior) * 100}%` }}
              >
                {dividirDelegavel ? (
                  <>
                    {naoDelegavel > 0 && (
                      <span
                        className={`${styles.parte} ${styles.serie1}`}
                        style={{ flexGrow: naoDelegavel }}
                      />
                    )}
                    {item.delegavel > 0 && (
                      <span
                        className={`${styles.parte} ${styles.serie2}`}
                        style={{ flexGrow: item.delegavel }}
                      />
                    )}
                  </>
                ) : (
                  <span className={`${styles.parte} ${styles.serie1}`} />
                )}
              </div>
            </div>

            <span className={styles.valor}>
              {horas(item.horas)}
              <span className={styles.secundario}>
                {dividirDelegavel
                  ? `${porcentagem(item.delegavel, item.horas)} deleg.`
                  : porcentagem(item.horas, total)}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

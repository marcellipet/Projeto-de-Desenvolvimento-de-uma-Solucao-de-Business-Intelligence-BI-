import { horas, porcentagem } from "@/lib/formatar";
import styles from "./BarrasHorizontais.module.css";

// Gráfico de barras sem biblioteca: cada barra é uma <div> com width em %.
// itens: [{ nome, horas, delegavel }] já ordenados do maior para o menor.
//
// Opções:
// - dividirDelegavel: a barra mostra a parte delegável em outra cor
// - cor: cor da barra quando não divide (nome de variável, ex.: "serie-2")
// - detalhe: função que devolve o texto pequeno ao lado das horas
export default function BarrasHorizontais({
  itens,
  total,
  dividirDelegavel = false,
  cor = "serie-1",
  detalhe,
}) {
  if (!itens.length) {
    return <p className={styles.vazio}>Nenhum registro com esses filtros.</p>;
  }

  const maior = itens[0].horas || 1;

  function textoDetalhe(item) {
    if (detalhe) return detalhe(item);
    if (dividirDelegavel) return `${porcentagem(item.delegavel, item.horas)} deleg.`;
    return porcentagem(item.horas, total);
  }

  return (
    <ul className={styles.lista}>
      {itens.map((item, posicao) => {
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
                style={{
                  width: `${(item.horas / maior) * 100}%`,
                  animationDelay: `${posicao * 40}ms`, // uma barra depois da outra
                }}
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
                  <span
                    className={styles.parte}
                    style={{ background: `var(--${cor})` }}
                  />
                )}
              </div>
            </div>

            <span className={styles.valor}>
              {horas(item.horas)}
              <span className={styles.secundario}>{textoDetalhe(item)}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

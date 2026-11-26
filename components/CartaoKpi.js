import styles from "./CartaoKpi.module.css";

// Cartão de indicador: rótulo, número grande e uma linha de detalhe.
// cor (opcional): nome de uma variável do globals.css, ex.: "serie-2", "critico".
// O que vier entre <CartaoKpi> e </CartaoKpi> (children) aparece abaixo do número.
export default function CartaoKpi({ rotulo, valor, detalhe, cor, children }) {
  return (
    <article className={styles.cartao}>
      <p className={styles.rotulo}>{rotulo}</p>
      <p
        className={styles.valor}
        style={cor ? { color: `var(--${cor})` } : undefined}
      >
        {valor}
      </p>
      {children}
      {detalhe && <p className={styles.detalhe}>{detalhe}</p>}
    </article>
  );
}

import styles from "./CartaoKpi.module.css";

// Cartão de indicador: rótulo, número grande e uma linha de detalhe.
// O que vier entre <CartaoKpi> e </CartaoKpi> (children) aparece abaixo do número.
export default function CartaoKpi({ rotulo, valor, detalhe, children }) {
  return (
    <article className={styles.cartao}>
      <p className={styles.rotulo}>{rotulo}</p>
      <p className={styles.valor}>{valor}</p>
      {children}
      {detalhe && <p className={styles.detalhe}>{detalhe}</p>}
    </article>
  );
}

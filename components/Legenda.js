import styles from "./Legenda.module.css";

// itens: [{ rotulo: "Delegável", tipo: "serie2" }]
// tipo: "serie1" | "serie2" (quadradinho colorido) ou "linha" (tracejado)
export default function Legenda({ itens }) {
  return (
    <ul className={styles.legenda}>
      {itens.map((item) => (
        <li key={item.rotulo} className={styles.item}>
          <span
            className={`${styles.amostra} ${styles[item.tipo]}`}
            aria-hidden="true"
          />
          {item.rotulo}
        </li>
      ))}
    </ul>
  );
}

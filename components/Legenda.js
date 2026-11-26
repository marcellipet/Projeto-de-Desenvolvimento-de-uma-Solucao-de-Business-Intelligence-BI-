import styles from "./Legenda.module.css";

// Itens usados em vários visuais
export const LEGENDA_DELEGAVEL = [
  { rotulo: "Não delegável", tipo: "serie1" },
  { rotulo: "Delegável", tipo: "serie2" },
];

// itens: [{ rotulo: "Delegável", tipo: "serie2" }]
// tipo: "serie1" | "serie2" (quadradinho colorido), "linha" (tracejado)
// ou "marca" (traço vertical)
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

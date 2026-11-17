import styles from "./Bloco.module.css";

// Moldura de cada visual: título, a pergunta que ele responde e,
// se houver, a legenda no canto direito.
export default function Bloco({ titulo, pergunta, legenda, children }) {
  return (
    <section className={styles.bloco}>
      <header className={styles.cabecalho}>
        <div>
          <h2 className={styles.titulo}>{titulo}</h2>
          {pergunta && <p className={styles.pergunta}>{pergunta}</p>}
        </div>
        {legenda}
      </header>
      {children}
    </section>
  );
}

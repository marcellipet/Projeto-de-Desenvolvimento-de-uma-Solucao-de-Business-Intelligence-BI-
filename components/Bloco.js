import styles from "./Bloco.module.css";

// Cartão de cada visual: título, subtítulo (a pergunta que ele responde)
// e, se houver, a legenda no canto direito.
export default function Bloco({ titulo, subtitulo, legenda, children }) {
  return (
    <section className={styles.bloco}>
      <header className={styles.cabecalho}>
        <div>
          <h2 className={styles.titulo}>{titulo}</h2>
          {subtitulo && <p className={styles.subtitulo}>{subtitulo}</p>}
        </div>
        {legenda}
      </header>
      <div className={styles.corpo}>{children}</div>
    </section>
  );
}

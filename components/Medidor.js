import styles from "./Medidor.module.css";

// Barra de 0 a 100%. Acima de 100% ela fica cheia e o número do cartão
// mostra o excesso. status = { tipo: "bom" | "alerta" | "critico", texto }
export default function Medidor({ valor, status }) {
  const porcento = Math.round(valor * 100);
  const largura = Math.min(100, porcento);
  const tipo = status ? status.tipo : "neutro";

  return (
    <div className={styles.medidor}>
      <div
        className={styles.trilho}
        role="meter"
        aria-label="Ocupação da capacidade"
        aria-valuemin={0}
        aria-valuemax={Math.max(100, porcento)}
        aria-valuenow={porcento}
      >
        <div
          className={`${styles.preenchido} ${styles[tipo]}`}
          style={{ width: `${largura}%` }}
        />
      </div>
      {status && (
        <p className={`${styles.status} ${styles[tipo]}`}>{status.texto}</p>
      )}
    </div>
  );
}

import styles from "./Medidor.module.css";

// Barra fina de 0 a 100% com uma linha de texto embaixo.
// Acima de 100% ela fica cheia e o número do cartão mostra o excesso.
// tipo: "bom" | "alerta" | "critico" (aparece uma bolinha de status) ou "destaque"
export default function Medidor({ valor, tipo = "destaque", texto }) {
  const porcento = Math.round(valor * 100);
  const largura = Math.min(100, porcento);
  const temStatus = tipo !== "destaque";

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
          className={styles.preenchido}
          style={{ width: `${largura}%`, background: `var(--${tipo})` }}
        />
      </div>
      <p className={styles.texto}>
        {temStatus && (
          <span
            className={styles.ponto}
            style={{ background: `var(--${tipo})` }}
            aria-hidden="true"
          />
        )}
        {texto}
      </p>
    </div>
  );
}

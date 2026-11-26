import { HORAS_POR_DIA } from "@/lib/config";
import { horas, porcentagem } from "@/lib/formatar";
import Legenda, { LEGENDA_DELEGAVEL } from "./Legenda";
import styles from "./UsoDaCapacidade.module.css";

// Faixa da Visão Geral: quanto da capacidade do período já foi usada.
// A barra mostra as horas (não delegáveis + delegáveis) e o traço marca a capacidade.
export default function UsoDaCapacidade({ naoDelegavel, delegavel, capacidade, pessoas }) {
  const total = naoDelegavel + delegavel;
  const escala = Math.max(total, capacidade) || 1; // a barra comporta o maior dos dois
  const posicao = (valor) => `${(valor / escala) * 100}%`;
  const diferenca =
    total > capacidade
      ? `${horas(total - capacidade)} acima da capacidade`
      : `${horas(capacidade - total)} livres na capacidade`;

  return (
    <section className={styles.faixa}>
      <div className={styles.topo}>
        <h2 className={styles.titulo}>
          Uso da capacidade: {horas(total)} de {horas(capacidade)} (
          {porcentagem(total, capacidade)})
        </h2>
        <Legenda
          itens={[
            ...LEGENDA_DELEGAVEL,
            {
              rotulo: `Capacidade (${HORAS_POR_DIA} h por dia útil × ${pessoas} ${pessoas === 1 ? "pessoa" : "pessoas"})`,
              tipo: "marca",
            },
          ]}
        />
      </div>

      <div className={styles.trilho}>
        <div className={styles.barra}>
          {naoDelegavel > 0 && (
            <span
              className={styles.naoDelegavel}
              style={{ width: posicao(naoDelegavel) }}
              title={`Não delegável: ${horas(naoDelegavel)}`}
            />
          )}
          {delegavel > 0 && (
            <span
              className={styles.delegavel}
              style={{ width: posicao(delegavel) }}
              title={`Delegável: ${horas(delegavel)}`}
            />
          )}
        </div>
        <span
          className={styles.marca}
          style={{ left: posicao(capacidade) }}
          title={`Capacidade: ${horas(capacidade)}`}
        />
      </div>

      <p className={styles.nota}>{diferenca}</p>
    </section>
  );
}

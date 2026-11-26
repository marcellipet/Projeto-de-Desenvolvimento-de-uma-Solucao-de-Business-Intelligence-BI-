import { HORAS_POR_DIA } from "@/lib/config";
import { horas, numero, porcentagem } from "@/lib/formatar";
import CartaoKpi from "../CartaoKpi";
import Bloco from "../Bloco";
import Legenda, { LEGENDA_DELEGAVEL } from "../Legenda";
import GraficoSemanal from "../GraficoSemanal";
import BarrasHorizontais from "../BarrasHorizontais";
import styles from "./Pagina.module.css";

// Página 3: como a carga se comporta semana a semana e por pessoa.
export default function Tendencia({ resumo }) {
  const { semanas } = resumo;
  const totalDa = (s) => s.delegavel + s.naoDelegavel;
  const ocupacaoDa = (s) => (s.capacidade ? totalDa(s) / s.capacidade : 0);
  const acimaDaCapacidade = semanas.filter((s) => totalDa(s) > s.capacidade).length;
  const maisCheia = semanas.length
    ? semanas.reduce((pico, s) => (ocupacaoDa(s) > ocupacaoDa(pico) ? s : pico))
    : null;

  // Capacidade de uma pessoa no período (cada barra da direita é uma pessoa)
  const capacidadePorPessoa = resumo.diasUteis.length * HORAS_POR_DIA;
  const mediaPorPessoaDia =
    resumo.diasUteis.length && resumo.pessoas
      ? resumo.total / resumo.diasUteis.length / resumo.pessoas
      : 0;

  return (
    <section className={styles.pagina}>
      <div className={styles.kpis}>
        <CartaoKpi
          rotulo="Média semanal"
          valor={horas(resumo.semanasUteis ? resumo.total / resumo.semanasUteis : 0)}
          detalhe={`em ${numero(resumo.semanasUteis)} semanas de 5 dias úteis`}
        />
        <CartaoKpi
          rotulo="Semana mais cheia"
          valor={maisCheia ? porcentagem(totalDa(maisCheia), maisCheia.capacidade) : "—"}
          cor={maisCheia && totalDa(maisCheia) > maisCheia.capacidade ? "critico" : undefined}
          detalhe={
            maisCheia
              ? `da capacidade na semana de ${maisCheia.rotulo} (${horas(totalDa(maisCheia))})`
              : "sem semanas no filtro"
          }
        />
        <CartaoKpi
          rotulo="Semanas acima da capacidade"
          valor={`${acimaDaCapacidade} de ${semanas.length}`}
          cor={acimaDaCapacidade > 0 ? "critico" : "bom"}
          detalhe="semanas que passaram de 100%"
        />
        <CartaoKpi
          rotulo="Média por pessoa por dia"
          valor={`${numero(mediaPorPessoaDia)} h`}
          detalhe={`capacidade: ${HORAS_POR_DIA} h por dia útil`}
        />
      </div>

      <div className={`${styles.duas} ${styles.duasInvertida}`}>
        <Bloco
          titulo="Horas por semana e capacidade"
          subtitulo="A carga cabe na capacidade dos sócios?"
          legenda={
            <Legenda
              itens={[
                ...LEGENDA_DELEGAVEL,
                { rotulo: `Capacidade (${HORAS_POR_DIA} h por dia útil)`, tipo: "linha" },
              ]}
            />
          }
        >
          <GraficoSemanal semanas={semanas} />
        </Bloco>
        <Bloco
          titulo="Horas por pessoa"
          subtitulo={`Cada pessoa tem ${horas(capacidadePorPessoa)} de capacidade no período`}
          legenda={<Legenda itens={LEGENDA_DELEGAVEL} />}
        >
          <BarrasHorizontais
            itens={resumo.porPessoa}
            total={resumo.total}
            dividirDelegavel
            detalhe={(pessoa) => `${porcentagem(pessoa.horas, capacidadePorPessoa)} da capac.`}
          />
        </Bloco>
      </div>
    </section>
  );
}

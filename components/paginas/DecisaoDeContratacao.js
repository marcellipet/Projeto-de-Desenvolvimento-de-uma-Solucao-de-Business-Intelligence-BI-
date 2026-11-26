import { HORAS_POR_DIA } from "@/lib/config";
import { horas, numero, porcentagem } from "@/lib/formatar";
import CartaoKpi from "../CartaoKpi";
import Bloco from "../Bloco";
import BarrasHorizontais from "../BarrasHorizontais";
import Rosca from "../Rosca";
import styles from "./Pagina.module.css";

// Página 4: os números que apoiam a decisão de contratar ou delegar.
export default function DecisaoDeContratacao({ resumo }) {
  const horasPorSemanaCheia = HORAS_POR_DIA * 5; // uma pessoa em tempo integral
  const liberavelPorSemana = resumo.semanasUteis
    ? resumo.delegavel / resumo.semanasUteis
    : 0;
  const pessoasEquivalentes = liberavelPorSemana / horasPorSemanaCheia;

  // Só a parte delegável de cada atividade, da maior para a menor
  const delegavelPorAtividade = resumo.porAtividade
    .filter((a) => a.delegavel > 0)
    .map((a) => ({ nome: a.nome, horas: a.delegavel, delegavel: a.delegavel, totalDaAtividade: a.horas }))
    .sort((a, b) => b.horas - a.horas);

  return (
    <section className={styles.pagina}>
      <div className={styles.kpis}>
        <CartaoKpi
          rotulo="Tempo delegável"
          valor={horas(resumo.delegavel)}
          cor="serie-2"
          detalhe={`${porcentagem(resumo.delegavel, resumo.total)} do tempo registrado`}
        />
        <CartaoKpi
          rotulo="Liberável por semana"
          valor={`${numero(liberavelPorSemana)} h`}
          cor="serie-2"
          detalhe={`média em ${numero(resumo.semanasUteis)} semanas de 5 dias úteis`}
        />
        <CartaoKpi
          rotulo="Equivale a"
          valor={`${numero(pessoasEquivalentes)} ${pessoasEquivalentes >= 2 ? "pessoas" : "pessoa"}`}
          detalhe={`em tempo integral (${horasPorSemanaCheia} h por semana)`}
        />
        <CartaoKpi
          rotulo="Tempo em prospecção"
          valor={horas(resumo.prospeccao)}
          cor="destaque"
          detalhe={`${porcentagem(resumo.prospeccao, resumo.total)} do tempo registrado`}
        />
      </div>

      <div className={`${styles.duas} ${styles.duasInvertida}`}>
        <Bloco
          titulo="Horas delegáveis por atividade"
          subtitulo="O que poderia ir primeiro para outra pessoa"
        >
          <BarrasHorizontais
            itens={delegavelPorAtividade}
            total={resumo.delegavel}
            cor="serie-2"
            detalhe={(a) => `${porcentagem(a.horas, a.totalDaAtividade)} da atividade`}
          />
        </Bloco>
        <Bloco
          titulo="Delegável × não delegável"
          subtitulo="Parte do tempo que poderia ser repassada"
        >
          <Rosca
            centro={porcentagem(resumo.delegavel, resumo.total)}
            legendaDoCentro="delegável"
            partes={[
              { rotulo: "Não delegável", valor: resumo.naoDelegavel, cor: "serie-1" },
              { rotulo: "Delegável", valor: resumo.delegavel, cor: "serie-2" },
            ]}
          />
        </Bloco>
      </div>
    </section>
  );
}

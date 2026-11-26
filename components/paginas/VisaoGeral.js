import { statusDaOcupacao } from "@/lib/calculos";
import { CLIENTE_INTERNO } from "@/lib/config";
import { horas, porcentagem } from "@/lib/formatar";
import CartaoKpi from "../CartaoKpi";
import Medidor from "../Medidor";
import Bloco from "../Bloco";
import Legenda, { LEGENDA_DELEGAVEL } from "../Legenda";
import BarrasHorizontais from "../BarrasHorizontais";
import UsoDaCapacidade from "../UsoDaCapacidade";
import styles from "./Pagina.module.css";

// Página 1: o resumo. Quanto foi trabalhado, quanto da capacidade isso ocupa,
// o que é delegável e quanto vai para prospecção.
export default function VisaoGeral({ resumo, filtros }) {
  const todosOsClientes = filtros.cliente === "todos";
  const status = statusDaOcupacao(resumo.ocupacao);
  const prospeccaoNoFiltro = todosOsClientes || filtros.cliente === CLIENTE_INTERNO;

  return (
    <section className={`${styles.pagina} ${styles.comFaixa}`}>
      <div className={styles.kpis}>
        <CartaoKpi
          rotulo="Horas registradas"
          valor={horas(resumo.total)}
          detalhe={`${resumo.diasUteis.length} dias úteis · ${resumo.pessoas} ${
            resumo.pessoas === 1 ? "pessoa" : "pessoas"
          }`}
        />
        <CartaoKpi
          rotulo={todosOsClientes ? "Ocupação da capacidade" : "Parcela da capacidade"}
          valor={porcentagem(resumo.total, resumo.capacidade)}
          cor={todosOsClientes ? status.tipo : undefined}
        >
          <Medidor
            valor={resumo.ocupacao}
            tipo={todosOsClientes ? status.tipo : "destaque"}
            texto={
              todosOsClientes
                ? `${status.texto} · capacidade de ${horas(resumo.capacidade)}`
                : `usada por ${filtros.cliente} · capacidade de ${horas(resumo.capacidade)}`
            }
          />
        </CartaoKpi>
        <CartaoKpi
          rotulo="Horas delegáveis"
          valor={horas(resumo.delegavel)}
          cor="serie-2"
          detalhe={`${porcentagem(resumo.delegavel, resumo.total)} do tempo poderia ir para outra pessoa`}
        />
        <CartaoKpi
          rotulo="Tempo em prospecção"
          valor={horas(resumo.prospeccao)}
          cor="destaque"
          detalhe={
            prospeccaoNoFiltro
              ? `${porcentagem(resumo.prospeccao, resumo.total)} do tempo registrado`
              : `Prospecção é lançada no cliente "${CLIENTE_INTERNO}"`
          }
        />
      </div>

      <div className={styles.duas}>
        <Bloco titulo="Tempo por cliente" subtitulo="Qual cliente consome mais tempo?">
          <BarrasHorizontais itens={resumo.porCliente} total={resumo.total} />
        </Bloco>
        <Bloco
          titulo="Tempo por atividade"
          subtitulo="O que mais ocupa a rotina e o que dá para delegar?"
          legenda={<Legenda itens={LEGENDA_DELEGAVEL} />}
        >
          <BarrasHorizontais
            itens={resumo.porAtividade}
            total={resumo.total}
            dividirDelegavel
          />
        </Bloco>
      </div>

      <UsoDaCapacidade
        naoDelegavel={resumo.naoDelegavel}
        delegavel={resumo.delegavel}
        capacidade={resumo.capacidade}
        pessoas={resumo.pessoas}
      />
    </section>
  );
}

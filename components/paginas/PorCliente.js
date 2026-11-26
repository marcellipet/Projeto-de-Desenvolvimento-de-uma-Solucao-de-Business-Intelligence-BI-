import { resumoPorCliente } from "@/lib/calculos";
import { CLIENTE_INTERNO } from "@/lib/config";
import { horas, porcentagem } from "@/lib/formatar";
import CartaoKpi from "../CartaoKpi";
import Bloco from "../Bloco";
import MapaDeCalor from "../MapaDeCalor";
import TabelaClientes from "../TabelaClientes";
import styles from "./Pagina.module.css";

// Página 2: como o tempo se divide entre os clientes e em que tipo de trabalho.
export default function PorCliente({ resumo, atividades }) {
  const externos = resumo.porCliente.filter((c) => c.nome !== CLIENTE_INTERNO);
  const maior = externos[0];
  const doisMaiores = externos.slice(0, 2);
  const horasDosDoisMaiores = doisMaiores.reduce((soma, c) => soma + c.horas, 0);

  return (
    <section className={styles.pagina}>
      <div className={styles.kpis}>
        <CartaoKpi
          rotulo="Cliente com mais horas"
          valor={maior ? maior.nome : "—"}
          cor="serie-1"
          detalhe={
            maior
              ? `${horas(maior.horas)} · ${porcentagem(maior.horas, resumo.total)} das horas`
              : "nenhum cliente externo no filtro"
          }
        />
        <CartaoKpi
          rotulo="Clientes atendidos"
          valor={String(externos.length)}
          detalhe={resumo.interno > 0 ? "além do trabalho interno" : "no período filtrado"}
        />
        <CartaoKpi
          rotulo="Concentração nos 2 maiores"
          valor={porcentagem(horasDosDoisMaiores, resumo.total)}
          detalhe={doisMaiores.length ? doisMaiores.map((c) => c.nome).join(" + ") : "—"}
        />
        <CartaoKpi
          rotulo="Trabalho interno"
          valor={horas(resumo.interno)}
          detalhe={`${porcentagem(resumo.interno, resumo.total)} · administrativo e prospecção`}
        />
      </div>

      <div className={`${styles.duas} ${styles.duasInvertida}`}>
        <Bloco
          titulo="Cliente × atividade (horas)"
          subtitulo="Em que tipo de trabalho vai o tempo de cada cliente?"
        >
          <MapaDeCalor registros={resumo.visiveis} atividades={atividades} />
        </Bloco>
        <Bloco titulo="Resumo por cliente" subtitulo="Horas, parte delegável e atividade principal">
          <TabelaClientes clientes={resumoPorCliente(resumo.visiveis)} total={resumo.total} />
        </Bloco>
      </div>
    </section>
  );
}

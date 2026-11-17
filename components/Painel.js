"use client"; // tem estado (os filtros), então roda no navegador

import { useMemo, useState } from "react";
import {
  atividadesPresentes,
  capacidadeEmHoras,
  diasUteisDoPeriodo,
  filtrar,
  horasPorSemana,
  mesesDisponiveis,
  somarHoras,
  somarPor,
  statusDaOcupacao,
  valoresUnicos,
} from "@/lib/calculos";
import {
  ATIVIDADE_PROSPECCAO,
  CLIENTE_INTERNO,
  HORAS_POR_DIA,
  USANDO_DADOS_FICTICIOS,
} from "@/lib/config";
import { horas, porcentagem } from "@/lib/formatar";
import Filtros from "./Filtros";
import CartaoKpi from "./CartaoKpi";
import Medidor from "./Medidor";
import Bloco from "./Bloco";
import Legenda from "./Legenda";
import GraficoSemanal from "./GraficoSemanal";
import BarrasHorizontais from "./BarrasHorizontais";
import MapaDeCalor from "./MapaDeCalor";
import TabelaRegistros from "./TabelaRegistros";
import styles from "./Painel.module.css";

const FILTROS_INICIAIS = { mes: "todos", cliente: "todos", pessoa: "todas" };

const LEGENDA_DELEGAVEL = [
  { rotulo: "Não delegável", tipo: "serie1" },
  { rotulo: "Delegável", tipo: "serie2" },
];

export default function Painel({ registros }) {
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);

  // Opções dos filtros e colunas do mapa saem dos próprios dados
  const opcoes = useMemo(
    () => ({
      meses: mesesDisponiveis(registros),
      clientes: valoresUnicos(registros, "cliente"),
      pessoas: valoresUnicos(registros, "colaborador"),
      atividades: atividadesPresentes(registros),
    }),
    [registros]
  );

  // useMemo: só recalcula quando os filtros (ou os dados) mudam
  const visiveis = useMemo(
    () => filtrar(registros, filtros),
    [registros, filtros]
  );
  const diasUteis = useMemo(
    () => diasUteisDoPeriodo(registros, filtros.mes),
    [registros, filtros.mes]
  );

  const pessoas = filtros.pessoa === "todas" ? opcoes.pessoas.length : 1;
  const semanas = useMemo(
    () => horasPorSemana(visiveis, diasUteis, pessoas),
    [visiveis, diasUteis, pessoas]
  );

  // Indicadores
  const capacidade = capacidadeEmHoras(diasUteis, pessoas);
  const total = somarHoras(visiveis);
  const delegaveis = somarHoras(visiveis.filter((r) => r.delegavel));
  const prospeccao = somarHoras(
    visiveis.filter((r) => r.atividade === ATIVIDADE_PROSPECCAO)
  );
  const ocupacao = capacidade ? total / capacidade : 0;
  const todosOsClientes = filtros.cliente === "todos";
  const prospeccaoNoFiltro =
    todosOsClientes || filtros.cliente === CLIENTE_INTERNO;

  const porCliente = somarPor(visiveis, "cliente");
  const porAtividade = somarPor(visiveis, "atividade");

  return (
    <main className={styles.painel}>
      <header className={styles.topo}>
        <div>
          <p className={styles.marca}>KX Soluções</p>
          <h1 className={styles.titulo}>Capacidade e Atendimento</h1>
        </div>
        {USANDO_DADOS_FICTICIOS && (
          <span className={styles.aviso}>Dados fictícios</span>
        )}
      </header>

      <Filtros
        filtros={filtros}
        opcoes={opcoes}
        onMudar={setFiltros}
        onLimpar={() => setFiltros(FILTROS_INICIAIS)}
      />

      <section className={styles.kpis} aria-label="Indicadores">
        <CartaoKpi
          rotulo="Horas registradas"
          valor={horas(total)}
          detalhe={`${diasUteis.length} dias úteis · ${pessoas} ${
            pessoas === 1 ? "pessoa" : "pessoas"
          }`}
        />
        <CartaoKpi
          rotulo={
            todosOsClientes ? "Ocupação da capacidade" : "Parcela da capacidade"
          }
          valor={porcentagem(total, capacidade)}
          detalhe={`Capacidade: ${horas(capacidade)} (${HORAS_POR_DIA} h por dia útil)`}
        >
          <Medidor
            valor={ocupacao}
            status={todosOsClientes ? statusDaOcupacao(ocupacao) : null}
          />
        </CartaoKpi>
        <CartaoKpi
          rotulo="Horas delegáveis"
          valor={horas(delegaveis)}
          detalhe={`${porcentagem(delegaveis, total)} do tempo poderia ir para outra pessoa`}
        />
        <CartaoKpi
          rotulo="Tempo em prospecção"
          valor={horas(prospeccao)}
          detalhe={
            prospeccaoNoFiltro
              ? `${porcentagem(prospeccao, total)} do tempo registrado`
              : `Prospecção é lançada no cliente "${CLIENTE_INTERNO}"`
          }
        />
      </section>

      <Bloco
        titulo="Horas por semana e capacidade"
        pergunta="A carga cabe na capacidade dos sócios?"
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

      <div className={styles.duas}>
        <Bloco
          titulo="Tempo por cliente"
          pergunta="Qual cliente consome mais tempo?"
        >
          <BarrasHorizontais itens={porCliente} total={total} />
        </Bloco>
        <Bloco
          titulo="Tempo por atividade"
          pergunta="O que mais ocupa a rotina e o que dá para delegar?"
          legenda={<Legenda itens={LEGENDA_DELEGAVEL} />}
        >
          <BarrasHorizontais
            itens={porAtividade}
            total={total}
            dividirDelegavel
          />
        </Bloco>
      </div>

      <Bloco
        titulo="Cliente × atividade (horas)"
        pergunta="Em que tipo de trabalho vai o tempo de cada cliente?"
      >
        <MapaDeCalor registros={visiveis} atividades={opcoes.atividades} />
      </Bloco>

      <Bloco
        titulo="Apontamentos de horas"
        pergunta="De onde saíram os números acima"
      >
        {/* A key muda junto com os filtros: o React recria a tabela
            e o "Mostrar mais" volta para as 10 primeiras linhas. */}
        <TabelaRegistros
          key={`${filtros.mes}|${filtros.cliente}|${filtros.pessoa}`}
          registros={visiveis}
        />
      </Bloco>
    </main>
  );
}

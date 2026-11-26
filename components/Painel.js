"use client"; // tem estado (filtros e aba aberta), então roda no navegador

import { useMemo, useState } from "react";
import {
  atividadesPresentes,
  mesesDisponiveis,
  resumir,
  valoresUnicos,
} from "@/lib/calculos";
import { USANDO_DADOS_FICTICIOS } from "@/lib/config";
import { dataCompleta } from "@/lib/datas";
import Filtros from "./Filtros";
import VisaoGeral from "./paginas/VisaoGeral";
import PorCliente from "./paginas/PorCliente";
import Tendencia from "./paginas/Tendencia";
import DecisaoDeContratacao from "./paginas/DecisaoDeContratacao";
import Apontamentos from "./paginas/Apontamentos";
import styles from "./Painel.module.css";

const FILTROS_INICIAIS = {
  mes: "todos",
  cliente: "todos",
  pessoa: "todas",
  tipo: "todos",
};

// Páginas do relatório, na ordem das abas do rodapé
const PAGINAS = [
  { id: "visao-geral", titulo: "Visão Geral", Pagina: VisaoGeral },
  { id: "por-cliente", titulo: "Por Cliente", Pagina: PorCliente },
  { id: "tendencia", titulo: "Tendência", Pagina: Tendencia },
  { id: "contratacao", titulo: "Decisão de Contratação", Pagina: DecisaoDeContratacao },
  { id: "apontamentos", titulo: "Apontamentos", Pagina: Apontamentos },
];

export default function Painel({ registros }) {
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  const [abaAberta, setAbaAberta] = useState(PAGINAS[0].id);

  // Opções dos filtros, colunas do mapa e período saem dos próprios dados
  const opcoes = useMemo(() => {
    const datas = registros.map((r) => r.data).sort();
    return {
      meses: mesesDisponiveis(registros),
      clientes: valoresUnicos(registros, "cliente"),
      pessoas: valoresUnicos(registros, "colaborador"),
      atividades: atividadesPresentes(registros),
      inicio: datas[0],
      fim: datas[datas.length - 1],
    };
  }, [registros]);

  // useMemo: só recalcula quando os filtros (ou os dados) mudam
  const resumo = useMemo(
    () => resumir(registros, filtros),
    [registros, filtros]
  );

  if (!registros.length) {
    return <p className={styles.semDados}>Nenhum registro em data/registros.json.</p>;
  }

  const { Pagina } = PAGINAS.find((p) => p.id === abaAberta);

  return (
    <div className={styles.encaixe}>
      <div className={styles.tela}>
        <header className={styles.topo}>
          <h1 className={styles.titulo}>
            Capacidade e Atendimento · KX Soluções
            <span className={styles.subtitulo}>
              Onde o tempo dos sócios foi gasto, por cliente e atividade
            </span>
          </h1>
          <span className={styles.etiqueta}>
            {dataCompleta(opcoes.inicio)} – {dataCompleta(opcoes.fim)}
            {USANDO_DADOS_FICTICIOS && " · dados fictícios"}
          </span>
        </header>

        <Filtros
          filtros={filtros}
          opcoes={opcoes}
          onMudar={setFiltros}
          onLimpar={() => setFiltros(FILTROS_INICIAIS)}
        />

        <main id="pagina-aberta" className={styles.conteudo} role="tabpanel">
          {/* A key muda ao trocar de aba: a página é recriada
              e as animações de entrada rodam de novo. */}
          <Pagina
            key={abaAberta}
            resumo={resumo}
            filtros={filtros}
            atividades={opcoes.atividades}
          />
        </main>

        <nav className={styles.abas} role="tablist" aria-label="Páginas do relatório">
          {PAGINAS.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={p.id === abaAberta}
              aria-controls="pagina-aberta"
              className={styles.aba}
              onClick={() => setAbaAberta(p.id)}
            >
              {p.titulo}
            </button>
          ))}
          <span className={styles.fonte}>
            Fonte: data/registros.json · {registros.length} registros · clientes
            anonimizados
          </span>
        </nav>
      </div>
    </div>
  );
}

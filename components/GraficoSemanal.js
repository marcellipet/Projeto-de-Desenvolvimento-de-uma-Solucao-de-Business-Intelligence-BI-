"use client"; // Chart.js desenha num <canvas>, que só existe no navegador

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { horas, porcentagem } from "@/lib/formatar";
import styles from "./GraficoSemanal.module.css";

// Colunas empilhadas (não delegável + delegável) por semana,
// com a linha de capacidade por cima.
// semanas: [{ rotulo, dias, capacidade, delegavel, naoDelegavel }]
export default function GraficoSemanal({ semanas }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    function criarGrafico() {
      // Lê as cores do globals.css para não repetir os códigos aqui
      const css = getComputedStyle(document.documentElement);
      const cor = (nome) => css.getPropertyValue(nome).trim();

      Chart.defaults.font.family = cor("--fonte");
      Chart.defaults.font.size = 11;
      Chart.defaults.color = cor("--texto-fraco");

      return new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: semanas.map((s) => s.rotulo),
          datasets: [
            {
              label: "Não delegável",
              data: semanas.map((s) => s.naoDelegavel),
              backgroundColor: cor("--serie-1"),
              stack: "horas",
              maxBarThickness: 28,
            },
            {
              label: "Delegável",
              data: semanas.map((s) => s.delegavel),
              backgroundColor: cor("--serie-2"),
              stack: "horas",
              maxBarThickness: 28,
              // Borda de 2px na cor do fundo separa as duas partes da coluna
              borderSkipped: false,
              borderWidth: { top: 0, right: 0, bottom: 2, left: 0 },
              borderColor: cor("--superficie"),
              borderRadius: { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 },
            },
            {
              type: "line",
              label: "Capacidade",
              data: semanas.map((s) => s.capacidade),
              stack: "capacidade", // pilha separada: não soma com as barras
              borderColor: cor("--texto-2"),
              borderWidth: 1.5,
              borderDash: [5, 4],
              pointRadius: 0,
              pointHoverRadius: 0,
              stepped: "middle", // degrau por semana (semana com feriado é mais baixa)
            },
          ],
        },
        options: {
          maintainAspectRatio: false, // usa a altura da <div> de fora
          animation: { duration: 600, easing: "easeOutQuart" },
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: false }, // a legenda fica em HTML, no cartão
            tooltip: {
              callbacks: {
                title: (itens) => `Semana de ${semanas[itens[0].dataIndex].rotulo}`,
                label: (item) => ` ${item.dataset.label}: ${horas(item.parsed.y)}`,
                footer: (itens) => {
                  const s = semanas[itens[0].dataIndex];
                  const total = s.delegavel + s.naoDelegavel;
                  return [
                    `Total: ${horas(total)} (${porcentagem(total, s.capacidade)} da capacidade)`,
                    `${s.dias} dias úteis`,
                  ];
                },
              },
            },
          },
          scales: {
            x: { stacked: true, grid: { display: false } },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: cor("--borda") },
              border: { display: false },
              ticks: { maxTicksLimit: 6, callback: (valor) => `${valor} h` },
            },
          },
        },
      });
    }

    let grafico = criarGrafico();

    // Se o sistema trocar entre tema claro e escuro, redesenha com as cores novas
    const temaEscuro = window.matchMedia("(prefers-color-scheme: dark)");
    function trocarTema() {
      grafico.destroy();
      grafico = criarGrafico();
    }
    temaEscuro.addEventListener("change", trocarTema);

    // Limpa ao atualizar ou sair da tela.
    // Sem isso aparece o erro "Canvas is already in use".
    return () => {
      temaEscuro.removeEventListener("change", trocarTema);
      grafico.destroy();
    };
  }, [semanas]);

  const total = semanas.reduce((t, s) => t + s.delegavel + s.naoDelegavel, 0);

  return (
    <div className={styles.caixa}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Horas por semana: ${semanas.length} semanas, ${horas(total)} no total. Os detalhes estão na página Apontamentos.`}
      />
    </div>
  );
}

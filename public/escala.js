// Encaixa a tela do painel (1280 × 720, como uma página do Power BI) na janela.
// Calcula quanto a tela precisa aumentar ou diminuir e guarda na variável CSS
// --escala, que o Painel.module.css usa no transform: scale().
// No celular (até 760px) o CSS ignora a escala e a página rola normalmente.

function ajustarEscala() {
  const escala = Math.min(
    (window.innerWidth - 16) / 1280,
    (window.innerHeight - 16) / 720,
    1.5 // não passa de 150% em telas muito grandes
  );
  document.documentElement.style.setProperty("--escala", escala);
}

ajustarEscala();
window.addEventListener("resize", ajustarEscala);

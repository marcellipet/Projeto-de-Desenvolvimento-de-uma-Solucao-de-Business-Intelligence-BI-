import Bloco from "../Bloco";
import TabelaRegistros from "../TabelaRegistros";
import styles from "./Pagina.module.css";

// Página 5: a lista de onde saíram todos os números das outras páginas.
export default function Apontamentos({ resumo }) {
  const quantidade = resumo.visiveis.length;

  return (
    <section className={`${styles.pagina} ${styles.soConteudo}`}>
      <Bloco
        titulo="Apontamentos de horas"
        subtitulo={`${quantidade} ${quantidade === 1 ? "registro" : "registros"} com os filtros atuais, do mais recente para o mais antigo`}
      >
        <TabelaRegistros registros={resumo.visiveis} />
      </Bloco>
    </section>
  );
}

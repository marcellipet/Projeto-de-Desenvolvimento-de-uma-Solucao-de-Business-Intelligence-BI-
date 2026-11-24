// Server Component: roda no servidor, lê os dados e entrega para o Painel.
// Quem tem estado (filtros) é o Painel, que roda no navegador.
import registros from "@/data/registros.json";
import Painel from "@/components/Painel";

export default function Home() {
  return <Painel registros={registros} />;
}

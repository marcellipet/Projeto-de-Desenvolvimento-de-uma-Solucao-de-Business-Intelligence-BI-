import "./globals.css";

export const metadata = {
  title: "Painel KX · Capacidade e Atendimento",
  description:
    "Distribuição do tempo da KX Soluções por cliente e tipo de atividade.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

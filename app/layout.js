import Script from "next/script";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

// A fonte é baixada no build e servida pelo próprio site (sem depender do Google)
const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--fonte-plex",
});

export const metadata = {
  title: "Painel KX · Capacidade e Atendimento",
  description:
    "Distribuição do tempo da KX Soluções por cliente e tipo de atividade.",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: o escala.js muda o style do <html> antes do React
    <html lang="pt-BR" className={plex.variable} suppressHydrationWarning>
      <body>
        {/* Roda antes do React: a tela já aparece no tamanho certo */}
        <Script src="/escala.js" strategy="beforeInteractive" />
        {children}
      </body>
    </html>
  );
}

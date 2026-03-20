import type { Metadata } from "next";
import "@/index.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "DevBoard",
  description: "Espaço pessoal de estudo e produtividade",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

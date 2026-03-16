import './globals.css';

export const metadata = {
  title: 'Controle Financeiro',
  description: 'Controle financeiro pessoal',
  manifest: '/manifest.webmanifest'
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

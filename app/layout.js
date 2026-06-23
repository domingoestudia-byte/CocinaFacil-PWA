import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Tipografía display de remates elegantes y alto contraste,
// muy acorde a los carteles y rótulos Art Nouveau (estilo Mucha).
const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata = {
  title: "CocinaFácil - Recetas Offline",
  description: "App de recetas de cocina que funciona sin conexión",
  manifest: "/manifest.json",
  themeColor: "#6f8350", // salvia, a juego con manifest.json e icono
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CocinaFácil",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

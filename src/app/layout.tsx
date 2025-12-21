import { checkDbConnection } from "@/lib/db";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const segoeUi = localFont({
  variable: "--font-segoe-ui",
  src: [
    {
      path: "../../public/fonts/segoe-ui/segoe_ui.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/segoe-ui/segoe_ui_italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/segoe-ui/segoe_ui_bold.ttf",
      weight: "700",
      style: "bold",
    },
    {
      path: "../../public/fonts/segoe-ui/segoe_ui_bold_italic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "Um clone do Trello feito com Next.js, Tailwind CSS e Prisma.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  checkDbConnection();
  return (
    <html lang="pt-BR">
      <body className={`${segoeUi.variable} antialiased font-sans`}>
        {children}
      </body>
    </html>
  );
}

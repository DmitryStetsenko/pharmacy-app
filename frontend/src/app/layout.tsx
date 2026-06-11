import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { Header } from "@/widgets/header/ui/Header";
import { Breadcrumbs } from "@/widgets/breadcrumbs/ui/Breadcrumbs";
import { Footer } from "@/widgets/footer/ui/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Аптека - Сервіс замовлення ліків",
  description: "Зручний онлайн-каталог та замовлення медикаментів",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body style={{ margin: 0, padding: 0 }}>
        <StoreProvider>
          <AntdRegistry>
            <ThemeProvider>
              <Header />
              <Breadcrumbs />
              <main style={{ flex: 1 }}>
                {children}
              </main>
              <Footer />
            </ThemeProvider>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}

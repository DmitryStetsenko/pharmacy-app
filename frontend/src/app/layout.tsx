import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { ToastProvider } from "@/shared/ui/toast/ToastContext";
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
  title: {
    template: "%s | Аптека Здоров'я",
    default: "Аптека Здоров'я — Онлайн-замовлення та доставка ліків",
  },
  description: "Сучасний онлайн-сервіс для швидкого пошуку, порівняння та замовлення медичних препаратів з розумним ШІ-аналізатором симптомів.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Аптека Здоров'я — Онлайн-каталог ліків",
    description: "Швидке замовлення медикаментів, актуальні ціни, наявність на складі та тріаж симптомів за допомогою ШІ.",
    url: 'http://localhost:3000',
    siteName: "Аптека Здоров'я",
    locale: 'uk_UA',
    type: 'website',
  },
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
              <ToastProvider>
                <Header />
                <Breadcrumbs />
                <main style={{ flex: 1 }}>
                  {children}
                </main>
                <Footer />
              </ToastProvider>
            </ThemeProvider>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}

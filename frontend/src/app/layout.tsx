import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, App } from "antd";
import { StoreProvider } from "@/app/providers/StoreProvider";
import { Header } from "@/widgets/header/ui/Header";
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
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#00b894", // Тематичний медичний зелений колір
                  borderRadius: 8,
                  fontFamily: "var(--font-geist-sans), sans-serif",
                },
              }}
            >
              <App style={{ minHeight: '100vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                  <Header />
                  <main style={{ flex: 1, backgroundColor: '#f5f7fa' }}>
                    {children}
                  </main>
                  <Footer />
                </div>
              </App>
            </ConfigProvider>
          </AntdRegistry>
        </StoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppStateProvider } from "@/app/context/AppStateContext";
import I18nProvider from "@/app/context/I18nProvider";
import { LanguageProvider } from "@/app/context/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "مؤسسة الموانئ الكويتية",
  description: "Intelligent shipment tracking powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <I18nProvider>
            <AppStateProvider>{children}</AppStateProvider>
          </I18nProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

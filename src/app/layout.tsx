import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Providers from "../components/providers";
import HeaderUserMock from "@/components/HeaderUserMock";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExcelPilot",
  description: "Frontend for ExcelBM concierge guidance",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900`}>
        <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
          <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold tracking-tight">ExcelPilot</Link>
              <div className="text-xs text-gray-500"><HeaderUserMock />v0.0.1</div>
            </nav>
          </header>
        <Providers>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
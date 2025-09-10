import type { Metadata } from "next";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import Providers from "../components/providers";
import { Navigation } from "@/components/layout/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExcelPilot",
  description: "Frontend for ExcelBM concierge guidance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900`}>
        <Navigation />
        <Providers>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
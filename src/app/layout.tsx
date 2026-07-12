import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import { RightNav } from "@/components/nav/RightNav";
import { AudioPlayerProvider } from "@/components/audio/AudioPlayerProvider";
import { Footer } from "@/components/layout/Footer";
import { HideOnAdmin } from "@/components/layout/HideOnAdmin";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vansh Dixit",
  description:
    "Vansh Dixit — Co-Founder & Tech Lead at WaterPlane, building AI-driven full-stack products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <RightNav />
        <AudioPlayerProvider />
        <div className="flex-1">{children}</div>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
      </body>
    </html>
  );
}

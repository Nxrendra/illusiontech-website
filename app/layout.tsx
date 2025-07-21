import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata: Metadata = {
  title: "IllusionTech - Innovative Web Solutions",
  description: "Crafting next-generation web experiences with cutting-edge technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={poppins.className}>
        <Navbar />
        <main className="bg-white">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
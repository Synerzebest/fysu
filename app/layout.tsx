import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { Libre_Baskerville } from "next/font/google"

const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-baskerville",
  display: "swap",
})
//import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Fysu",
  description: "Fysu | the favorite brand of your favorite brand",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={libreBaskerville.variable}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {/* <AuthProvider> */}
          <CartProvider>
            {children}
          </CartProvider>
        {/* </AuthProvider> */}
        <Toaster />
        
      </body>
    </html>
  );
}

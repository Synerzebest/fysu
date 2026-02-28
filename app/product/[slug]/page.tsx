import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import ProductClient from "./ProductClient";
import ThemeToggle from "@/components/ThemeToggle";

export default function ProductPage() {
  return (
    <>
      <Navbar />
      <ProductClient />
      <ThemeToggle />
      <Footer />
    </>
  )
}

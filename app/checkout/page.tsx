import CheckoutClient from "@/components/Checkout/CheckoutClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function CheckoutPage() {

  return(
    <>
      <Navbar />

      <CheckoutClient />
      
      <Footer />
    </>
    );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CheckoutClient from "@/components/CheckoutClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);


  if (!session) {
    return null;
  }

  return(
    <>
      <Navbar />

      <CheckoutClient user={session.user} />
      
      <Footer />
    </>
    );
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CheckoutClient from "@/components/CheckoutClient";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  const supabase = createClientComponentClient();
  const { data: { user } } = await supabase.auth.getUser();


  if (!session) {
    return null;
  }
  console.log(session)


  return(
    <>
      <Navbar />

      <CheckoutClient user={session.user} />
      
      <Footer />
    </>
    );
}

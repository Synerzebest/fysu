import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/profile/LogoutButton"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import Orders from "@/components/profile/Orders"
import Wishlist from "@/components/profile/Wishlist"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user!

  return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto py-10 px-4 relative top-14">
            <h1 className="text-3xl font-bold mb-6 tracking-tighter">Bonjour {user.name}</h1>

            <Orders />

            <Wishlist />

            <LogoutButton />
        </div>

        <Footer />
    </>
  )
}

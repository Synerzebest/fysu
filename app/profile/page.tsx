import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import LogoutButton from "@/components/profile/LogoutButton"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const user = session.user!

  return (
      <>
        <Navbar />
        <div className="max-w-3xl mx-auto py-10 px-4 relative top-12">
            <h1 className="text-3xl font-bold mb-6">Mon profil</h1>

            <div className="flex items-center gap-4 mb-8">
                {user.image && (
                <img
                    src={user.image}
                    alt="Photo de profil"
                    className="w-16 h-16 rounded-full object-cover"
                />
                )}
                <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-2">Mes achats</h2>

            <p className="text-gray-500 italic">Vous n’avez encore rien acheté. 🛒</p>

            <LogoutButton />
        </div>

        <Footer />
    </>
  )
}

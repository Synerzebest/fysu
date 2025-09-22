"use client"
import { signOut } from "next-auth/react"

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-6 px-4 py-2 rounded-full bg-gray-50 focus:bg-white transition-colors border border-gray-300 focus:border-gray-400 shadow-inner cursor-pointer duration-200"
    >
      Se déconnecter
    </button>
  )
}

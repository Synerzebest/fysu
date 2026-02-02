import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UsersTable from "./UsersTable.client";

export default async function AdminUsersPage() {
  const { data: users, error } = await supabaseAdmin
    .from("User")
    .select("id,name,email,image,createdAt")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (
    <>
      <Navbar />
      <div className="relative top-24 mx-auto max-w-7xl px-6 pb-24">
        <UsersTable users={users ?? []} />
      </div>
      <Footer />
    </>
  );
}

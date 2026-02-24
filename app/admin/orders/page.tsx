import AdminOrdersClient from "./AdminOrdersClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminOrdersPage() {
    return(
        <>
            <Navbar />

            <AdminOrdersClient />

            <Footer />
        </>
    )
}
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminAboutBlocs from "@/components/Admin/About/AdminAboutBlocs";

const page = () => {
    return (
        <>
          <Navbar />

          <AdminAboutBlocs />


        <div className="relative top-72">
            <Footer />  
        </div>
        </>
    )
}

export default page

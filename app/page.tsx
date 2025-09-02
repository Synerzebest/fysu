import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/Home/Hero";
import SubHero from "@/components/Home/SubHero";
import NewIn from "@/components/Home/NewIn";
import Origin from "@/components/Home/Origin";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <SubHero />
      <NewIn />
      <Origin />
      <Footer />
    </>
  );
}

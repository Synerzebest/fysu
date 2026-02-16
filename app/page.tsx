import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/Home/Hero";
import Origin from "@/components/Home/Origin";
import ThemeToggle from "@/components/ThemeToggle";
import FlyingBird from "@/components/Home/FlyingBird";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <ThemeToggle />
      <Origin />
      <FlyingBird />
      <Footer />
    </>
  );
}

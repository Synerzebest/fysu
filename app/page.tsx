import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeHero from "@/components/Home/Hero";
import Origin from "@/components/Home/Origin";
import ThemeToggle from "@/components/ThemeToggle";
import FlyingBird from "@/components/Home/FlyingBird";
import HomeSection from "@/components/Home/HomeSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <ThemeToggle />
      <div className="flex flex-col gap-28">
        <HomeSection slug="solos" />
        <HomeSection slug="duos" />
      </div>
      <FlyingBird />
      <Footer />
    </>
  );
}

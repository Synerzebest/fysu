import { Navbar, Footer } from "@/components";
import HomeHero from "@/components/Home/Hero";
import SubHero from "@/components/Home/SubHero";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <SubHero />
      <Footer />
    </>
  );
}

import { Navbar, Footer } from "@/components";
import HomeHero from "@/components/Home/Hero";
import SubHero from "@/components/Home/SubHero";
import NewIn from "@/components/Home/NewIn";

export default function Home() {
  return (
    <>
      <Navbar />
      <HomeHero />
      <SubHero />
      <NewIn />
      <Footer />
    </>
  );
}

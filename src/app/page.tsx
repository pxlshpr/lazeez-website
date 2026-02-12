import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { FeaturedDishes } from "@/components/FeaturedDishes";
import { Gallery } from "@/components/Gallery";
import { Contact } from "@/components/Contact";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <FeaturedDishes />
      <Gallery />
      <Contact />
      <WhatsAppButton />
    </>
  );
}

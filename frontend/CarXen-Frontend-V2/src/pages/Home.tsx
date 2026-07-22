import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import StatsBar from "@/components/layout/StatsBar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="page">
      <Navbar />

      <main>
        <Hero />

        <StatsBar />

        {/* Market list will go here */}
      </main>

      <Footer />
    </div>
  );
}

import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import DualJourneys from "@/components/landing/DualJourneys";
import CatalogCarousel from "@/components/landing/CatalogCarousel";
import TrustSection from "@/components/landing/TrustSection";
import PolicyInsights from "@/components/landing/PolicyInsights";
import CommunityProjects from "@/components/landing/CommunityProjects";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <ProblemSolution />
        <DualJourneys />
        <CatalogCarousel />
        <TrustSection />
        <PolicyInsights />
        <CommunityProjects />
      </main>
      <Footer />
    </div>
  );
}
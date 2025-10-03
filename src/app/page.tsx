import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import DualJourneys from "@/components/landing/DualJourneys";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import CatalogCarousel from "@/components/landing/CatalogCarousel";
import StatsSection from "@/components/landing/StatsSection";
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
        <HowItWorks />
        <FeaturesShowcase />
        <CatalogCarousel />
        <StatsSection />
        <TrustSection />
        <PolicyInsights />
        <CommunityProjects />
      </main>
      <Footer />
    </div>
  );
}
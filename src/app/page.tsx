"use client";

import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import DualJourneys from "@/components/landing/DualJourneys";
import ProductShowcase from "@/components/landing/ProductShowcase";
import TrustSection from "@/components/landing/TrustSection";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main style={{ minHeight: '100vh' }}>
        <Hero />
        <ProblemSolution />
        <DualJourneys />
        <ProductShowcase />
        <TrustSection />
        <FeaturesShowcase />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
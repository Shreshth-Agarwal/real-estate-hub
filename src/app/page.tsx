"use client";

import Navigation from "@/components/landing/Navigation";
import Hero from "@/components/landing/Hero";
import FeaturesShowcase from "@/components/landing/FeaturesShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navigation />
      <main style={{ minHeight: '100vh' }}>
        <Hero />
        <FeaturesShowcase />
        <HowItWorks />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

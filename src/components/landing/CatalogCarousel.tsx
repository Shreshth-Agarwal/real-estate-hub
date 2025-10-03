"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const categories = [
  {
    id: 1,
    title: "Premium Building Materials",
    description: "Tiles, cement, steel, and construction essentials",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/professional-real-estate-materials-catal-08e04872-20251003132605.jpg",
    items: "2,500+ products",
    verified: "150+ verified suppliers"
  },
  {
    id: 2,
    title: "Verified Professionals",
    description: "Architects, contractors, and service providers",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/real-estate-professional-provider-networ-ff722369-20251003132612.jpg",
    items: "500+ professionals",
    verified: "KYC verified network"
  },
  {
    id: 3,
    title: "Project Management",
    description: "Organize tasks, docs, and budgets in one place",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/modern-construction-project-workspace----ece22ce3-20251003132620.jpg",
    items: "All-in-one workspace",
    verified: "Collaborative tools"
  },
  {
    id: 4,
    title: "Luxury Finishes",
    description: "High-end fixtures, fittings, and decorative materials",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/luxury-real-estate-material-samples---hi-680fbba5-20251003132628.jpg",
    items: "1,000+ premium items",
    verified: "Designer collections"
  },
];

export default function CatalogCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From materials to professionals, manage your entire real estate journey
          </p>
        </motion.div>

        <div className="relative">
          {/* Carousel Container */}
          <div className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="relative h-full w-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl overflow-hidden border border-border">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={categories[currentIndex].image}
                      alt={categories[currentIndex].title}
                      fill
                      className="object-cover opacity-30"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-2xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {categories[currentIndex].verified}
                        </span>
                        <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
                          {categories[currentIndex].items}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-5xl font-bold mb-4">
                        {categories[currentIndex].title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-6">
                        {categories[currentIndex].description}
                      </p>
                      <Button size="lg" className="gap-2">
                        Explore Now <ExternalLink className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full w-12 h-12"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full w-12 h-12"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
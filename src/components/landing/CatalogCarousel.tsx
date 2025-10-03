"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function CatalogCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { data: session } = useSession();

  const catalogs = [
    {
      title: "Premium Tiles",
      brand: "Kajaria",
      price: "₹450/sqft",
      image: "🔲",
      category: "Flooring",
    },
    {
      title: "Luxury Fixtures",
      brand: "Jaquar",
      price: "₹8,500",
      image: "🚿",
      category: "Plumbing",
    },
    {
      title: "Designer Paint",
      brand: "Asian Paints",
      price: "₹650/L",
      image: "🎨",
      category: "Paints",
    },
    {
      title: "LED Lights",
      brand: "Philips",
      price: "₹1,200",
      image: "💡",
      category: "Lighting",
    },
  ];

  const handleRequestQuote = () => {
    if (session?.user) {
      router.push("/catalogs");
    } else {
      router.push("/sign-up");
    }
  };

  const handleViewCatalog = () => {
    if (session?.user) {
      router.push("/catalogs");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Browse <span className="text-primary">10,000+ products</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            From verified suppliers with real-time pricing
          </p>
        </motion.div>

        <div className="relative">
          <div className="flex gap-6 overflow-hidden">
            {catalogs.map((catalog, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-80 bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-6xl mb-4">{catalog.image}</div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{catalog.title}</h3>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {catalog.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{catalog.brand}</p>
                  <p className="text-xl font-bold">{catalog.price}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={handleViewCatalog}>
                    View Details
                  </Button>
                  <Button className="flex-1" onClick={handleRequestQuote}>Request Quote</Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {catalogs.length}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentIndex(Math.min(catalogs.length - 1, currentIndex + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button size="lg" onClick={handleViewCatalog}>
            View All Catalogs
          </Button>
        </div>
      </div>
    </section>
  );
}
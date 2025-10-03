"use client";

import { motion, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, TrendingUp, Star } from "lucide-react";

const catalogItems = [
  {
    title: "Vitrified Tiles",
    brand: "Kajaria",
    price: "₹45",
    unit: "sq.ft",
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400&h=400&fit=crop",
    rating: 4.5,
    reviews: 234,
  },
  {
    title: "Premium Cement",
    brand: "UltraTech",
    price: "₹385",
    unit: "bag",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&h=400&fit=crop",
    rating: 4.8,
    reviews: 512,
  },
  {
    title: "Steel TMT Bars",
    brand: "Tata Steel",
    price: "₹58",
    unit: "kg",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=400&fit=crop",
    rating: 4.7,
    reviews: 389,
  },
  {
    title: "Designer Faucets",
    brand: "Jaquar",
    price: "₹2,450",
    unit: "piece",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&h=400&fit=crop",
    rating: 4.6,
    reviews: 167,
  },
  {
    title: "LED Panel Lights",
    brand: "Philips",
    price: "₹850",
    unit: "piece",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=400&fit=crop",
    rating: 4.4,
    reviews: 298,
  },
];

export default function CatalogCarousel() {
  const [width, setWidth] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);

  useEffect(() => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const clientWidth = carouselRef.current.clientWidth;
      setWidth(scrollWidth - clientWidth);
    }
  }, []);

  // Auto-scroll animation
  useEffect(() => {
    const controls = animate(x, -width, {
      type: "tween",
      duration: 30,
      repeat: Infinity,
      repeatType: "loop",
      ease: "linear",
    });

    return controls.stop;
  }, [width, x]);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Explore <span className="text-primary">10,000+</span> products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            From tiles to cement, fixtures to steel—everything you need, verified and ready
          </p>
        </motion.div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          ref={carouselRef}
          className="flex gap-6 px-4"
          style={{ x }}
          onHoverStart={() => x.stop()}
          onHoverEnd={() => {
            const controls = animate(x, -width, {
              type: "tween",
              duration: 30,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            });
            return () => controls.stop();
          }}
        >
          {[...catalogItems, ...catalogItems].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="flex-shrink-0 w-72 group"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <Button size="sm" className="w-full" variant="secondary">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Request Quote
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">{item.brand}</div>
                    <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-2xl font-bold text-primary">{item.price}</div>
                      <div className="text-xs text-muted-foreground">per {item.unit}</div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>{item.reviews} orders</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Button size="lg" variant="outline">
          Browse Full Catalog
        </Button>
      </motion.div>
    </section>
  );
}
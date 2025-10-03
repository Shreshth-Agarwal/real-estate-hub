"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Phone, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export default function ProblemSolution() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const slideLeft = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const slideRight = useTransform(scrollYProgress, [0, 0.5], [-100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ opacity }} className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            From chaos to <span className="text-primary">clarity</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop juggling WhatsApp chats, spreadsheets, and unreliable contacts
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Problem Side */}
          <motion.div
            style={{ x: slideLeft, opacity }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-destructive/5 rounded-3xl" />
            <div className="relative bg-card border-2 border-destructive/20 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <span className="text-2xl">😰</span>
                </div>
                <h3 className="text-xl font-bold">The Old Way</h3>
              </div>

              {/* Chaotic Messages */}
              <div className="space-y-3">
                {[
                  { icon: MessageSquare, text: "Scattered WhatsApp groups" },
                  { icon: Phone, text: "Unreliable word-of-mouth contacts" },
                  { icon: FileText, text: "Lost quotes in email threads" },
                  { icon: MessageSquare, text: "No price history or comparison" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5"
                  >
                    <item.icon className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <span className="text-sm font-medium text-destructive">Hours wasted every week</span>
              </div>
            </div>
          </motion.div>

          {/* Arrow */}
          <div className="hidden md:flex justify-center absolute left-1/2 -translate-x-1/2 z-10">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <ArrowRight className="w-8 h-8 text-primary" />
            </motion.div>
          </div>

          {/* Solution Side */}
          <motion.div
            style={{ x: slideRight, opacity }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl" />
            <div className="relative bg-card border-2 border-primary/20 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-bold">The Hub4Estate Way</h3>
              </div>

              {/* Organized Features */}
              <div className="space-y-3">
                {[
                  { text: "One searchable catalog for all materials" },
                  { text: "Verified professionals with trust badges" },
                  { text: "Compare quotes side-by-side instantly" },
                  { text: "Complete project workspace & history" },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <div className="pt-4 text-center">
                <span className="text-sm font-medium text-primary">Save 10+ hours every week</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
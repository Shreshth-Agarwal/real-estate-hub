"use client";

import { motion } from "framer-motion";
import { X, Check, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function ProblemSolution() {
  const problems = [
    "Scattered WhatsApp contacts",
    "Unverified suppliers and prices",
    "No transparency or comparison",
    "Time wasted on calls and follow-ups",
  ];

  const solutions = [
    "One unified platform",
    "KYC-verified professionals",
    "Instant quote comparisons",
    "AI-powered search and support",
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Stop Juggling. Start Building.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Replace chaos with clarity in your real estate projects
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Problem Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-8 left-8 px-4 py-2 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full text-sm font-medium z-10">
              Before Hub4Estate
            </div>
            
            <div className="relative rounded-2xl border-2 border-red-500/20 bg-red-500/5 p-8 space-y-4">
              {/* Chaotic Screenshot Representation */}
              <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-red-500/10 to-orange-500/10 mb-6">
                <div className="absolute inset-0 p-4 space-y-2">
                  {/* Simulated messy chat bubbles */}
                  <div className="bg-background/80 backdrop-blur rounded-lg p-3 max-w-[80%] ml-auto text-xs">
                    Do you have tiles?
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-lg p-3 max-w-[80%] text-xs">
                    Yes, what size?
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-lg p-3 max-w-[80%] ml-auto text-xs">
                    Price for 600x600?
                  </div>
                  <div className="bg-background/80 backdrop-blur rounded-lg p-3 max-w-[70%] text-xs">
                    Call me: 98XXXXXXXX
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-red-500/20 to-transparent flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur rounded-full p-4">
                      <X className="w-8 h-8 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
                The Old Way
              </h3>
              
              <ul className="space-y-3">
                {problems.map((problem, index) => (
                  <motion.li
                    key={problem}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{problem}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Solution Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute -top-8 left-8 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium z-10">
              With Hub4Estate
            </div>
            
            <div className="relative rounded-2xl border-2 border-green-500/20 bg-green-500/5 p-8 space-y-4">
              {/* Organized UI Representation */}
              <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-green-500/10 to-blue-500/10 mb-6">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/professional-real-estate-materials-catal-08e04872-20251003132605.jpg"
                  alt="Organized Hub4Estate Platform"
                  fill
                  className="object-cover opacity-40"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent flex items-center justify-center">
                  <div className="bg-background/90 backdrop-blur rounded-full p-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-4">
                The Hub4Estate Way
              </h3>
              
              <ul className="space-y-3">
                {solutions.map((solution, index) => (
                  <motion.li
                    key={solution}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="font-medium">{solution}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Arrow Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-12"
        >
          <div className="flex items-center gap-4 px-6 py-3 bg-primary/10 rounded-full">
            <span className="text-sm font-medium">Make the switch today</span>
            <ArrowRight className="w-5 h-5 text-primary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
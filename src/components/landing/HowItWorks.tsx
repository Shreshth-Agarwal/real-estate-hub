"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare, CheckCircle, Rocket } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search & Discover",
      description: "Browse verified catalogs or post your requirements",
      color: "from-blue-500 to-cyan-500",
      delay: 0.1,
    },
    {
      icon: MessageSquare,
      title: "Request Quotes",
      description: "Get comparable quotes from multiple verified providers",
      color: "from-purple-500 to-pink-500",
      delay: 0.2,
    },
    {
      icon: CheckCircle,
      title: "Compare & Choose",
      description: "Review options side-by-side and select the best fit",
      color: "from-orange-500 to-red-500",
      delay: 0.3,
    },
    {
      icon: Rocket,
      title: "Track & Deliver",
      description: "Manage everything in your project workspace",
      color: "from-green-500 to-emerald-500",
      delay: 0.4,
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How it <span className="text-primary">works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From search to delivery in four simple steps
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-orange-500 to-green-500 opacity-20" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: step.delay }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Step number badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold z-10">
                {index + 1}
              </div>

              {/* Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative mb-6"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-0.5`}>
                  <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-foreground" />
                  </div>
                </div>
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} blur-xl opacity-20 -z-10`} />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
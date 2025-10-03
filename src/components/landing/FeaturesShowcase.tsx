"use client";

import { motion } from "framer-motion";
import { 
  Search, 
  Shield, 
  Zap, 
  MessageSquare, 
  BarChart3, 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2 
} from "lucide-react";

export default function FeaturesShowcase() {
  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find materials across 10,000+ products instantly",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Verified Pros",
      description: "KYC-verified professionals with trust scores",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Instant Quotes",
      description: "Get comparable quotes in minutes, not days",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: MessageSquare,
      title: "AI Assistant",
      description: "Ask anything about policies, processes, or materials",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track project progress and budget in real-time",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "Work with your team in shared workspaces",
      color: "from-indigo-500 to-purple-500",
    },
    {
      icon: FileText,
      title: "Smart Docs",
      description: "Store and organize all project documents",
      color: "from-teal-500 to-cyan-500",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "10+ hours saved every week on coordination",
      color: "from-rose-500 to-pink-500",
    },
    {
      icon: CheckCircle2,
      title: "Quality Assured",
      description: "Ratings and reviews from real customers",
      color: "from-lime-500 to-green-500",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Everything you need in{" "}
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
              one platform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to make real estate transactions seamless
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl rounded-2xl"
                style={{
                  backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                }}
              />
              
              <div className="relative bg-card border border-border rounded-2xl p-6 h-full flex flex-col">
                {/* Icon */}
                <div className="mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-0.5`}>
                    <div className="w-full h-full bg-card rounded-[10px] flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-foreground" />
                    </div>
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
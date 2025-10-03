"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, Award, TrendingUp, FileCheck, Star } from "lucide-react";

export default function TrustSection() {
  const trustFeatures = [
    {
      icon: Shield,
      title: "KYC Verified",
      description: "Every professional goes through document verification",
      stat: "100%",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Star,
      title: "Rated & Reviewed",
      description: "Real feedback from real projects",
      stat: "50K+",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Award,
      title: "Trust Score",
      description: "Transparent scoring based on response time & ratings",
      stat: "Live",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FileCheck,
      title: "Documented",
      description: "GST, PAN, business licenses verified",
      stat: "Secure",
      color: "from-green-500 to-green-600",
    },
  ];

  const badges = [
    { label: "Verified", icon: CheckCircle2, color: "bg-green-500" },
    { label: "Top Rated", icon: Star, color: "bg-yellow-500" },
    { label: "Fast Response", icon: TrendingUp, color: "bg-blue-500" },
    { label: "KYC Complete", icon: Shield, color: "bg-purple-500" },
  ];

  return (
    <section id="trust" className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Trust-First Platform
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built on <span className="text-primary">trust & transparency</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every professional is verified. Every rating is real. Every quote is documented.
          </p>
        </motion.div>

        {/* Trust Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group"
            >
              <div className="bg-card border border-border rounded-xl p-6 h-full hover:border-primary/50 transition-all hover:shadow-lg">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {feature.stat}
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Badge Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-muted/50 to-accent/20 rounded-2xl p-8 md:p-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold">
                Trust badges that matter
              </h3>
              <p className="text-muted-foreground">
                Professionals earn badges through verified actions—KYC completion, fast responses, high ratings, and consistent quality.
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                {badges.map((badge, index) => (
                  <motion.div
                    key={badge.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm"
                  >
                    <div className={`w-5 h-5 rounded-full ${badge.color} flex items-center justify-center`}>
                      <badge.icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium">{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sample Profile Card */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-xl font-bold">
                  RS
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">Royal Suppliers</h4>
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>4.8</span>
                    </div>
                    <span>•</span>
                    <span>234 reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                  ✓ KYC Verified
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-medium">
                  Fast Response
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-xs font-medium">
                  Trust Score: 95
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Search, Package, CheckCircle, BarChart3, ShoppingCart, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DualJourneys() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleConsumerClick = () => {
    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up?role=consumer");
    }
  };

  const handleProviderClick = () => {
    if (session?.user) {
      router.push("/provider/dashboard");
    } else {
      router.push("/sign-up?role=provider");
    }
  };

  const journeys = [
    {
      type: "Consumer",
      emoji: "🏠",
      title: "Building or renovating?",
      description: "Find materials, compare quotes, and manage your project—all in one place.",
      color: "from-blue-500/10 via-blue-500/5 to-transparent",
      borderColor: "border-blue-500/20",
      steps: [
        { icon: Search, text: "Search catalogs & professionals" },
        { icon: ShoppingCart, text: "Get instant quotes" },
        { icon: CheckCircle, text: "Compare & choose the best" },
        { icon: Users, text: "Collaborate in project workspace" },
      ],
      cta: "Start as Consumer",
      onClick: handleConsumerClick,
    },
    {
      type: "Provider",
      emoji: "🏪",
      title: "Grow your business",
      description: "List your products, get verified, receive qualified leads, and build trust.",
      color: "from-purple-500/10 via-purple-500/5 to-transparent",
      borderColor: "border-purple-500/20",
      steps: [
        { icon: Package, text: "List your catalog" },
        { icon: CheckCircle, text: "Get KYC verified" },
        { icon: BarChart3, text: "Receive qualified RFQs" },
        { icon: Users, text: "Build trust & grow revenue" },
      ],
      cta: "Start as Provider",
      onClick: handleProviderClick,
    },
  ];

  return (
    <section id="features" className="py-20 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for <span className="text-primary">every journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're building your dream home or growing your business
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {journeys.map((journey, index) => (
            <motion.div
              key={journey.type}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-br ${journey.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`} />

              {/* Card */}
              <div className={`relative bg-card border-2 ${journey.borderColor} rounded-2xl p-8 h-full flex flex-col transition-all duration-300`}>
                {/* Header */}
                <div className="mb-6">
                  <div className="text-5xl mb-4">{journey.emoji}</div>
                  <h3 className="text-2xl font-bold mb-2">{journey.title}</h3>
                  <p className="text-muted-foreground">{journey.description}</p>
                </div>

                {/* Steps */}
                <div className="space-y-4 flex-grow mb-6">
                  {journey.steps.map((step, stepIndex) => (
                    <motion.div
                      key={stepIndex}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.2 + stepIndex * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">{step.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA */}
                <Button
                  onClick={journey.onClick}
                  className="w-full group-hover:shadow-lg transition-shadow"
                  size="lg"
                >
                  {journey.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
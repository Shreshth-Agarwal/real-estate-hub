"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Award, Star, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function TrustSection() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGetVerified = () => {
    if (session?.user) {
      router.push("/provider/kyc");
    } else {
      router.push("/sign-up?role=provider");
    }
  };

  const trustFeatures = [
    {
      icon: ShieldCheck,
      title: "KYC Verified",
      description: "All providers undergo strict verification",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Award,
      title: "Quality Assured",
      description: "Only authorized dealers and certified pros",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Star,
      title: "Rated & Reviewed",
      description: "Transparent ratings from real customers",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: Users,
      title: "10,000+ Professionals",
      description: "Growing network of trusted providers",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built on <span className="text-primary">trust</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every provider is verified. Every transaction is secure. Every review is real.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Button size="lg" onClick={handleGetVerified}>
            <ShieldCheck className="w-5 h-5 mr-2" />
            Get Verified
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
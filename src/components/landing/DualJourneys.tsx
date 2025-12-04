"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, Store, CheckCircle2, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function DualJourneys() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleConsumerClick = () => {
    if (session?.user) {
      router.push("/catalogs");
    } else {
      router.push("/sign-up?role=consumer");
    }
  };

  const handleProviderClick = () => {
    if (session?.user) {
      router.push("/provider/setup");
    } else {
      router.push("/sign-up?role=provider");
    }
  };

  const consumerFeatures = [
    "Search 10,000+ verified products",
    "Get instant quotes from multiple suppliers",
    "Manage projects and track budgets",
    "Access policy guidance via AI",
  ];

  const providerFeatures = [
    "Reach 50,000+ active buyers",
    "List unlimited products for free",
    "Respond to RFQs instantly",
    "Build trust with KYC verification",
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Built for Everyone in Real Estate
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're building your dream home or growing your business
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Consumer Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group relative"
          >
            <div className="relative h-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-border overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/modern-construction-project-workspace----ece22ce3-20251003132620.jpg"
                  alt="Consumer Journey"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative p-8 md:p-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                  <ShoppingBag className="w-4 h-4" />
                  For Consumers
                </div>

                <h3 className="text-3xl font-bold">
                  Find, Compare, and Build with Confidence
                </h3>

                <p className="text-muted-foreground">
                  Access India's largest catalog of verified construction materials and professionals. 
                  Get competitive quotes and manage your entire project in one place.
                </p>

                <ul className="space-y-3">
                  {consumerFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  onClick={handleConsumerClick}
                  className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-lg transition-all"
                >
                  Start as Consumer <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Decorative Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          </motion.div>

          {/* Provider Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="group relative"
          >
            <div className="relative h-full bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl border border-border overflow-hidden">
              {/* Background Image */}
              <div className="absolute inset-0 opacity-20">
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/fbe5faa4-02cd-49d9-8d16-5d47ebf781d0/generated_images/real-estate-professional-provider-networ-ff722369-20251003132612.jpg"
                  alt="Provider Journey"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="relative p-8 md:p-10 space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                  <Store className="w-4 h-4" />
                  For Providers
                </div>

                <h3 className="text-3xl font-bold">
                  Grow Your Business with Qualified Leads
                </h3>

                <p className="text-muted-foreground">
                  Connect with verified buyers actively looking for materials and services. 
                  Showcase your products and build trust with transparent ratings.
                </p>

                <ul className="space-y-3">
                  {providerFeatures.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg"
                  onClick={handleProviderClick}
                  className="w-full bg-green-600 hover:bg-green-700 group-hover:shadow-lg transition-all"
                >
                  List Your Business <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                {/* Decorative Element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500/20 rounded-full blur-3xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
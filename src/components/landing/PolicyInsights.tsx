"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, BookOpen, MapPin, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function PolicyInsights() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleAskAI = () => {
    if (session?.user) {
      router.push("/dashboard");
    } else {
      router.push("/sign-up");
    }
  };

  const handleExploreBlogs = () => {
    router.push("/knowledge/blogs");
  };

  const handleCityInsights = () => {
    router.push("/knowledge/city-insights");
  };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your AI-powered <span className="text-primary">knowledge hub</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant answers to policies, processes, and real estate questions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* AI Assistant Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Ask Hub AI</h3>
                <p className="text-sm text-muted-foreground">Multilingual assistant</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-lg bg-muted/50 text-sm">
                💬 "How do I convert agricultural land to residential in Pune?"
              </div>
              <div className="p-4 rounded-lg bg-primary/10 text-sm">
                🤖 Here's the step-by-step process with required documents, fees, and office contacts...
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleAskAI}>
              Try AI Assistant
            </Button>
          </motion.div>

          {/* City Insights & Blogs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-lg">City Insights</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Municipal plans, government schemes, and local regulations
              </p>
              <Button variant="outline" className="w-full" onClick={handleCityInsights}>
                Explore Cities
              </Button>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
                <h3 className="font-semibold text-lg">Knowledge Base</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Guides, tutorials, and expert articles on real estate
              </p>
              <Button variant="outline" className="w-full" onClick={handleExploreBlogs}>
                Read Articles
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
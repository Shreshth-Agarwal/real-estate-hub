"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Bot, BookOpen, MapPin, FileText, Send } from "lucide-react";
import { useState } from "react";

export default function PolicyInsights() {
  const [question, setQuestion] = useState("");

  const cityInsights = [
    { city: "Mumbai", laws: "45+ policies", color: "from-blue-500 to-blue-600" },
    { city: "Delhi", laws: "38+ policies", color: "from-purple-500 to-purple-600" },
    { city: "Bangalore", laws: "42+ policies", color: "from-green-500 to-green-600" },
    { city: "Pune", laws: "35+ policies", color: "from-orange-500 to-orange-600" },
  ];

  const sampleQuestions = [
    "How to convert agricultural land to residential?",
    "What are the steps for building plan approval?",
    "GST rates for construction materials?",
  ];

  return (
    <section className="py-20 md:py-32 relative bg-gradient-to-br from-muted/30 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Bot className="w-4 h-4" />
            AI-Powered Knowledge
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Policy answers, <span className="text-primary">instantly</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Navigate regulations, DLC rates, and compliance with our AI assistant trained on real-estate policies
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* AI Bot Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
              {/* Chat Header */}
              <div className="bg-primary/5 border-b border-border p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <div className="font-semibold">Policy Assistant</div>
                  <div className="text-xs text-muted-foreground">Always available</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="p-4 space-y-4 h-80 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    👤
                  </div>
                  <div className="bg-muted rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                    <p className="text-sm">How to convert land use from agricultural to residential in Pune?</p>
                  </div>
                </div>

                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-none p-3 max-w-[80%]">
                    <p className="text-sm mb-2">
                      To convert agricultural land to residential in Pune, you need to:
                    </p>
                    <ol className="text-sm space-y-1 list-decimal list-inside">
                      <li>Apply to PMC/PMRDA with ownership docs</li>
                      <li>Pay NA conversion fees (7.5% of land value)</li>
                      <li>Get NOC from collector office</li>
                      <li>Submit approved layout plan</li>
                    </ol>
                    <div className="mt-3 pt-3 border-t border-primary/20 text-xs text-muted-foreground flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      <span>Source: PMRDA Regulations 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask about policies, regulations..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  <Button size="icon" className="flex-shrink-0">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sample Questions */}
            <div className="mt-4 space-y-2">
              <div className="text-xs text-muted-foreground mb-2">Try asking:</div>
              {sampleQuestions.map((q, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setQuestion(q)}
                  className="block w-full text-left text-sm px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  {q}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* City Insights & Resources */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2 space-y-8"
          >
            {/* City Cards */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                City-Specific Insights
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {cityInsights.map((city, index) => (
                  <motion.div
                    key={city.city}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className="group cursor-pointer"
                  >
                    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all hover:shadow-lg">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${city.color} mb-3 group-hover:scale-110 transition-transform`} />
                      <div className="font-semibold mb-1">{city.city}</div>
                      <div className="text-sm text-muted-foreground">{city.laws}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-primary" />
                Knowledge Base
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Building Approval Process", docs: "12 guides" },
                  { title: "GST & Tax Regulations", docs: "8 guides" },
                  { title: "Land Conversion Steps", docs: "15 guides" },
                  { title: "Utility Connections", docs: "10 guides" },
                ].map((resource, index) => (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-card border border-border hover:border-primary/50 transition-all cursor-pointer group"
                  >
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">{resource.title}</div>
                      <div className="text-sm text-muted-foreground">{resource.docs}</div>
                    </div>
                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { motion } from "framer-motion";
import { Check, Zap, Crown, Building2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const plans = [
    {
      name: "Free",
      icon: Zap,
      price: 0,
      description: "Perfect for getting started",
      features: [
        "Browse catalogs",
        "Basic search",
        "Up to 3 RFQs per month",
        "Community access",
        "Basic support"
      ],
      highlighted: false,
      cta: "Get Started",
      color: "gray"
    },
    {
      name: "Pro",
      icon: Crown,
      price: 999,
      description: "For active professionals",
      features: [
        "Everything in Free",
        "Unlimited RFQs",
        "Priority quotes",
        "Featured profile",
        "Advanced analytics",
        "Priority support",
        "Project management tools",
        "Team collaboration"
      ],
      highlighted: true,
      cta: "Start Pro Trial",
      color: "blue",
      badge: "Most Popular"
    },
    {
      name: "Business",
      icon: Building2,
      price: 2999,
      description: "For established businesses",
      features: [
        "Everything in Pro",
        "Unlimited team members",
        "White-label branding",
        "Custom integrations",
        "Dedicated account manager",
        "Advanced reporting",
        "API access",
        "Custom contracts",
        "24/7 premium support"
      ],
      highlighted: false,
      cta: "Contact Sales",
      color: "purple"
    }
  ];

  const addons = [
    {
      name: "Featured Listings",
      price: 499,
      description: "Boost your catalog visibility by 5x",
      unit: "per month"
    },
    {
      name: "Lead Pack",
      price: 1999,
      description: "100 qualified leads directly to your inbox",
      unit: "one-time"
    },
    {
      name: "Premium Verification",
      price: 2999,
      description: "Get verified badge and trust score boost",
      unit: "one-time"
    },
    {
      name: "Ad Campaign",
      price: 4999,
      description: "Targeted advertising across platform",
      unit: "per campaign"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the plan that's right for you. All plans include access to our core features.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Check className="w-4 h-4 text-green-500" />
            <span>No credit card required</span>
            <span>•</span>
            <Check className="w-4 h-4 text-green-500" />
            <span>Cancel anytime</span>
            <span>•</span>
            <Check className="w-4 h-4 text-green-500" />
            <span>14-day free trial</span>
          </div>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-blue-500 to-blue-600">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              <div className={`relative h-full ${
                plan.highlighted
                  ? "bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-500/50"
                  : "bg-card border border-border"
              } rounded-2xl p-8`}>
                {plan.highlighted && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl -z-10 blur-xl" />
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${plan.color}-500 to-${plan.color}-600 flex items-center justify-center mb-6`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>

                {/* Plan Info */}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                    {plan.price > 0 && (
                      <span className="text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>

                {/* CTA */}
                <Button
                  className={`w-full mb-8 ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                      : ""
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                  size="lg"
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add-ons */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Boost Your Growth</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Supercharge your presence with our premium add-ons
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addons.map((addon, index) => (
              <motion.div
                key={addon.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all"
              >
                <h3 className="font-semibold mb-2">{addon.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {addon.description}
                </p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold">₹{addon.price.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">/{addon.unit}</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Add to Plan
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-6">
          {[
            {
              q: "Can I switch plans anytime?",
              a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate the charges."
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment partners."
            },
            {
              q: "Is there a free trial?",
              a: "Yes! All paid plans come with a 14-day free trial. No credit card required to start."
            },
            {
              q: "What happens after my trial ends?",
              a: "Your account will automatically switch to the Free plan. You can upgrade to a paid plan anytime."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to grow your business?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join 50,000+ professionals who trust Hub4Estate for their real estate needs
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
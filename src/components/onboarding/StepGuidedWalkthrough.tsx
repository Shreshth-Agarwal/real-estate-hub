"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  MessageSquare,
  Upload,
  FileText,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

type OnboardingData = {
  role: "consumer" | "provider" | "investor" | null;
  providerType?: "dealer" | "service_pro" | "broker" | "builder";
  categories: string[];
  profile: Record<string, any>;
};

type StepProps = {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack?: () => void;
  userId?: string;
};

export default function StepGuidedWalkthrough({ data, onBack, userId }: StepProps) {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const consumerSteps = [
    {
      icon: Search,
      title: "Search Catalogs",
      description: "Browse 10,000+ products from verified suppliers",
      action: "Start Searching",
      link: "/catalogs",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Request Quotes",
      description: "Get competitive quotes from multiple providers",
      action: "Post a Request",
      link: "/rfq",
      color: "from-green-500 to-green-600",
    },
    {
      icon: FileText,
      title: "Manage Projects",
      description: "Track everything in your project workspace",
      action: "Create Project",
      link: "/projects",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const providerSteps = [
    {
      icon: Upload,
      title: "Upload Your Catalog",
      description: "List your products and start getting discovered",
      action: "Upload Catalog",
      link: "/provider/catalog/new",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: CheckCircle2,
      title: "Complete KYC",
      description: "Get verified to build trust and unlock more features",
      action: "Start Verification",
      link: "/provider/kyc",
      color: "from-green-500 to-green-600",
    },
    {
      icon: MessageSquare,
      title: "Respond to RFQs",
      description: "Receive and respond to customer requests",
      action: "View RFQ Inbox",
      link: "/provider/dashboard",
      color: "from-purple-500 to-purple-600",
    },
  ];

  const investorSteps = [
    {
      icon: Search,
      title: "Explore Projects",
      description: "Browse verified real estate opportunities",
      action: "View Projects",
      link: "/projects",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FileText,
      title: "City Insights",
      description: "Access market data and government plans",
      action: "View Insights",
      link: "/knowledge/city-insights",
      color: "from-green-500 to-green-600",
    },
  ];

  const getSteps = () => {
    if (data.role === "consumer") return consumerSteps;
    if (data.role === "investor") return investorSteps;
    return providerSteps;
  };

  const steps = getSteps();

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      // Save onboarding data to backend
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: data.role,
          providerType: data.providerType,
          categories: data.categories,
          profile: data.profile,
          onboardingComplete: true,
        }),
      });

      if (!response.ok) throw new Error("Failed to save profile");

      toast.success("Profile setup complete! 🎉");

      // Redirect based on role
      if (data.role === "provider") {
        router.push("/provider/dashboard");
      } else if (data.role === "consumer") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete setup. Please try again.");
      setIsCompleting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full mb-4"
        >
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h2 className="text-2xl md:text-3xl font-bold mb-2">You're all set! 🎉</h2>
        <p className="text-muted-foreground">Here's what you can do next</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="group relative"
            >
              <div className={`absolute -inset-1 bg-gradient-to-br ${step.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
              
              <div className="relative bg-card border border-border rounded-xl p-6 h-full flex flex-col">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 flex-grow">{step.description}</p>
                <button
                  onClick={() => {
                    handleComplete();
                    setTimeout(() => router.push(step.link), 1000);
                  }}
                  className="flex items-center text-primary text-sm font-medium hover:gap-2 transition-all"
                >
                  {step.action}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Button
          onClick={handleComplete}
          disabled={isCompleting}
          className="w-full h-12 text-lg"
          size="lg"
        >
          {isCompleting ? (
            "Completing Setup..."
          ) : (
            <>
              Go to Dashboard <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>

        {onBack && (
          <Button variant="outline" onClick={onBack} className="w-full">
            Back to Profile
          </Button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          💡 Tip: Complete your profile and verification to unlock all features
        </p>
      </div>
    </div>
  );
}
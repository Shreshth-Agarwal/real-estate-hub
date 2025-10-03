"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, Store, CheckCircle2, ArrowRight } from "lucide-react";

interface RoleSelectionProps {
  userId: string;
  userName: string;
}

export default function RoleSelection({ userId, userName }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<"consumer" | "provider" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const roles = [
    {
      type: "consumer" as const,
      icon: Home,
      title: "I'm a Consumer",
      description: "Building or renovating? Find materials, get quotes, and manage projects.",
      features: [
        "Search verified catalogs",
        "Compare quotes instantly",
        "Manage project workspace",
        "Connect with professionals",
      ],
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-500/5",
    },
    {
      type: "provider" as const,
      icon: Store,
      title: "I'm a Provider",
      description: "Grow your business with qualified leads and trust building tools.",
      features: [
        "List your products/services",
        "Get KYC verified",
        "Receive qualified RFQs",
        "Build trust & reputation",
      ],
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-500/10 to-purple-500/5",
    },
  ];

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);

    try {
      // Update user role
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
        },
        body: JSON.stringify({
          userType: selectedRole,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user role");
      }

      // Redirect based on role
      if (selectedRole === "provider") {
        router.push("/provider/setup");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl space-y-8"
    >
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Welcome, {userName}! 👋
        </h1>
        <p className="text-lg text-muted-foreground">
          Let's personalize your experience. How will you use Hub4Estate?
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {roles.map((role, index) => (
          <motion.div
            key={role.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedRole(role.type)}
            className={`relative cursor-pointer group ${
              selectedRole === role.type ? "ring-2 ring-primary ring-offset-2" : ""
            }`}
          >
            {/* Glow effect */}
            <div
              className={`absolute -inset-1 bg-gradient-to-br ${role.bgGradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl`}
            />

            {/* Card */}
            <div className="relative bg-card border-2 border-border rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary/50">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <role.icon className="w-6 h-6 text-white" />
                </div>
                {selectedRole === role.type && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-2">{role.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">{role.description}</p>

              {/* Features */}
              <div className="space-y-3">
                {role.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-center pt-4"
      >
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="px-8"
        >
          {isLoading ? (
            "Setting up..."
          ) : (
            <>
              Continue <ArrowRight className="ml-2 w-5 h-5" />
            </>
          )}
        </Button>
      </motion.div>

      <p className="text-center text-sm text-muted-foreground">
        Don't worry, you can always change this later in your settings
      </p>
    </motion.div>
  );
}
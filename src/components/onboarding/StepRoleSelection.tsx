"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, Store, Building2, TrendingUp, ChevronRight } from "lucide-react";

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
  userId?: string;
  userName?: string;
};

export default function StepRoleSelection({ data, onUpdate, onNext }: StepProps) {
  const roles = [
    {
      id: "consumer" as const,
      title: "Consumer",
      icon: Home,
      description: "Building or renovating? Find materials, get quotes, manage projects.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      id: "provider" as const,
      title: "Provider",
      icon: Store,
      description: "Dealer, Service Pro, Broker, or Builder. List your catalog and get leads.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
      subRoles: [
        { id: "dealer", label: "Dealer/Shop Owner", icon: "🏪" },
        { id: "service_pro", label: "Service Professional", icon: "🔧" },
        { id: "broker", label: "Real Estate Broker", icon: "🏢" },
        { id: "builder", label: "Builder/Developer", icon: "🏗️" },
      ],
    },
    {
      id: "investor" as const,
      title: "Investor",
      icon: TrendingUp,
      description: "Explore projects, market insights, and investment opportunities.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
  ];

  const handleRoleSelect = (roleId: "consumer" | "provider" | "investor") => {
    if (roleId === "provider") {
      onUpdate({ role: roleId });
    } else {
      onUpdate({ role: roleId });
      onNext();
    }
  };

  const handleProviderTypeSelect = (type: "dealer" | "service_pro" | "broker" | "builder") => {
    onUpdate({ role: "provider", providerType: type });
    onNext();
  };

  if (data.role === "provider" && !data.providerType) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">What type of provider are you?</h2>
          <p className="text-muted-foreground">Choose the option that best describes your business</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {roles
            .find((r) => r.id === "provider")
            ?.subRoles?.map((subRole, index) => (
              <motion.button
                key={subRole.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProviderTypeSelect(subRole.id as any)}
                className="p-6 rounded-xl border-2 border-border hover:border-primary/50 bg-card hover:bg-accent transition-all text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-4xl">{subRole.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                      {subRole.label}
                    </h3>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </motion.button>
            ))}
        </div>

        <Button variant="outline" onClick={() => onUpdate({ role: null })} className="w-full">
          Back to Role Selection
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Hub4Estate! 🎉</h2>
        <p className="text-muted-foreground">Let's get you set up. Choose your role to continue.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {roles.map((role, index) => {
          const Icon = role.icon;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group relative"
            >
              <div className={`absolute -inset-1 bg-gradient-to-br ${role.color} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl`} />
              
              <button
                onClick={() => handleRoleSelect(role.id)}
                className={`relative w-full h-full p-6 rounded-xl border-2 ${role.borderColor} ${role.bgColor} hover:border-primary/50 transition-all`}
              >
                <div className="space-y-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="text-left space-y-2">
                    <h3 className="text-xl font-bold">{role.title}</h3>
                    <p className="text-sm text-muted-foreground">{role.description}</p>
                  </div>
                  <div className="flex items-center text-primary text-sm font-medium pt-2">
                    Choose {role.title}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepRoleSelection from "./StepRoleSelection";
import StepCategoryPicker from "./StepCategoryPicker";
import StepProfileSetup from "./StepProfileSetup";
import StepGuidedWalkthrough from "./StepGuidedWalkthrough";
import { Progress } from "@/components/ui/progress";

type OnboardingData = {
  role: "consumer" | "provider" | "investor" | null;
  providerType?: "dealer" | "service_pro" | "broker" | "builder";
  categories: string[];
  profile: {
    photo?: File | string;
    businessName?: string;
    gst?: string;
    pan?: string;
    brands?: string[];
    projectType?: string;
    budgetRange?: string;
  };
};

type StepProps = {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack?: () => void;
};

export default function OnboardingFlow({
  userId,
  userName,
  initialRole,
}: {
  userId: string;
  userName: string;
  initialRole?: "consumer" | "provider" | null;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    role: initialRole || null,
    categories: [],
    profile: {},
  });

  const handleUpdate = (newData: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const steps = [
    {
      id: "role",
      title: "Choose Your Role",
      component: StepRoleSelection,
    },
    {
      id: "categories",
      title: "Select Categories",
      component: StepCategoryPicker,
    },
    {
      id: "profile",
      title: "Setup Your Profile",
      component: StepProfileSetup,
    },
    {
      id: "walkthrough",
      title: "Get Started",
      component: StepGuidedWalkthrough,
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="font-medium">{steps[currentStep].title}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CurrentStepComponent
            data={data}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onBack={currentStep > 0 ? handleBack : undefined}
            userId={userId}
            userName={userName}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
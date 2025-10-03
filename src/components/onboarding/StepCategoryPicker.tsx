"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

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
};

export default function StepCategoryPicker({ data, onUpdate, onNext, onBack }: StepProps) {
  const providerCategories = {
    dealer: [
      { id: "tiles", label: "Tiles", icon: "🔲" },
      { id: "marble", label: "Marble & Granite", icon: "⬜" },
      { id: "cement", label: "Cement & Concrete", icon: "🏗️" },
      { id: "paints", label: "Paints & Coatings", icon: "🎨" },
      { id: "plumbing", label: "Plumbing & Fixtures", icon: "🚿" },
      { id: "lighting", label: "Lighting & Electrical", icon: "💡" },
      { id: "doors", label: "Doors & Windows", icon: "🚪" },
      { id: "hardware", label: "Hardware & Tools", icon: "🔧" },
      { id: "flooring", label: "Flooring Solutions", icon: "📐" },
      { id: "roofing", label: "Roofing Materials", icon: "🏠" },
    ],
    service_pro: [
      { id: "plumber", label: "Plumbing Services", icon: "🔧" },
      { id: "electrician", label: "Electrical Services", icon: "⚡" },
      { id: "carpenter", label: "Carpentry", icon: "🪚" },
      { id: "painter", label: "Painting Services", icon: "🎨" },
      { id: "mason", label: "Masonry Work", icon: "🧱" },
      { id: "interior", label: "Interior Design", icon: "🛋️" },
      { id: "architect", label: "Architecture", icon: "📐" },
      { id: "landscaping", label: "Landscaping", icon: "🌳" },
    ],
    broker: [
      { id: "residential", label: "Residential", icon: "🏠" },
      { id: "commercial", label: "Commercial", icon: "🏢" },
      { id: "industrial", label: "Industrial", icon: "🏭" },
      { id: "land", label: "Land & Plots", icon: "🗺️" },
      { id: "rental", label: "Rental Properties", icon: "🔑" },
    ],
    builder: [
      { id: "residential", label: "Residential Projects", icon: "🏘️" },
      { id: "commercial", label: "Commercial Buildings", icon: "🏢" },
      { id: "townships", label: "Townships", icon: "🌆" },
      { id: "luxury", label: "Luxury Villas", icon: "🏰" },
      { id: "affordable", label: "Affordable Housing", icon: "🏡" },
    ],
  };

  const consumerInterests = [
    { id: "renovation", label: "Home Renovation", icon: "🔨" },
    { id: "new_construction", label: "New Construction", icon: "🏗️" },
    { id: "buying_house", label: "Buying a House", icon: "🏠" },
    { id: "interior", label: "Interior Design", icon: "🛋️" },
    { id: "commercial", label: "Commercial Space", icon: "🏢" },
    { id: "landscaping", label: "Landscaping", icon: "🌳" },
  ];

  const investorInterests = [
    { id: "residential", label: "Residential Projects", icon: "🏘️" },
    { id: "commercial", label: "Commercial Real Estate", icon: "🏢" },
    { id: "land", label: "Land Banking", icon: "🗺️" },
    { id: "rental", label: "Rental Income", icon: "💰" },
    { id: "reits", label: "REITs", icon: "📊" },
  ];

  const getCategories = () => {
    if (data.role === "consumer") return consumerInterests;
    if (data.role === "investor") return investorInterests;
    if (data.role === "provider" && data.providerType) {
      return providerCategories[data.providerType] || [];
    }
    return [];
  };

  const categories = getCategories();
  const selectedCategories = data.categories || [];

  const toggleCategory = (categoryId: string) => {
    const updated = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];
    onUpdate({ categories: updated });
  };

  const getTitle = () => {
    if (data.role === "consumer") return "What are you interested in?";
    if (data.role === "investor") return "What type of investments interest you?";
    return "What categories do you work with?";
  };

  const getDescription = () => {
    if (data.role === "consumer") return "Select all that apply to help us personalize your experience";
    if (data.role === "investor") return "Choose your investment focus areas";
    return "Select the categories where you offer products or services";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">{getTitle()}</h2>
        <p className="text-muted-foreground">{getDescription()}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleCategory(category.id)}
              className={`relative p-4 rounded-xl border-2 transition-all ${
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-accent"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              <div className="text-center space-y-2">
                <div className="text-3xl">{category.icon}</div>
                <div className="text-sm font-medium leading-tight">{category.label}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 p-4 bg-muted/50 rounded-lg"
        >
          <span className="text-sm font-medium mr-2">Selected:</span>
          {selectedCategories.map((id) => {
            const category = categories.find((c) => c.id === id);
            return (
              <Badge key={id} variant="secondary">
                {category?.icon} {category?.label}
              </Badge>
            );
          })}
        </motion.div>
      )}

      <div className="flex gap-4 pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button
          onClick={onNext}
          disabled={selectedCategories.length === 0}
          className="flex-1"
        >
          Continue {selectedCategories.length > 0 && `(${selectedCategories.length} selected)`}
        </Button>
      </div>
    </div>
  );
}
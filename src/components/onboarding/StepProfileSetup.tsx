"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Building2, FileText, User } from "lucide-react";

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
    description?: string;
  };
};

type StepProps = {
  data: OnboardingData;
  onUpdate: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack?: () => void;
};

export default function StepProfileSetup({ data, onUpdate, onNext, onBack }: StepProps) {
  const [photoPreview, setPhotoPreview] = useState<string>("");

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpdate({
        profile: { ...data.profile, photo: file },
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    onUpdate({
      profile: { ...data.profile, [field]: value },
    });
  };

  const isProvider = data.role === "provider";
  const isConsumer = data.role === "consumer";
  const isInvestor = data.role === "investor";

  const canProceed = () => {
    if (isProvider) {
      return data.profile.businessName && (data.profile.gst || data.profile.pan);
    }
    if (isConsumer) {
      return data.profile.projectType;
    }
    if (isInvestor) {
      return data.profile.budgetRange;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Setup Your Profile</h2>
        <p className="text-muted-foreground">
          {isProvider && "Help customers find and trust you"}
          {isConsumer && "Tell us about your project"}
          {isInvestor && "Set your investment preferences"}
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Photo/Logo Upload */}
        <div className="space-y-2">
          <Label>{isProvider ? "Business Logo" : "Profile Photo"} (Optional)</Label>
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center bg-muted/50 overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload Image</span>
                </div>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <p className="text-xs text-muted-foreground mt-2">
                JPG, PNG or GIF. Max 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Provider Fields */}
        {isProvider && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="businessName">
                Business Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="businessName"
                  placeholder="Enter your business name"
                  value={data.profile.businessName || ""}
                  onChange={(e) => handleInputChange("businessName", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gst">GST Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="gst"
                    placeholder="27AAPFU0939F1ZV"
                    value={data.profile.gst || ""}
                    onChange={(e) => handleInputChange("gst", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="pan"
                    placeholder="ABCDE1234F"
                    value={data.profile.pan || ""}
                    onChange={(e) => handleInputChange("pan", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brands">Associated Brands (Optional)</Label>
              <Input
                id="brands"
                placeholder="e.g., Asian Paints, Jaquar, Kajaria (comma separated)"
                value={data.profile.brands?.join(", ") || ""}
                onChange={(e) =>
                  handleInputChange("brands", e.target.value.split(",").map((b) => b.trim()))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Business Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Tell potential customers about your business..."
                value={data.profile.description || ""}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={4}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> At least one of GST or PAN is required
              for verification
            </p>
          </motion.div>
        )}

        {/* Consumer Fields */}
        {isConsumer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="projectType">
                Project Type <span className="text-destructive">*</span>
              </Label>
              <select
                id="projectType"
                value={data.profile.projectType || ""}
                onChange={(e) => handleInputChange("projectType", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              >
                <option value="">Select project type</option>
                <option value="new_construction">New Construction</option>
                <option value="renovation">Renovation</option>
                <option value="interior">Interior Design</option>
                <option value="commercial">Commercial Project</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budgetRange">Budget Range (Optional)</Label>
              <select
                id="budgetRange"
                value={data.profile.budgetRange || ""}
                onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              >
                <option value="">Select budget range</option>
                <option value="under_5L">Under ₹5 Lakhs</option>
                <option value="5L_10L">₹5-10 Lakhs</option>
                <option value="10L_25L">₹10-25 Lakhs</option>
                <option value="25L_50L">₹25-50 Lakhs</option>
                <option value="50L_plus">₹50 Lakhs+</option>
              </select>
            </div>
          </motion.div>
        )}

        {/* Investor Fields */}
        {isInvestor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="budgetRange">
                Investment Budget <span className="text-destructive">*</span>
              </Label>
              <select
                id="budgetRange"
                value={data.profile.budgetRange || ""}
                onChange={(e) => handleInputChange("budgetRange", e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              >
                <option value="">Select budget range</option>
                <option value="10L_25L">₹10-25 Lakhs</option>
                <option value="25L_50L">₹25-50 Lakhs</option>
                <option value="50L_1Cr">₹50 Lakhs - ₹1 Crore</option>
                <option value="1Cr_5Cr">₹1-5 Crores</option>
                <option value="5Cr_plus">₹5 Crores+</option>
              </select>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4 pt-4">
        {onBack && (
          <Button variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button onClick={onNext} disabled={!canProceed()} className="flex-1">
          Continue
        </Button>
      </div>
    </div>
  );
}
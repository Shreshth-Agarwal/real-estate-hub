"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Loader2, Store, MapPin, Phone, ArrowRight } from "lucide-react";

export default function ProviderSetupContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: "",
    phone: "",
    address: "",
    city: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/profiles-provider", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("bearer_token")}`,
        },
        body: JSON.stringify({
          shopName: formData.shopName,
          phone: formData.phone,
          address: formData.address,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create provider profile");
      }

      router.push("/provider/dashboard");
    } catch (error) {
      console.error("Error creating provider profile:", error);
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Set up your business profile
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your shop to start receiving qualified leads
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shop Name */}
              <div className="space-y-2">
                <Label htmlFor="shopName">
                  Shop/Business Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Store className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="shopName"
                    name="shopName"
                    placeholder="ABC Building Materials"
                    value={formData.shopName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  Contact Phone <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">
                  Business Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Industrial Area"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="Mumbai"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Business Description <span className="text-muted-foreground">(Optional)</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell customers about your business, products, and services..."
                  value={formData.description}
                  onChange={handleChange}
                  disabled={isLoading}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Complete Setup <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-primary/5 border border-primary/20 rounded-xl p-4"
          >
            <p className="text-sm text-muted-foreground text-center">
              💡 After setup, complete your KYC verification to start receiving qualified leads
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

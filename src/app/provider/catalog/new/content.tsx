"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewCatalogContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    sku: "",
    description: "",
    price: "",
    currency: "INR",
    unit: "piece",
    moq: "1",
    stockStatus: "in",
    city: "",
    deliveryRadiusKm: "50",
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=/provider/catalog/new");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/catalogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          moq: parseInt(formData.moq),
          deliveryRadiusKm: parseInt(formData.deliveryRadiusKm),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create catalog");
      }

      toast.success("Catalog created successfully!");
      router.push("/provider/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create catalog");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <Link href="/provider/dashboard" className="inline-flex items-center text-sm hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create New Catalog</CardTitle>
            <CardDescription>Add a new product to your catalog</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Premium Vitrified Tiles"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g., Kajaria"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU/Model</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g., KJR-VT-001"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the product, specifications, features..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(val) => setFormData({ ...formData, currency: val })}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Unit *</Label>
                  <Select value={formData.unit} onValueChange={(val) => setFormData({ ...formData, unit: val })}>
                    <SelectTrigger id="unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="piece">Piece</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="sqft">Sq. Ft.</SelectItem>
                      <SelectItem value="sqm">Sq. M.</SelectItem>
                      <SelectItem value="kg">Kg</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moq">Minimum Order Quantity</Label>
                  <Input
                    id="moq"
                    type="number"
                    value={formData.moq}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stockStatus">Stock Status *</Label>
                  <Select value={formData.stockStatus} onValueChange={(val) => setFormData({ ...formData, stockStatus: val })}>
                    <SelectTrigger id="stockStatus">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in">In Stock</SelectItem>
                      <SelectItem value="out">Out of Stock</SelectItem>
                      <SelectItem value="limited">Limited Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g., Delhi"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                  <Input
                    id="deliveryRadius"
                    type="number"
                    value={formData.deliveryRadiusKm}
                    onChange={(e) => setFormData({ ...formData, deliveryRadiusKm: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Creating..." : "Create Catalog"}
                </Button>
                <Link href="/provider/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

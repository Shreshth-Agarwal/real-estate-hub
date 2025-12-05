"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, X, Plus, Package } from "lucide-react";
import { toast } from "sonner";

interface CatalogFormData {
  title: string;
  brand: string;
  sku: string;
  description: string;
  price: string;
  unit: string;
  moq: string;
  stockStatus: string;
  city: string;
  deliveryRadiusKm: string;
  images: string[];
  attributes: Record<string, string>;
}

const UNITS = ["pieces", "kg", "sqft", "sqm", "bags", "boxes", "meters", "liters"];
const STOCK_STATUS = ["in_stock", "out_of_stock", "limited"];
const CITIES = ["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Lucknow"];
const CATEGORIES = ["Tiles", "Cement", "Steel", "Marble", "Granite", "Paint", "Plumbing", "Electrical", "Hardware", "Sanitary"];

export function CatalogForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [formData, setFormData] = useState<CatalogFormData>({
    title: "",
    brand: "",
    sku: "",
    description: "",
    price: "",
    unit: "pieces",
    moq: "1",
    stockStatus: "in_stock",
    city: "",
    deliveryRadiusKm: "50",
    images: [],
    attributes: {},
  });

  const [newAttributeKey, setNewAttributeKey] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");

  const handleChange = (field: keyof CatalogFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      // Simulate image upload - in production, upload to Cloudinary/S3
      const imageUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        await new Promise((resolve) => {
          reader.onloadend = () => {
            imageUrls.push(reader.result as string);
            resolve(null);
          };
          reader.readAsDataURL(file);
        });
      }

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
      
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const addAttribute = () => {
    if (newAttributeKey && newAttributeValue) {
      setFormData(prev => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [newAttributeKey]: newAttributeValue,
        },
      }));
      setNewAttributeKey("");
      setNewAttributeValue("");
    }
  };

  const removeAttribute = (key: string) => {
    setFormData(prev => {
      const newAttributes = { ...prev.attributes };
      delete newAttributes[key];
      return { ...prev, attributes: newAttributes };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/catalogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          brand: formData.brand || null,
          sku: formData.sku || null,
          description: formData.description || null,
          price: parseFloat(formData.price),
          currency: "INR",
          unit: formData.unit,
          moq: parseInt(formData.moq),
          stockStatus: formData.stockStatus,
          city: formData.city,
          deliveryRadiusKm: parseInt(formData.deliveryRadiusKm),
          images: formData.images,
          attributes: formData.attributes,
        }),
      });

      if (response.ok) {
        toast.success("Catalog created successfully!");
        router.push("/provider/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to create catalog");
      }
    } catch (error) {
      console.error("Catalog creation error:", error);
      toast.error("Failed to create catalog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Enter the core details of your product</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Vitrified Floor Tiles 600x600mm"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                placeholder="e.g., Kajaria, Somany"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU / Model Number</Label>
              <Input
                id="sku"
                placeholder="e.g., KJ-VT-600-001"
                value={formData.sku}
                onChange={(e) => handleChange("sku", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockStatus">Stock Status</Label>
              <Select value={formData.stockStatus} onValueChange={(value) => handleChange("stockStatus", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STOCK_STATUS.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status.replace("_", " ").toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Detailed product description, specifications, features..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Quantity</CardTitle>
          <CardDescription>Set your pricing and minimum order requirements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit *</Label>
              <Select value={formData.unit} onValueChange={(value) => handleChange("unit", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="moq">Minimum Order Quantity</Label>
              <Input
                id="moq"
                type="number"
                min="1"
                value={formData.moq}
                onChange={(e) => handleChange("moq", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Location & Delivery</CardTitle>
          <CardDescription>Set your service area and delivery radius</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Select value={formData.city} onValueChange={(value) => handleChange("city", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliveryRadiusKm">Delivery Radius (km)</Label>
              <Input
                id="deliveryRadiusKm"
                type="number"
                min="1"
                value={formData.deliveryRadiusKm}
                onChange={(e) => handleChange("deliveryRadiusKm", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Upload product images (recommended: 4-6 high-quality images)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                id="images"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploadingImages}
              />
              <label htmlFor="images" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  {uploadingImages ? (
                    <Loader2 className="w-12 h-12 text-muted-foreground animate-spin" />
                  ) : (
                    <Upload className="w-12 h-12 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-medium">Click to upload images</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, WEBP up to 5MB each</p>
                  </div>
                </div>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Additional Attributes</CardTitle>
          <CardDescription>Add custom specifications (e.g., Size: 600x600mm, Finish: Glossy)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Attribute name (e.g., Size)"
              value={newAttributeKey}
              onChange={(e) => setNewAttributeKey(e.target.value)}
            />
            <Input
              placeholder="Value (e.g., 600x600mm)"
              value={newAttributeValue}
              onChange={(e) => setNewAttributeValue(e.target.value)}
            />
            <Button type="button" onClick={addAttribute} variant="outline" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {Object.entries(formData.attributes).length > 0 && (
            <div className="flex flex-wrap gap-2">
              {Object.entries(formData.attributes).map(([key, value]) => (
                <Badge key={key} variant="secondary" className="flex items-center gap-2">
                  <span>{key}: {value}</span>
                  <button
                    type="button"
                    onClick={() => removeAttribute(key)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Package className="w-4 h-4 mr-2" />
              Create Catalog
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
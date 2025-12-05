"use client";

import { useSession } from "@/lib/auth-client";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, ArrowLeft, Package, MapPin, TrendingUp, ShoppingCart, Share2, Heart } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Catalog {
  id: number;
  title: string;
  brand: string;
  sku: string;
  description: string;
  price: number;
  unit: string;
  moq: number;
  stockStatus: string;
  city: string;
  deliveryRadiusKm: number;
  images: string[];
  attributes: Record<string, string>;
  popularityScore: number;
  providerId: string;
}

export default function CatalogDetailPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const catalogId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (catalogId) {
      fetchCatalog();
    }
  }, [catalogId]);

  const fetchCatalog = async () => {
    try {
      const response = await fetch(`/api/catalogs`);
      if (response.ok) {
        const catalogs = await response.json();
        const foundCatalog = catalogs.find((c: Catalog) => c.id === parseInt(catalogId));
        if (foundCatalog) {
          setCatalog(foundCatalog);
        } else {
          toast.error("Product not found");
        }
      }
    } catch (error) {
      console.error("Error fetching catalog:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestQuote = () => {
    if (!session?.user) {
      router.push(`/sign-in?redirect=/catalogs/${catalogId}`);
      return;
    }
    router.push(`/rfq/new?catalog=${catalogId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Product not found</h3>
            <Button asChild>
              <Link href="/catalogs">Browse Catalogs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/catalogs" className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Catalogs
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-8"
        >
          {/* Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted">
                {catalog.images && catalog.images.length > 0 ? (
                  <img
                    src={catalog.images[selectedImage]}
                    alt={catalog.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-24 h-24 text-muted-foreground" />
                  </div>
                )}
              </div>
            </Card>
            {catalog.images && catalog.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {catalog.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={image} alt={`${catalog.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  {catalog.brand && (
                    <p className="text-sm text-muted-foreground mb-1">{catalog.brand}</p>
                  )}
                  <h1 className="text-3xl font-bold mb-2">{catalog.title}</h1>
                  {catalog.sku && (
                    <p className="text-sm text-muted-foreground">SKU: {catalog.sku}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge variant={catalog.stockStatus === 'in_stock' ? 'default' : 'secondary'}>
                  {catalog.stockStatus.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {catalog.popularityScore} views
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Price</p>
                <p className="text-4xl font-bold text-primary">
                  ₹{catalog.price}
                  <span className="text-lg text-muted-foreground font-normal">/{catalog.unit}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Minimum Order</p>
                  <p className="font-semibold">{catalog.moq} {catalog.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Delivery Radius</p>
                  <p className="font-semibold">{catalog.deliveryRadiusKm} km</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{catalog.city}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">
                {catalog.description || "No description available"}
              </p>
            </div>

            {catalog.attributes && Object.keys(catalog.attributes).length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(catalog.attributes).map(([key, value]) => (
                      <div key={key} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">{key}</p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-3">
              <Button onClick={handleRequestQuote} size="lg" className="w-full">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Request Quote
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Get competitive quotes from verified suppliers • No payment required
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

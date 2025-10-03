"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Package } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Catalog {
  id: number;
  title: string;
  brand: string;
  price: number;
  currency: string;
  unit: string;
  city: string;
  stockStatus: string;
  description: string;
}

export default function CatalogsPage() {
  const { data: session } = useSession();
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [city, setCity] = useState("");
  const [brand, setBrand] = useState("");

  useEffect(() => {
    fetchCatalogs();
  }, []);

  const fetchCatalogs = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const params = new URLSearchParams();
      if (searchQuery) params.append("search", searchQuery);
      if (city) params.append("city", city);
      if (brand) params.append("brand", brand);

      const response = await fetch(`/api/catalogs?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await response.json();
      if (response.ok) {
        setCatalogs(data.catalogs || []);
      }
    } catch (error) {
      console.error("Failed to fetch catalogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setLoading(true);
    fetchCatalogs();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <h1 className="text-2xl font-bold">Hub4Estate</h1>
            </Link>
            <div className="flex items-center gap-4">
              {session?.user ? (
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Discover Building Materials
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground mb-8"
          >
            Browse catalogs from verified suppliers • Request quotes • Compare prices
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search for tiles, cement, fixtures..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="City" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Cities</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Mumbai">Mumbai</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Jaipur">Jaipur</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={brand} onValueChange={setBrand}>
                    <SelectTrigger className="w-full md:w-[200px]">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Brands</SelectItem>
                      <SelectItem value="Kajaria">Kajaria</SelectItem>
                      <SelectItem value="Asian Paints">Asian Paints</SelectItem>
                      <SelectItem value="Jaquar">Jaquar</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={handleSearch} disabled={loading}>
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-20 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : catalogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {catalogs.map((catalog, index) => (
              <motion.div
                key={catalog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="line-clamp-1">{catalog.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{catalog.brand}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {catalog.city}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant={catalog.stockStatus === "in" ? "default" : "secondary"}>
                        {catalog.stockStatus === "in" ? "In Stock" : catalog.stockStatus === "out" ? "Out of Stock" : "Limited"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {catalog.description}
                    </p>
                    <div className="text-2xl font-bold">
                      {catalog.currency === "INR" ? "₹" : "$"}
                      {catalog.price.toLocaleString()}
                      <span className="text-sm text-muted-foreground font-normal">
                        /{catalog.unit}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Link href={`/catalogs/${catalog.id}`} className="flex-1">
                      <Button variant="outline" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Link href={`/catalogs/${catalog.id}/rfq`} className="flex-1">
                      <Button className="w-full">Request Quote</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No catalogs found</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
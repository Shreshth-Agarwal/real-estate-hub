"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Package, 
  MessageSquare, 
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Eye,
  Upload,
  FileText,
  Plus,
  ArrowRight,
  Shield,
  Star,
  Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProviderDashboardContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState("");

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user) {
      const hasSeenTooltip = localStorage.getItem("provider_tooltip_seen");
      if (!hasSeenTooltip) {
        setShowTooltip("catalog");
        setTimeout(() => {
          setShowTooltip("rfq");
          setTimeout(() => {
            localStorage.setItem("provider_tooltip_seen", "true");
            setShowTooltip("");
          }, 3000);
        }, 3000);
      }
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Hub4Estate</h1>
                  <p className="text-xs text-muted-foreground">Provider Portal</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">Consumer View</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/sign-in">Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome & Quick Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {session.user.name}! 🏪
              </h2>
              <p className="text-muted-foreground">
                Manage your catalogs, respond to RFQs, and grow your business
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="lg" asChild>
                <Link href="/provider/kyc">
                  <Shield className="w-5 h-5 mr-2" />
                  Complete KYC
                </Link>
              </Button>
              <Button size="lg" className="relative" asChild>
                <Link href="/provider/catalog/new">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Catalog
                  {showTooltip === "catalog" && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-16 right-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap"
                    >
                      👆 Start by uploading your first catalog!
                    </motion.div>
                  )}
                </Link>
              </Button>
            </div>
          </div>

          {/* Verification Status Alert */}
          <Card className="border-orange-500/50 bg-orange-500/5">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Verification Pending</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete KYC verification to unlock all features and build trust
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link href="/provider/kyc">
                  Complete Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Catalog Views</CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Upload catalogs to get views</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New RFQs</CardTitle>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No new requests yet</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">Not enough data</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <Zap className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">--</div>
                <p className="text-xs text-muted-foreground">No responses yet</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="rfq" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="rfq">RFQ Inbox</TabsTrigger>
              <TabsTrigger value="catalogs">Catalogs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* RFQ Inbox */}
            <TabsContent value="rfq" className="space-y-4">
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>RFQ Inbox</CardTitle>
                      <CardDescription>Matching job requests from consumers</CardDescription>
                    </div>
                    <Badge variant="secondary">0 New</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No RFQs yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload your catalog and complete KYC to start receiving qualified leads
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button variant="outline" asChild>
                        <Link href="/provider/kyc">
                          <Shield className="w-4 h-4 mr-2" />
                          Complete KYC
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/provider/catalog/new">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Catalog
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
                {showTooltip === "rfq" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute top-1/2 -translate-y-1/2 -left-4 -translate-x-full bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap"
                  >
                    👈 RFQs will appear here once you upload catalogs
                  </motion.div>
                )}
              </Card>
            </TabsContent>

            {/* Catalog Manager */}
            <TabsContent value="catalogs" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Catalog Manager</CardTitle>
                      <CardDescription>Upload, view analytics, and manage your products</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href="/provider/catalog/new">
                        <Plus className="w-4 h-4 mr-2" />
                        New Catalog
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No catalogs yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload PDFs or Excel files with your products to get started
                    </p>
                    <Button asChild>
                      <Link href="/provider/catalog/new">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Your First Catalog
                      </Link>
                    </Button>
                    <div className="mt-6 p-4 bg-muted/50 rounded-lg text-left max-w-md mx-auto">
                      <p className="text-sm font-medium mb-2">💡 Catalog Tips:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Upload PDFs, Excel, or individual images</li>
                        <li>• Include brand, price, and specifications</li>
                        <li>• Verified catalogs appear in search results</li>
                        <li>• Track views and quote requests</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Your key metrics at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Eye className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Views</p>
                          <p className="text-xs text-muted-foreground">Catalog impressions</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">0</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Quotes Sent</p>
                          <p className="text-xs text-muted-foreground">Response count</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">0</span>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          <Star className="w-5 h-5 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Trust Score</p>
                          <p className="text-xs text-muted-foreground">Build with KYC & reviews</p>
                        </div>
                      </div>
                      <Badge variant="outline">Not Verified</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth Tips</CardTitle>
                    <CardDescription>Improve your performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Complete KYC Verification</p>
                        <p className="text-xs text-muted-foreground">Build trust with verified badge</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Respond Within 2 Hours</p>
                        <p className="text-xs text-muted-foreground">Fast responses improve win rate</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <Upload className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Upload More Catalogs</p>
                        <p className="text-xs text-muted-foreground">More products = more leads</p>
                      </div>
                    </div>

                    <div className="flex gap-3 p-3 rounded-lg bg-muted/50">
                      <BarChart3 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Update Prices Regularly</p>
                        <p className="text-xs text-muted-foreground">Keep your catalog current</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Getting Started Guide */}
          <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent">
            <CardHeader>
              <CardTitle>Getting Started as a Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h4 className="font-semibold">Upload Catalog</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Add your products with prices and details
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h4 className="font-semibold">Get Verified</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Complete KYC to build trust and credibility
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h4 className="font-semibold">Respond to RFQs</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Get qualified leads and grow your business
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

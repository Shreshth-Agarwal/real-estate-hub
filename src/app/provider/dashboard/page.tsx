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
  Plus,
  ArrowRight,
  Shield,
  Star,
  Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface ProviderProfile {
  id: number;
  shopName: string;
  kycStatus: string;
  trustScore: number;
  categories: string[];
  brands: string[];
}

interface Catalog {
  id: number;
  title: string;
  brand: string;
  price: number;
  unit: string;
  stockStatus: string;
  images: string[];
  popularityScore: number;
}

interface RFQRequest {
  id: number;
  quantity: number;
  unit: string;
  message: string;
  status: string;
  createdAt: string;
  consumer: {
    name: string;
    email: string;
  };
  catalog?: {
    title: string;
    brand: string;
  };
}

export default function ProviderDashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [catalogs, setCatalogs] = useState<Catalog[]>([]);
  const [rfqs, setRfqs] = useState<RFQRequest[]>([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    newRfqs: 0,
    winRate: 0,
    avgResponseTime: 0,
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user) {
      fetchProviderData();
    }
  }, [session, isPending, router]);

  const fetchProviderData = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Fetch provider profile
      const profileRes = await fetch("/api/profiles-provider", { headers });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.length > 0) {
          setProfile(profileData[0]);
        }
      }

      // Fetch catalogs
      const catalogRes = await fetch("/api/catalogs", { headers });
      if (catalogRes.ok) {
        const catalogData = await catalogRes.json();
        setCatalogs(catalogData);
        
        // Calculate total views
        const totalViews = catalogData.reduce((sum: number, cat: Catalog) => sum + cat.popularityScore, 0);
        setStats(prev => ({ ...prev, totalViews }));
      }

      // Fetch RFQs
      const rfqRes = await fetch("/api/rfq-requests", { headers });
      if (rfqRes.ok) {
        const rfqData = await rfqRes.json();
        const providerRfqs = rfqData.filter((rfq: RFQRequest) => rfq.status !== 'draft');
        setRfqs(providerRfqs);
        
        const newRfqs = providerRfqs.filter((rfq: RFQRequest) => rfq.status === 'submitted').length;
        setStats(prev => ({ ...prev, newRfqs }));
      }
    } catch (error) {
      console.error("Error fetching provider data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session?.user) return null;

  const kycComplete = profile?.kycStatus === 'verified';
  const hasCatalogs = catalogs.length > 0;

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
                Welcome back{profile?.shopName ? `, ${profile.shopName}` : ''}! 🏪
              </h2>
              <p className="text-muted-foreground">
                Manage your catalogs, respond to RFQs, and grow your business
              </p>
            </div>
            <div className="flex gap-3">
              {!kycComplete && (
                <Button variant="outline" size="lg" asChild>
                  <Link href="/provider/kyc">
                    <Shield className="w-5 h-5 mr-2" />
                    Complete KYC
                  </Link>
                </Button>
              )}
              <Button size="lg" asChild>
                <Link href="/provider/catalog/new">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Catalog
                </Link>
              </Button>
            </div>
          </div>

          {/* Verification Status Alert */}
          {!kycComplete && (
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
          )}

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Catalog Views</CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews}</div>
                <p className="text-xs text-muted-foreground">
                  {hasCatalogs ? 'Total impressions' : 'Upload catalogs to get views'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">New RFQs</CardTitle>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.newRfqs}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.newRfqs > 0 ? 'Awaiting your response' : 'No new requests yet'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.winRate > 0 ? `${stats.winRate}%` : '--'}</div>
                <p className="text-xs text-muted-foreground">Not enough data</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
                <Zap className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile?.trustScore || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {kycComplete ? 'Verified Provider' : 'Complete KYC to boost'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="rfq" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="rfq">
                RFQ Inbox
                {stats.newRfqs > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {stats.newRfqs}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="catalogs">Catalogs ({catalogs.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* RFQ Inbox */}
            <TabsContent value="rfq" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>RFQ Inbox</CardTitle>
                      <CardDescription>Matching job requests from consumers</CardDescription>
                    </div>
                    <Badge variant="secondary">{stats.newRfqs} New</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {rfqs.length === 0 ? (
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
                  ) : (
                    <div className="space-y-4">
                      {rfqs.map((rfq) => (
                        <Card key={rfq.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="font-semibold mb-1">
                                  {rfq.catalog?.title || `RFQ #${rfq.id}`}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {rfq.quantity} {rfq.unit}
                                  {rfq.catalog?.brand && ` • Brand: ${rfq.catalog.brand}`}
                                </p>
                              </div>
                              <Badge variant={rfq.status === 'submitted' ? 'default' : 'secondary'}>
                                {rfq.status}
                              </Badge>
                            </div>
                            {rfq.message && (
                              <p className="text-sm mb-4 p-3 bg-muted/50 rounded-lg">
                                {rfq.message}
                              </p>
                            )}
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                {new Date(rfq.createdAt).toLocaleDateString()}
                              </span>
                              <Button size="sm" asChild>
                                <Link href={`/provider/rfq/${rfq.id}`}>
                                  View & Quote <ArrowRight className="w-4 h-4 ml-2" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
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
                  {catalogs.length === 0 ? (
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
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catalogs.map((catalog) => (
                        <Card key={catalog.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            {catalog.images && catalog.images.length > 0 && (
                              <div className="aspect-square rounded-lg bg-muted mb-3 overflow-hidden">
                                <img 
                                  src={catalog.images[0]} 
                                  alt={catalog.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <h4 className="font-semibold mb-1">{catalog.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {catalog.brand && `${catalog.brand} • `}
                              ₹{catalog.price}/{catalog.unit}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant={catalog.stockStatus === 'in_stock' ? 'default' : 'secondary'}>
                                {catalog.stockStatus.replace('_', ' ')}
                              </Badge>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {catalog.popularityScore}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
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
                      <span className="text-2xl font-bold">{stats.totalViews}</span>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total RFQs</p>
                          <p className="text-xs text-muted-foreground">Requests received</p>
                        </div>
                      </div>
                      <span className="text-2xl font-bold">{rfqs.length}</span>
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
                      <Badge variant={kycComplete ? 'default' : 'outline'}>
                        {kycComplete ? 'Verified' : 'Not Verified'}
                      </Badge>
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
                      <CheckCircle2 className={`w-5 h-5 ${kycComplete ? 'text-green-500' : 'text-muted-foreground'} flex-shrink-0 mt-0.5`} />
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
                      <Upload className={`w-5 h-5 ${hasCatalogs ? 'text-green-500' : 'text-blue-500'} flex-shrink-0 mt-0.5`} />
                      <div>
                        <p className="text-sm font-medium">Upload More Catalogs</p>
                        <p className="text-xs text-muted-foreground">
                          {hasCatalogs ? `${catalogs.length} catalogs uploaded` : 'More products = more leads'}
                        </p>
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
        </motion.div>
      </div>
    </div>
  );
}
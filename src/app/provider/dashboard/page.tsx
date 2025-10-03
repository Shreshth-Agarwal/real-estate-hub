"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, FileText, TrendingUp, MessageSquare, Upload, Plus } from "lucide-react";
import Link from "next/link";

export default function ProviderDashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    catalogs: 0,
    rfqs: 0,
    views: 0,
    quotes: 0,
  });

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=/provider/dashboard");
    }
  }, [session, isPending, router]);

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
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Provider Dashboard</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {session.user.name}</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Catalogs</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.catalogs}</div>
              <p className="text-xs text-muted-foreground">Products listed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active RFQs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rfqs}</div>
              <p className="text-xs text-muted-foreground">Pending requests</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.views}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quotes Sent</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.quotes}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="catalogs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="catalogs">Catalogs</TabsTrigger>
            <TabsTrigger value="rfqs">RFQ Inbox</TabsTrigger>
            <TabsTrigger value="kyc">KYC & Verification</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="catalogs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Your Catalogs</CardTitle>
                    <CardDescription>Manage your product listings and inventory</CardDescription>
                  </div>
                  <Link href="/provider/catalog/new">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Catalog
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No catalogs yet</p>
                  <p className="text-sm mb-4">Create your first catalog to start receiving RFQs</p>
                  <Link href="/provider/catalog/new">
                    <Button>Create Catalog</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rfqs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>RFQ Inbox</CardTitle>
                <CardDescription>Respond to buyer quote requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No RFQs yet</p>
                  <p className="text-sm">You'll see buyer requests here once you have catalogs listed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>KYC & Verification</CardTitle>
                <CardDescription>Upload documents to verify your business and increase trust</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/provider/kyc">
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload KYC Documents
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Profile</CardTitle>
                <CardDescription>Manage your shop information and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/provider/profile">
                  <Button className="w-full">Edit Profile</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
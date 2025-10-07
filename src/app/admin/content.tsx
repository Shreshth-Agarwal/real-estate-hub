"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Loader2, 
  Shield, 
  AlertTriangle,
  Users,
  FileCheck,
  Ban,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Package,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AdminContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
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
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Hub4Estate</h1>
                  <p className="text-xs text-muted-foreground">Admin Panel</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
                Admin Access
              </Badge>
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
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold mb-2">
              Admin Dashboard 🛡️
            </h2>
            <p className="text-muted-foreground">
              Manage verifications, resolve disputes, and oversee platform activity
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Total registered</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Abuse Reports</CardTitle>
                <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
                <Activity className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">Good</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="kyc" className="space-y-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4">
              <TabsTrigger value="kyc">KYC Queue</TabsTrigger>
              <TabsTrigger value="disputes">Disputes</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            {/* KYC Verification Queue */}
            <TabsContent value="kyc" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>KYC Verification Queue</CardTitle>
                      <CardDescription>Review and approve provider verification documents</CardDescription>
                    </div>
                    <Badge variant="secondary">0 Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <FileCheck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No pending verifications</h3>
                    <p className="text-sm text-muted-foreground">
                      KYC submissions will appear here for review
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Verified</CardTitle>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                    <XCircle className="w-4 h-4 text-red-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Avg. Review Time</CardTitle>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">--</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Disputes & Reports */}
            <TabsContent value="disputes" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Abuse Reports & Disputes</CardTitle>
                      <CardDescription>Review flagged content and resolve conflicts</CardDescription>
                    </div>
                    <Badge variant="destructive">0 Critical</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No active disputes</h3>
                    <p className="text-sm text-muted-foreground">
                      Reported issues will appear here for moderation
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* User Management */}
            <TabsContent value="users" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>View, search, and manage user accounts</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No users yet</h3>
                    <p className="text-sm text-muted-foreground">
                      User accounts will be listed here
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* User Stats */}
              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Consumers</CardTitle>
                    <Users className="w-4 h-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Providers</CardTitle>
                    <Package className="w-4 h-4 text-purple-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Active Today</CardTitle>
                    <Activity className="w-4 h-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">0</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Content Management */}
            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Content & Placements</CardTitle>
                  <CardDescription>Manage homepage promotions and featured listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">Featured Providers</p>
                          <p className="text-sm text-muted-foreground">0 active placements</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Package className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">Featured Catalogs</p>
                          <p className="text-sm text-muted-foreground">0 active placements</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium">Community Posts</p>
                          <p className="text-sm text-muted-foreground">Moderate flagged content</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Review</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent">
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Shield className="w-6 h-6" />
                  <span className="text-sm">Verify Provider</span>
                </Button>

                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Ban className="w-6 h-6" />
                  <span className="text-sm">Ban User</span>
                </Button>

                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <Star className="w-6 h-6" />
                  <span className="text-sm">Feature Content</span>
                </Button>

                <Button variant="outline" className="h-auto flex-col gap-2 py-4">
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm">View Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

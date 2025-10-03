"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Search, 
  MessageSquare, 
  FolderKanban, 
  TrendingUp,
  Package,
  ArrowRight,
  Bookmark,
  FileText,
  Bot,
  Plus,
  Eye,
  Clock,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    } else if (session?.user) {
      // Show tooltip for first-time users
      const hasSeenTooltip = localStorage.getItem("dashboard_tooltip_seen");
      if (!hasSeenTooltip) {
        setShowTooltip(true);
        setTimeout(() => {
          localStorage.setItem("dashboard_tooltip_seen", "true");
          setShowTooltip(false);
        }, 5000);
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
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xl">H</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">Hub4Estate</h1>
                  <p className="text-xs text-muted-foreground">Consumer Dashboard</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/community">Community</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/knowledge/blogs">Knowledge</Link>
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
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {session.user.name}! 👋
              </h2>
              <p className="text-muted-foreground">
                Manage your projects, requests, and saved items
              </p>
            </div>
            <Button size="lg" className="relative" asChild>
              <Link href="/catalogs">
                <Search className="w-5 h-5 mr-2" />
                Browse Catalogs
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-16 right-0 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm shadow-lg whitespace-nowrap"
                  >
                    👆 Click here to start exploring!
                  </motion.div>
                )}
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Requests</CardTitle>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">No active RFQs</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Saved Items</CardTitle>
                <Bookmark className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Start saving products</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Projects</CardTitle>
                <FolderKanban className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Create your first project</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0</div>
                <p className="text-xs text-muted-foreground">Compare quotes to save</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Modules */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* My Requests */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Requests</CardTitle>
                    <CardDescription>Track open, shortlisted, and closed deals</CardDescription>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/rfq/new">
                      <Plus className="w-4 h-4 mr-2" />
                      New Request
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No requests yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Post your first request to get quotes from verified providers
                  </p>
                  <Button asChild>
                    <Link href="/catalogs">
                      Browse Catalogs <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant Widget */}
            <Card className="bg-gradient-to-br from-primary/10 to-purple-500/10 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Ask Hub AI
                </CardTitle>
                <CardDescription>Get instant policy and process guidance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">Try asking:</p>
                <div className="space-y-2">
                  <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-accent transition-colors text-sm">
                    🏠 How to convert land to residential?
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-accent transition-colors text-sm">
                    💡 Find luxury architects near me
                  </button>
                  <button className="w-full text-left p-3 rounded-lg bg-background hover:bg-accent transition-colors text-sm">
                    📋 What documents for property registration?
                  </button>
                </div>
                <Button className="w-full" variant="default">
                  Open AI Assistant
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Saved Catalogs & Projects */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Saved Catalogs & Boards</CardTitle>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href="/catalogs">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Bookmark className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Start saving products you like for easy access
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Ongoing Projects</CardTitle>
                  <Button size="sm" variant="ghost" asChild>
                    <Link href="/projects">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FolderKanban className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a project to organize tasks, docs, and budget
                  </p>
                  <Button size="sm" asChild>
                    <Link href="/projects/new">
                      <Plus className="w-4 h-4 mr-2" />
                      Start First Project
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Getting Started Guide */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Getting Started with Hub4Estate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h4 className="font-semibold">Search Products</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Browse 10,000+ verified products and materials
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h4 className="font-semibold">Request Quotes</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Get competitive quotes from verified suppliers
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h4 className="font-semibold">Manage Projects</h4>
                  </div>
                  <p className="text-sm text-muted-foreground pl-10">
                    Track everything in your project workspace
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
"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Loader2, 
  Search, 
  MessageSquare, 
  FolderKanban, 
  TrendingUp,
  Package,
  ArrowRight 
} from "lucide-react";

export default function DashboardPage() {
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

  const quickActions = [
    {
      icon: Search,
      title: "Search Catalogs",
      description: "Find materials and products",
      href: "/catalogs",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Request Quotes",
      description: "Get instant quotes from providers",
      href: "/rfq",
      gradient: "from-green-500 to-green-600",
    },
    {
      icon: FolderKanban,
      title: "My Projects",
      description: "Manage your projects",
      href: "/projects",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Package,
      title: "My Orders",
      description: "Track your orders",
      href: "/orders",
      gradient: "from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      {/* Simple Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Hub4Estate</h1>
                <p className="text-xs text-muted-foreground">Dashboard</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              Home
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, {session.user.name}! 👋
            </h2>
            <p className="text-lg text-muted-foreground">
              What would you like to do today?
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${action.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />
                  
                  {/* Card */}
                  <div className="relative bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all cursor-pointer h-full">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium">
                      Get Started <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6"
          >
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Active Projects</h3>
                <FolderKanban className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">No projects yet</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Pending Quotes</h3>
                <MessageSquare className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">0</p>
              <p className="text-xs text-muted-foreground mt-1">All caught up!</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">Total Savings</h3>
                <TrendingUp className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-3xl font-bold">₹0</p>
              <p className="text-xs text-muted-foreground mt-1">Start comparing quotes</p>
            </div>
          </motion.div>

          {/* Getting Started Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">Get Started with Hub4Estate</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="font-semibold">Search Products</h4>
                <p className="text-sm text-muted-foreground">
                  Browse 10,000+ verified products and materials
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="font-semibold">Request Quotes</h4>
                <p className="text-sm text-muted-foreground">
                  Get competitive quotes from verified suppliers
                </p>
              </div>
              <div className="space-y-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="font-semibold">Manage Projects</h4>
                <p className="text-sm text-muted-foreground">
                  Track everything in your project workspace
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
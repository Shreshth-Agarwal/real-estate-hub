"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, FolderKanban, MessageCircle, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

export default function CommunityProjects() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleJoinCommunity = () => {
    if (session?.user) {
      router.push("/community");
    } else {
      router.push("/sign-up");
    }
  };

  const handleCreateProject = () => {
    if (session?.user) {
      router.push("/projects");
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <section className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="text-primary">Connect</span> & <span className="text-primary">collaborate</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join the community. Manage projects. Share knowledge.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Community */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Community</h3>
                <p className="text-sm text-muted-foreground">LinkedIn for real estate</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Join Groups</p>
                  <p className="text-xs text-muted-foreground">Connect with professionals in your city</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">Share Updates</p>
                  <p className="text-xs text-muted-foreground">Post about new products or services</p>
                </div>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleJoinCommunity}>
              Join Community
            </Button>
          </motion.div>

          {/* Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-xl">Project Workspace</h3>
                <p className="text-sm text-muted-foreground">Your command center</p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">✅ Track Tasks & Budgets</p>
                <p className="text-xs text-muted-foreground">Stay organized with project management tools</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">📁 Store Documents</p>
                <p className="text-xs text-muted-foreground">Keep all receipts and contracts in one place</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-1">👥 Collaborate with Team</p>
                <p className="text-xs text-muted-foreground">Invite contractors and share updates</p>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleCreateProject}>
              Create Project
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
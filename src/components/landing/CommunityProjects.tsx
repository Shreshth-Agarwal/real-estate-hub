"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle, Heart, FolderKanban, CheckSquare, FileText } from "lucide-react";

export default function CommunityProjects() {
  const communityPosts = [
    {
      author: "Amit Kumar",
      avatar: "AK",
      time: "2 hours ago",
      content: "Just completed my home renovation! The materials from verified vendors saved me 20%. Happy to share my experience!",
      likes: 24,
      comments: 8,
    },
    {
      author: "Priya Sharma",
      avatar: "PS",
      time: "5 hours ago",
      content: "Looking for recommendations for waterproofing contractors in Bangalore. Anyone worked with good professionals recently?",
      likes: 15,
      comments: 12,
    },
  ];

  const projectFeatures = [
    { icon: FolderKanban, title: "Project Workspace", desc: "Organize everything in one place" },
    { icon: CheckSquare, title: "Task Management", desc: "Track progress & milestones" },
    { icon: FileText, title: "Document Storage", desc: "Bills, receipts & contracts" },
    { icon: Users, title: "Team Collaboration", desc: "Invite contractors & family" },
  ];

  return (
    <section id="community" className="py-20 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Build together, <span className="text-primary">grow together</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect with others, share experiences, and manage your projects with powerful collaboration tools
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Community Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Community</h3>
                <p className="text-sm text-muted-foreground">Learn from 50K+ members</p>
              </div>
            </div>

            {/* Sample Posts */}
            <div className="space-y-4 mb-6">
              {communityPosts.map((post, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {post.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{post.author}</div>
                      <div className="text-xs text-muted-foreground">{post.time}</div>
                    </div>
                  </div>
                  <p className="text-sm mb-4 text-muted-foreground">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Community Stats */}
            <div className="grid grid-cols-3 gap-4 p-5 bg-muted/50 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-xs text-muted-foreground">Members</div>
              </div>
              <div className="text-center border-x border-border">
                <div className="text-2xl font-bold text-primary">2K+</div>
                <div className="text-xs text-muted-foreground">Daily Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-xs text-muted-foreground">Get Answers</div>
              </div>
            </div>
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Project Workspace</h3>
                <p className="text-sm text-muted-foreground">Manage from start to finish</p>
              </div>
            </div>

            {/* Project Features */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {projectFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-semibold text-sm mb-1">{feature.title}</div>
                  <div className="text-xs text-muted-foreground">{feature.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* Sample Project Card */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">My Home Renovation</h4>
                <div className="px-3 py-1 rounded-full bg-green-500/10 text-green-600 text-xs font-medium">
                  In Progress
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Overall Progress</span>
                  <span className="font-medium">65%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: "65%" }} />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Tasks</div>
                  <div className="font-semibold">12/18</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Team</div>
                  <div className="font-semibold">5 members</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Budget</div>
                  <div className="font-semibold">₹8.5L</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Button size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            Join the Community
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
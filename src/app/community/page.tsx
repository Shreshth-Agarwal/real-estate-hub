"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  PlusCircle, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  Image as ImageIcon,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed");

  const posts = [
    {
      id: 1,
      author: {
        name: "Rajesh Kumar",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
        verified: true,
        title: "Marble Supplier"
      },
      content: "Just launched our new Italian marble collection! 🎉 Premium quality at competitive prices. Available in 50+ designs.",
      images: [],
      likes: 24,
      comments: 8,
      shares: 3,
      timestamp: "2 hours ago",
      tags: ["marble", "premium", "newlaunch"]
    },
    {
      id: 2,
      author: {
        name: "Priya Sharma",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
        verified: true,
        title: "Interior Designer"
      },
      content: "Looking for reliable contractors in Jaipur for a luxury villa project. Budget: ₹2Cr. DM if interested.",
      images: [],
      likes: 45,
      comments: 23,
      shares: 12,
      timestamp: "5 hours ago",
      tags: ["collaboration", "jaipur", "luxury"]
    }
  ];

  const groups = [
    {
      id: 1,
      name: "Delhi Real Estate Professionals",
      members: 2456,
      posts: 1234,
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=delhi",
      category: "Regional"
    },
    {
      id: 2,
      name: "Luxury Interior Designers",
      members: 892,
      posts: 567,
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=luxury",
      category: "Professional"
    },
    {
      id: 3,
      name: "Material Suppliers Network",
      members: 3421,
      posts: 2891,
      image: "https://api.dicebear.com/7.x/shapes/svg?seed=material",
      category: "Business"
    }
  ];

  const trendingTopics = [
    { tag: "RERA2024", posts: 234 },
    { tag: "SustainableHousing", posts: 189 },
    { tag: "SmartHomes", posts: 156 },
    { tag: "InvestmentTips", posts: 134 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-16">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Community</h1>
              <p className="text-sm text-muted-foreground">
                Connect with 50,000+ real estate professionals
              </p>
            </div>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4">Your Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Posts</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Followers</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Following</span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending Topics
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic) => (
                  <button
                    key={topic.tag}
                    className="w-full text-left hover:bg-accent rounded-lg p-2 transition-colors"
                  >
                    <div className="font-medium">#{topic.tag}</div>
                    <div className="text-xs text-muted-foreground">
                      {topic.posts} posts
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="feed" className="flex-1">Feed</TabsTrigger>
                <TabsTrigger value="posts" className="flex-1">My Posts</TabsTrigger>
                <TabsTrigger value="saved" className="flex-1">Saved</TabsTrigger>
              </TabsList>

              <TabsContent value="feed" className="space-y-6 mt-6">
                {/* Create Post Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <span className="text-primary-foreground font-semibold">Y</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Share your thoughts..."
                      className="flex-1 bg-muted rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                      readOnly
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </motion.div>

                {/* Posts */}
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                    className="bg-card border border-border rounded-xl p-6"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{post.author.name}</h4>
                            {post.author.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {post.author.title} • {post.timestamp}
                          </p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Post Content */}
                    <p className="mb-4">{post.content}</p>

                    {/* Tags */}
                    <div className="flex gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center gap-6 pt-4 border-t border-border">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Share2 className="w-4 h-4" />
                        {post.shares}
                      </Button>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              <TabsContent value="posts" className="mt-6">
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Share your first post with the community
                  </p>
                  <Button>Create Post</Button>
                </div>
              </TabsContent>

              <TabsContent value="saved" className="mt-6">
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No saved posts</h3>
                  <p className="text-muted-foreground">
                    Posts you save will appear here
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Groups */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Groups
                </h3>
                <Link href="/community/groups">
                  <Button variant="ghost" size="sm">See all</Button>
                </Link>
              </div>
              <div className="space-y-3">
                {groups.map((group) => (
                  <button
                    key={group.id}
                    className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                  >
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-10 h-10 rounded-lg"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-medium text-sm">{group.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {group.members.toLocaleString()} members
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </motion.div>

            {/* Suggested Connections */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4">Suggested Connections</h3>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">User {i}</div>
                      <div className="text-xs text-muted-foreground">
                        Professional
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Follow
                    </Button>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
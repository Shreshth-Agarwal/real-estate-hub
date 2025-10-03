"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Plus,
  CheckCircle2,
  Circle,
  Paperclip,
  MessageSquare,
  Users,
  Calendar,
  DollarSign,
  MoreVertical,
  Download,
  Upload,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("tasks");

  const project = {
    id: params.id,
    title: "Villa Construction - Jaipur",
    description: "3 BHK luxury villa with modern amenities",
    status: "in_progress",
    progress: 65,
    budget: 5000000,
    spent: 3250000,
    deadline: "2024-12-15"
  };

  const tasks = [
    { id: 1, title: "Foundation work", status: "completed", assignee: "Team A", dueDate: "2024-08-15" },
    { id: 2, title: "Plumbing installation", status: "in_progress", assignee: "Team B", dueDate: "2024-10-20" },
    { id: 3, title: "Electrical wiring", status: "in_progress", assignee: "Team C", dueDate: "2024-10-25" },
    { id: 4, title: "Interior finishing", status: "pending", assignee: "Team D", dueDate: "2024-11-15" },
    { id: 5, title: "Final inspection", status: "pending", assignee: "Team A", dueDate: "2024-12-10" }
  ];

  const documents = [
    { id: 1, name: "Project Blueprint.pdf", size: "2.4 MB", uploadedBy: "John Doe", date: "2024-08-01" },
    { id: 2, name: "Material Invoice.pdf", size: "156 KB", uploadedBy: "Jane Smith", date: "2024-09-15" },
    { id: 3, name: "Progress Photos.zip", size: "15.2 MB", uploadedBy: "Team Lead", date: "2024-10-01" }
  ];

  const team = [
    { id: 1, name: "Rajesh Kumar", role: "Project Manager", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh" },
    { id: 2, name: "Priya Sharma", role: "Architect", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
    { id: 3, name: "Amit Patel", role: "Contractor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit" },
    { id: 4, name: "Sarah Williams", role: "Interior Designer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" }
  ];

  const catalogItems = [
    { id: 1, name: "Italian Marble - White Carrara", quantity: "200 sq ft", price: 250000, status: "ordered" },
    { id: 2, name: "Premium Tiles - Bathroom", quantity: "150 sq ft", price: 45000, status: "delivered" },
    { id: 3, name: "Modular Kitchen - Complete Set", quantity: "1 set", price: 350000, status: "pending" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-16">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/projects")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{project.title}</h1>
                <p className="text-sm text-muted-foreground">{project.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Users className="w-4 h-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Progress Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-6 mb-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Project Progress</h3>
                <Badge>{project.progress}% Complete</Badge>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">₹{(project.spent / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-muted-foreground">Spent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">₹{(project.budget / 100000).toFixed(1)}L</div>
                  <div className="text-sm text-muted-foreground">Budget</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{Math.ceil((new Date(project.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
              </div>
            </motion.div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="tasks" className="flex-1">Tasks</TabsTrigger>
                <TabsTrigger value="catalog" className="flex-1">Catalog Items</TabsTrigger>
                <TabsTrigger value="docs" className="flex-1">Documents</TabsTrigger>
                <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
              </TabsList>

              {/* Tasks Tab */}
              <TabsContent value="tasks" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Tasks ({tasks.length})</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                  </Button>
                </div>

                {tasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <button className="mt-1">
                        {task.status === "completed" ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <span>{task.assignee}</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{task.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        task.status === "completed" ? "default" :
                        task.status === "in_progress" ? "secondary" : "outline"
                      }>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              {/* Catalog Items Tab */}
              <TabsContent value="catalog" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Catalog Items ({catalogItems.length})</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {catalogItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium mb-1">{item.name}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Qty: {item.quantity}</span>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            <span>₹{(item.price / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        item.status === "delivered" ? "default" :
                        item.status === "ordered" ? "secondary" : "outline"
                      }>
                        {item.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="docs" className="space-y-4 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Documents ({documents.length})</h3>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>

                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-card border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                          <Paperclip className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{doc.name}</h4>
                          <div className="text-sm text-muted-foreground">
                            {doc.size} • Uploaded by {doc.uploadedBy} • {doc.date}
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat" className="mt-6">
                <div className="bg-card border border-border rounded-xl h-[500px] flex flex-col">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold">Project Chat</h3>
                    <p className="text-sm text-muted-foreground">Collaborate with your team</p>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="text-center text-muted-foreground py-8">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No messages yet. Start a conversation!</p>
                    </div>
                  </div>

                  <div className="p-4 border-t border-border">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 bg-muted rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Button>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Team Members */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Team Members</h3>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {team.map((member) => (
                  <div key={member.id} className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4">Project Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge>In Progress</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Started</span>
                  <span className="text-sm font-medium">Aug 1, 2024</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Deadline</span>
                  <span className="text-sm font-medium">{project.deadline}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <span className="text-sm font-medium">Jaipur, India</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
                  Archive Project
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
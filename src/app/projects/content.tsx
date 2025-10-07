"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  FolderKanban, 
  Grid3x3,
  List,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function ProjectsContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const projects = [
    {
      id: 1,
      title: "Villa Construction - Jaipur",
      description: "3 BHK luxury villa with modern amenities",
      status: "in_progress",
      progress: 65,
      budget: 5000000,
      spent: 3250000,
      tasks: { total: 45, completed: 29 },
      team: 8,
      deadline: "2024-12-15",
      color: "blue"
    },
    {
      id: 2,
      title: "Office Renovation - Gurgaon",
      description: "5000 sq ft office space interior",
      status: "planning",
      progress: 15,
      budget: 2500000,
      spent: 375000,
      tasks: { total: 23, completed: 3 },
      team: 5,
      deadline: "2024-11-30",
      color: "green"
    },
    {
      id: 3,
      title: "Apartment Interiors",
      description: "2 BHK apartment interior design",
      status: "completed",
      progress: 100,
      budget: 800000,
      spent: 780000,
      tasks: { total: 18, completed: 18 },
      team: 4,
      deadline: "2024-09-01",
      color: "purple"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "planning":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Planning</Badge>;
      case "in_progress":
        return <Badge><AlertCircle className="w-3 h-3 mr-1" /> In Progress</Badge>;
      case "completed":
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background pt-16">
      {/* Header */}
      <div className="border-b border-border bg-background/80 backdrop-blur-lg sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Projects</h1>
              <p className="text-muted-foreground">
                Manage your construction and renovation projects
              </p>
            </div>
            <Button size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
          </div>

          {/* Filters and View Toggle */}
          <div className="flex items-center justify-between mt-6">
            <Tabs defaultValue="all" className="w-auto">
              <TabsList>
                <TabsTrigger value="all">All Projects</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-10 pr-4 py-2 bg-muted rounded-lg border-0 outline-none focus:ring-2 focus:ring-primary w-[250px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <div className="flex border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Projects</h3>
              <FolderKanban className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-3xl font-bold">{projects.length}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">In Progress</h3>
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">
              {projects.filter(p => p.status === "in_progress").length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl font-bold">
              {projects.filter(p => p.status === "completed").length}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
              <span className="text-xl">₹</span>
            </div>
            <p className="text-3xl font-bold">
              {(projects.reduce((acc, p) => acc + p.budget, 0) / 100000).toFixed(1)}L
            </p>
          </motion.div>
        </div>

        {/* Projects Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all cursor-pointer group h-full">
                    {/* Color Bar */}
                    <div className={`h-2 bg-gradient-to-r from-${project.color}-500 to-${project.color}-600`} />
                    
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                            {project.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Status */}
                      <div className="mb-4">
                        {getStatusBadge(project.status)}
                      </div>

                      {/* Progress */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r from-${project.color}-500 to-${project.color}-600 transition-all`}
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Budget</div>
                          <div className="font-semibold">₹{(project.budget / 100000).toFixed(1)}L</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Spent</div>
                          <div className="font-semibold">₹{(project.spent / 100000).toFixed(1)}L</div>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{project.tasks.completed}/{project.tasks.total}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{project.team}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/projects/${project.id}`}>
                  <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div className={`w-16 h-16 rounded-lg bg-gradient-to-br from-${project.color}-500 to-${project.color}-600 flex items-center justify-center`}>
                          <FolderKanban className="w-8 h-8 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{project.title}</h3>
                            {getStatusBadge(project.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {project.description}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>{project.tasks.completed}/{project.tasks.total} tasks</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>{project.team} members</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>Due {new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-sm text-muted-foreground mb-1">Progress</div>
                          <div className="text-2xl font-bold">{project.progress}%</div>
                          <div className="text-xs text-muted-foreground mt-2">
                            ₹{(project.spent / 100000).toFixed(1)}L / ₹{(project.budget / 100000).toFixed(1)}L
                          </div>
                        </div>
                      </div>

                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

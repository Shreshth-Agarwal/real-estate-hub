"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  CheckCircle,
  Circle,
  Upload,
  Users,
  Plus,
  FileText,
  Calendar,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  id: number;
  title: string;
  address: string;
  city: string;
  budget: number | null;
  currency: string;
  status: string;
  createdAt: string;
}

interface Task {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: string;
  assignedTo: number | null;
  dueDate: string | null;
  createdAt: string;
}

interface Doc {
  id: number;
  projectId: number;
  title: string;
  docUrl: string;
  uploadedBy: number;
  createdAt: string;
}

interface Member {
  id: number;
  projectId: number;
  userId: number;
  role: string;
  joinedAt: string;
  userName?: string;
}

export default function ProjectWorkspaceContent() {
  const params = useParams();
  const projectId = parseInt(params.id as string);

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

  const fetchProjectData = async () => {
    try {
      const token = localStorage.getItem("bearer_token");
      
      // Fetch project details
      const projectRes = await fetch(`/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (projectRes.ok) {
        const projectData = await projectRes.json();
        setProject(projectData.project);
      }

      // Fetch tasks
      const tasksRes = await fetch(`/api/project-tasks?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      // Fetch docs
      const docsRes = await fetch(`/api/project-docs?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (docsRes.ok) {
        const docsData = await docsRes.json();
        setDocs(docsData.docs || []);
      }

      // Fetch members
      const membersRes = await fetch(`/api/project-members?projectId=${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (membersRes.ok) {
        const membersData = await membersRes.json();
        setMembers(membersData.members || []);
      }
    } catch (error) {
      toast.error("Failed to load project data");
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/project-tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          title: newTaskTitle,
          description: newTaskDesc || null,
          status: "pending",
        }),
      });

      if (!response.ok) throw new Error("Failed to add task");

      toast.success("Task added successfully!");
      setNewTaskTitle("");
      setNewTaskDesc("");
      fetchProjectData();
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const toggleTaskStatus = async (taskId: number, currentStatus: string) => {
    const newStatus =
      currentStatus === "pending"
        ? "in_progress"
        : currentStatus === "in_progress"
        ? "completed"
        : "pending";

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch(`/api/project-tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task");

      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const uploadDoc = async () => {
    if (!newDocTitle.trim()) {
      toast.error("Please enter a document title");
      return;
    }

    try {
      const token = localStorage.getItem("bearer_token");
      const mockUrl = `https://storage.example.com/${newDocTitle}.pdf`;

      const response = await fetch("/api/project-docs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          title: newDocTitle,
          docUrl: mockUrl,
        }),
      });

      if (!response.ok) throw new Error("Failed to upload document");

      toast.success("Document uploaded successfully!");
      setNewDocTitle("");
      fetchProjectData();
    } catch (error) {
      toast.error("Failed to upload document");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
          <p className="text-muted-foreground">
            {project.address}, {project.city}
          </p>
          {project.budget && (
            <p className="text-sm mt-1">
              Budget: {project.currency} {project.budget.toLocaleString()}
            </p>
          )}
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-3">
                <Input
                  placeholder="Task title"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Task description (optional)"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  rows={2}
                />
                <Button onClick={addTask}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>
            </Card>

            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task.id, task.status)}
                      className="mt-0.5"
                    >
                      {task.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Circle className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${
                          task.status === "completed"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="capitalize">{task.status}</span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="docs" className="space-y-4">
            <Card className="p-4">
              <div className="space-y-3">
                <Input
                  placeholder="Document title"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                />
                <Button onClick={uploadDoc}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </Button>
              </div>
            </Card>

            <div className="space-y-3">
              {docs.map((doc) => (
                <Card key={doc.id} className="p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-semibold">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-4">
            <Card className="p-4">
              <Button>
                <Users className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </Card>

            <div className="space-y-3">
              {members.map((member) => (
                <Card key={member.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {member.userName || `User ${member.userId}`}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {member.role}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

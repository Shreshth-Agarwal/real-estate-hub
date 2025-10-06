"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Send, 
  Bot, 
  BookOpen, 
  MapPin, 
  MessageSquare,
  Sparkles,
  FileText,
  Scale,
  Package,
  Users,
  Loader2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

type BotMode = "knowledge" | "procurement" | "expert" | "dispute" | "general";

interface Message {
  role: "user" | "assistant";
  content: string;
  mode?: BotMode;
  sources?: string[];
  disclaimer?: string;
}

const botModes = [
  {
    id: "knowledge" as BotMode,
    name: "Policy & Laws",
    icon: Scale,
    description: "Real estate laws, RERA, land conversion",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10"
  },
  {
    id: "procurement" as BotMode,
    name: "Materials",
    icon: Package,
    description: "Find materials, get quotes",
    color: "text-green-500",
    bgColor: "bg-green-500/10"
  },
  {
    id: "expert" as BotMode,
    name: "Professionals",
    icon: Users,
    description: "Connect with verified experts",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10"
  },
  {
    id: "dispute" as BotMode,
    name: "Disputes",
    icon: FileText,
    description: "Complaint and legal guidance",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10"
  }
];

export default function KnowledgePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<BotMode>("general");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      mode: selectedMode
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          mode: selectedMode,
          history: messages.slice(-4).map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response || "Sorry, I couldn't process that request.",
        mode: selectedMode,
        sources: data.sources,
        disclaimer: data.disclaimer
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        mode: selectedMode
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModeChange = (mode: BotMode) => {
    setSelectedMode(mode);
    const modeInfo = botModes.find(m => m.id === mode);
    if (modeInfo && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `Hi! I'm your ${modeInfo.name} assistant. ${modeInfo.description}. How can I help you today?`,
        mode
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/60 rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">H</span>
              </div>
              <span className="font-bold text-xl">Hub4Estate</span>
            </Link>
            <div className="flex items-center gap-3">
              {session?.user ? (
                <Link href="/dashboard">
                  <Button variant="outline">Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link href="/sign-up">
                    <Button>Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 mb-6"
            >
              <Sparkles className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Knowledge Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your AI-powered guide to real estate regulations, city insights, and expert knowledge
            </p>
          </div>

          <Tabs defaultValue="chatbot" className="space-y-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="chatbot">
                <Bot className="w-4 h-4 mr-2" />
                AI Assistant
              </TabsTrigger>
              <TabsTrigger value="blogs">
                <BookOpen className="w-4 h-4 mr-2" />
                Blogs
              </TabsTrigger>
              <TabsTrigger value="city">
                <MapPin className="w-4 h-4 mr-2" />
                City Insights
              </TabsTrigger>
            </TabsList>

            {/* AI Chatbot Tab */}
            <TabsContent value="chatbot" className="space-y-6">
              {/* Bot Mode Selection */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {botModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <motion.div
                      key={mode.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all ${
                          selectedMode === mode.id
                            ? "ring-2 ring-primary"
                            : "hover:shadow-lg"
                        }`}
                        onClick={() => handleModeChange(mode.id)}
                      >
                        <CardContent className="p-6 text-center">
                          <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${mode.bgColor} flex items-center justify-center`}>
                            <Icon className={`w-6 h-6 ${mode.color}`} />
                          </div>
                          <h3 className="font-semibold mb-1">{mode.name}</h3>
                          <p className="text-xs text-muted-foreground">{mode.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Chat Interface */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    HubAI Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about real estate, laws, materials, or professionals
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <div className="h-[500px] overflow-y-auto space-y-4 p-4 bg-muted/20 rounded-lg">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                        <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">Start a conversation</p>
                        <p className="text-sm">Select a topic above and ask your question</p>
                      </div>
                    ) : (
                      messages.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-background border"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                            {message.sources && message.sources.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-border/50">
                                <p className="text-xs font-semibold mb-2">Sources:</p>
                                <ul className="text-xs space-y-1">
                                  {message.sources.map((source, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                      <span className="opacity-50">•</span>
                                      <span>{source}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {message.disclaimer && (
                              <div className="mt-3 pt-3 border-t border-border/50">
                                <p className="text-xs opacity-70">⚠️ {message.disclaimer}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-background border rounded-lg p-4">
                          <Loader2 className="w-5 h-5 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Ask your question..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Blogs Tab */}
            <TabsContent value="blogs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Expert Articles & Guides
                  </CardTitle>
                  <CardDescription>
                    In-depth guides and articles on real estate topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-4">Browse our knowledge base</p>
                  <Link href="/knowledge/blogs">
                    <Button>
                      View All Blogs
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            {/* City Insights Tab */}
            <TabsContent value="city" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    City-Specific Information
                  </CardTitle>
                  <CardDescription>
                    Regional regulations, contacts, and planning documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <MapPin className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-4">Explore city insights and regulations</p>
                  <Link href="/knowledge/city-insights">
                    <Button>
                      View City Insights
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Links */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Common Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedMode("knowledge");
                    setInput("How to convert agricultural land to residential?");
                  }}
                  className="text-sm text-left hover:text-primary transition-colors w-full"
                >
                  → Land conversion process
                </button>
                <button
                  onClick={() => {
                    setSelectedMode("knowledge");
                    setInput("What is RERA and how does it protect buyers?");
                  }}
                  className="text-sm text-left hover:text-primary transition-colors w-full"
                >
                  → Understanding RERA
                </button>
                <button
                  onClick={() => {
                    setSelectedMode("procurement");
                    setInput("I need ceramic tiles for 2000 sq ft");
                  }}
                  className="text-sm text-left hover:text-primary transition-colors w-full"
                >
                  → Getting material quotes
                </button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Featured Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/knowledge/blogs" className="block text-sm hover:text-primary transition-colors">
                  → Property Registration Guide
                </Link>
                <Link href="/knowledge/blogs" className="block text-sm hover:text-primary transition-colors">
                  → Tax Benefits for Homebuyers
                </Link>
                <Link href="/knowledge/city-insights" className="block text-sm hover:text-primary transition-colors">
                  → Jaipur Master Plan 2025
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need More Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Can't find what you're looking for? Our community is here to help.
                </p>
                <Link href="/community">
                  <Button variant="outline" className="w-full">
                    Join Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
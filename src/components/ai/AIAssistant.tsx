"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  X,
  Send,
  BookOpen,
  Package,
  Users,
  Scale,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type BotMode = "knowledge" | "procurement" | "expert" | "dispute" | "general";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
  disclaimer?: string;
}

const botModes = {
  general: {
    icon: Sparkles,
    label: "General",
    color: "text-purple-600",
    description: "Ask me anything",
  },
  knowledge: {
    icon: BookOpen,
    label: "Knowledge",
    color: "text-blue-600",
    description: "Laws & regulations",
  },
  procurement: {
    icon: Package,
    label: "Procurement",
    color: "text-green-600",
    description: "Find materials",
  },
  expert: {
    icon: Users,
    label: "Expert Finder",
    color: "text-orange-600",
    description: "Find professionals",
  },
  dispute: {
    icon: Scale,
    label: "Disputes",
    color: "text-red-600",
    description: "Resolution help",
  },
};

interface AIAssistantProps {
  defaultMode?: BotMode;
}

export default function AIAssistant({ defaultMode = "general" }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<BotMode>(defaultMode);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm HubAI, your intelligent real estate assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          mode,
          history: messages.slice(-5).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        sources: data.sources,
        disclaimer: data.disclaimer,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (newMode: BotMode) => {
    setMode(newMode);
    const ModeIcon = botModes[newMode].icon;
    setMessages([
      {
        id: Date.now().toString(),
        role: "assistant",
        content: `Switched to ${botModes[newMode].label} mode. ${botModes[newMode].description}.`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="lg"
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-full max-w-md"
          >
            <Card className="shadow-2xl border-2">
              <CardHeader className="border-b bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">HubAI Assistant</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {botModes[mode].label} Mode
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Mode Selector */}
                <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {(Object.keys(botModes) as BotMode[]).map((modeKey) => {
                    const ModeIcon = botModes[modeKey].icon;
                    return (
                      <Button
                        key={modeKey}
                        variant={mode === modeKey ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleModeChange(modeKey)}
                        className="shrink-0"
                      >
                        <ModeIcon className="h-3 w-3 mr-1" />
                        {botModes[modeKey].label}
                      </Button>
                    );
                  })}
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex",
                        message.role === "user" ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-lg px-4 py-2",
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}
                      >
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>

                        {message.sources && message.sources.length > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-xs font-medium mb-1">Sources:</p>
                            {message.sources.map((source, idx) => (
                              <p key={idx} className="text-xs opacity-80">
                                • {source}
                              </p>
                            ))}
                          </div>
                        )}

                        {message.disclaimer && (
                          <div className="mt-2 pt-2 border-t border-border/50">
                            <p className="text-xs italic opacity-70">
                              ⚠️ {message.disclaimer}
                            </p>
                          </div>
                        )}

                        <p className="text-xs opacity-50 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything..."
                      disabled={loading}
                    />
                    <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
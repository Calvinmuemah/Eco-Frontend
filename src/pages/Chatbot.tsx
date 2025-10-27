import { useEffect, useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Trash2,
  RefreshCcw,
  Clock,
  PanelLeftClose,
  PanelLeftOpen,
  MessageSquare,
} from "lucide-react";

interface Message {
  _id?: string;
  role: "user" | "bot";
  content: string;
  timestamp: string | Date;
}

interface SessionPreview {
  id: string;
  lastMessage?: string;
  lastDate?: string;
}

const API_BASE_URL = "http://localhost:5000/api/chat";

// 🧩 Helper for date separators
const formatDateLabel = (date: Date) => {
  const today = new Date();
  const diff = (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (diff < 1 && date.getDate() === today.getDate()) return "Today";
  if (diff < 2 && date.getDate() === today.getDate() - 1) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [pastSessions, setPastSessions] = useState<SessionPreview[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // 🟢 Load or create session (handles old data safely)
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chat_sessions") || "[]");
    const normalized: SessionPreview[] = stored.map((s: any) =>
      typeof s === "string" ? { id: s } : s
    );

    const existingSession = localStorage.getItem("chat_session_id");

    if (existingSession) {
      setSessionId(existingSession);
      fetchChatHistory(existingSession);
    } else {
      const newId = `session_${Date.now()}`;
      const newSession = { id: newId };
      localStorage.setItem("chat_session_id", newId);
      localStorage.setItem(
        "chat_sessions",
        JSON.stringify([newSession, ...normalized])
      );
      setSessionId(newId);
      setMessages([
        {
          role: "bot",
          content:
            "👋 Hello! I'm EcoBot — your water quality companion. Ask me anything about sensors, data, or algae bloom risks!",
          timestamp: new Date(),
        },
      ]);
    }

    setPastSessions(normalized);
  }, []);

  // 🟡 Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔵 Fetch chat history from backend
  const fetchChatHistory = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/history/${id}`);
      const data = await res.json();
      if (res.ok && data.success && data.history.length > 0) {
        setMessages(data.history);
      } else {
        setMessages([
          {
            role: "bot",
            content:
              "🌊 Hi there! I'm EcoBot. You can ask me about water quality, bloom risks, or sensor readings.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // 💬 Send message to backend
  const handleSend = async () => {
    if (!input.trim() || !sessionId) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, message: input }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const botMessage: Message = {
          role: "bot",
          content: data.reply,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        updateSessionPreview(sessionId, botMessage.content);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            content: "⚠️ Sorry, I couldn’t process your message.",
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "❌ Network error. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Start new chat
  const handleClearChat = () => {
    const newSession = `session_${Date.now()}`;
    const newPreview: SessionPreview = { id: newSession };
    localStorage.setItem("chat_session_id", newSession);

    const sessions =
      JSON.parse(localStorage.getItem("chat_sessions") || "[]") || [];
    const updated = [newPreview, ...sessions];
    localStorage.setItem("chat_sessions", JSON.stringify(updated));

    setPastSessions(updated);
    setSessionId(newSession);
    setMessages([
      {
        role: "bot",
        content: "🧼 New chat started. Ask away!",
        timestamp: new Date(),
      },
    ]);
  };

  // 🪄 Update session preview
  const updateSessionPreview = (id: string, lastMessage: string) => {
    const sessions =
      JSON.parse(localStorage.getItem("chat_sessions") || "[]") || [];

    const updatedSessions = sessions.map((s: any) =>
      typeof s === "string"
        ? { id: s }
        : s.id === id
        ? { ...s, lastMessage, lastDate: new Date().toISOString() }
        : s
    );

    localStorage.setItem("chat_sessions", JSON.stringify(updatedSessions));
    setPastSessions(updatedSessions);
  };

  // 🕓 Group messages by date
  const groupedMessages = messages.reduce(
    (acc: Record<string, Message[]>, msg) => {
      const date = new Date(msg.timestamp);
      const key = date.toDateString();
      if (!acc[key]) acc[key] = [];
      acc[key].push(msg);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 container mx-auto px-4 py-8 flex gap-4 relative">
        {/* 🧾 Sidebar - History */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ x: -250, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -250, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-72 bg-muted rounded-lg p-4 shadow-md border absolute md:static left-0 z-20 h-[600px] overflow-y-auto"
            >
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" /> Chat History
              </h2>
              {pastSessions.length === 0 && (
                <p className="text-xs text-muted-foreground">No past chats yet.</p>
              )}
              {pastSessions.map((session) =>
                session?.id ? (
                  <div
                    key={session.id}
                    className={`text-sm mb-2 p-2 rounded cursor-pointer transition-all ${
                      session.id === sessionId
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => {
                      setSessionId(session.id);
                      fetchChatHistory(session.id);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      <span>{session.id.replace("session_", "Session ")}</span>
                    </div>
                    {session.lastMessage && (
                      <p className="text-xs opacity-70 mt-1 line-clamp-1">
                        {session.lastMessage}
                      </p>
                    )}
                    {session.lastDate && (
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(session.lastDate).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                ) : null
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 💬 Chat Panel */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center animate-slide-up">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">EcoBot Chat</h1>
              <p className="text-muted-foreground">
                Talk to EcoBot about water quality, sensors & bloom risks 🌿
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? (
                  <>
                    <PanelLeftClose className="h-4 w-4 mr-1" /> Hide
                  </>
                ) : (
                  <>
                    <PanelLeftOpen className="h-4 w-4 mr-1" /> History
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClearChat}>
                <Trash2 className="h-4 w-4 mr-1" /> New
              </Button>
              <Button
                variant="outline"
                onClick={() => sessionId && fetchChatHistory(sessionId)}
              >
                <RefreshCcw className="h-4 w-4 mr-1" /> Reload
              </Button>
            </div>
          </div>

          <Card className="h-[600px] flex flex-col animate-slide-up">
            <CardHeader className="border-b">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full gradient-water flex items-center justify-center">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle>EcoBot</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto p-4 space-y-6">
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-3"
                  >
                    <span className="text-xs px-3 py-1 bg-muted rounded-full text-muted-foreground">
                      {formatDateLabel(new Date(date))}
                    </span>
                  </motion.div>

                  {msgs.map((message, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${
                        message.role === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {message.role === "bot" && (
                        <div className="h-8 w-8 rounded-full gradient-water flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg p-3 shadow-sm ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </p>
                        <p className="text-[10px] opacity-70 mt-1 text-right">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {message.role === "user" && (
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
              <div ref={scrollRef} />
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about water quality, sensors, or predictions..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  disabled={loading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  className="gradient-water border-0"
                  disabled={!input.trim() || loading}
                >
                  {loading ? (
                    <Send className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                EcoBot can chat in English and Swahili 🌍
              </p>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

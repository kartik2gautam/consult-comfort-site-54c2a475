import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Stethoscope } from "lucide-react";
import ReactMarkdown from "react-markdown";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
}

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message?: string;
  suggestions?: string[];
  doctors?: Doctor[];
}

export default function MarketingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  /* Scroll to bottom when new message arrives */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* Greeting message when chatbot opens */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          type: "bot",
          message:
            "Hello! 👋 I'm the **KANT Healthcare Assistant**.\n\nI can help you with:\n\n• Finding doctors\n• Booking second opinions\n• Consultation charges\n• Uploading medical reports\n\nHow can I assist you today?",
          suggestions: [
            "Find a doctor",
            "Book a second opinion",
            "Consultation charges",
            "Upload medical reports",
          ],
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async (customMsg?: string) => {
    const msg = customMsg || input.trim();
    if (!msg) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", message: msg },
    ]);

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/chatbot/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: msg }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          message: data.message,
          suggestions: data.suggestions,
          doctors: data.doctors,
        },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="
          fixed z-50
          bottom-0 right-0
          w-full h-[100dvh]
          sm:bottom-5 sm:right-5
          sm:w-[380px] sm:h-[75vh]
          md:w-[400px]
          lg:w-[420px]
          bg-white
          flex flex-col
          rounded-none sm:rounded-2xl
          shadow-2xl
        "
        >
          {/* Header */}
          <div className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Stethoscope size={18} />
              <span>KANT Healthcare Assistant</span>
            </div>

            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[85%] sm:max-w-xs">
                  {/* Text Message */}
                  {msg.message && (
                    <div
                      className={`p-3 rounded-xl text-sm shadow ${
                        msg.type === "user"
                          ? "bg-primary text-white"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  )}

                  {/* Doctor Cards */}
                  {msg.doctors && (
                    <div className="space-y-3 mt-2">
                      {msg.doctors.map((doc) => (
                        <div
                          key={doc._id}
                          className="bg-white border rounded-xl p-3 shadow-sm"
                        >
                          <p className="font-semibold text-primary">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doc.specialization}
                          </p>
                          <p className="text-xs text-gray-500">
                            Experience: {doc.experience} years
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {msg.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => sendMessage(s)}
                          className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500 animate-pulse">
                Typing...
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 flex gap-2 bg-white">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              className="flex-1"
            />

            <Button onClick={() => sendMessage()}>
              <Send size={16} />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}
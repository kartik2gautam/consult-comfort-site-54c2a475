import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, Phone, MessageCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  buttons?: Array<{ text: string; action: string }>;
  suggestions?: string[];
  timestamp: Date;
}

interface LeadForm {
  name: string;
  phone: string;
}

export default function MarketingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>({ name: '', phone: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [sessionId] = useState(() => `session-${Date.now()}`);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(
        "👋 Hello! Welcome to KANT Healthcare. How can I help you today?",
        ['View Services', 'Book Consultation', 'Contact Us']
      );
    }
  }, [isOpen]);

  const addBotMessage = (message: string, suggestions?: string[], buttons?: any[]) => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      type: 'bot',
      message,
      suggestions,
      buttons,
      timestamp: new Date()
    }]);
  };

  const addUserMessage = (message: string) => {
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      type: 'user',
      message,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async (msg?: string) => {
    const messageToSend = msg || inputValue.trim();
    
    if (!messageToSend) return;

    addUserMessage(messageToSend);
    setInputValue('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chatbot/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          sessionId,
          ...(leadForm.name && { name: leadForm.name }),
          ...(leadForm.phone && { phone: leadForm.phone })
        })
      });

      const data = await response.json();

      if (data.success) {
        addBotMessage(
          data.message,
          data.suggestions,
          data.buttons
        );

        // Show lead form if new lead was captured
        if (data.leadId && !showLeadForm) {
          setShowLeadForm(false);
          toast({
            title: 'Success',
            description: 'We\'ve saved your information. Our team will contact you soon!'
          });
        }
      } else {
        addBotMessage(data.error || 'Sorry, something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Chat error:', error);
      addBotMessage('Sorry, I encountered an error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleButtonClick = (action: string) => {
    switch (action) {
      case 'NAVIGATE_CONSULTATION':
        window.location.href = '/consultation';
        break;
      case 'NAVIGATE_SECOND_OPINION':
        window.location.href = '/document-upload';
        break;
      case 'SERVICES':
        handleSendMessage('Tell me about your services');
        break;
      case 'PRICING':
        handleSendMessage('What is your pricing?');
        break;
      case 'BOOKING':
        handleSendMessage('How do I book an appointment?');
        break;
      case 'DOCTORS':
        handleSendMessage('Who are your doctors?');
        break;
      case 'CONTACT':
        handleSendMessage('How can I contact you?');
        break;
      default:
        handleSendMessage(action);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leadForm.name || !leadForm.phone) {
      toast({ title: 'Error', description: 'Please fill in all fields' });
      return;
    }

    // Send message with lead data
    await handleSendMessage(`Hi, my name is ${leadForm.name} and my phone is ${leadForm.phone}`);
    setShowLeadForm(false);
    setLeadForm({ name: '', phone: '' });
  };

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gold hover:bg-gold/90 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chatbot Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 z-40 w-96 max-h-[600px] flex flex-col shadow-xl border-2 border-gold/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                <div>
                  <h3 className="font-semibold">KANT Healthcare</h3>
                  <p className="text-xs opacity-90">Usually replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    msg.type === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>

                  {/* Buttons */}
                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.buttons.map((btn, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleButtonClick(btn.action)}
                          className="w-full text-left px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded transition-colors"
                        >
                          {btn.text}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Suggestions */}
                  {msg.suggestions && msg.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.suggestions.map((sugg, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestion(sugg)}
                          className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors"
                        >
                          {sugg}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Lead Form */}
          {showLeadForm && (
            <div className="border-t p-3 bg-gray-50 space-y-2">
              <p className="text-xs font-medium text-gray-600">Share your details:</p>
              <form onSubmit={handleLeadSubmit} className="space-y-2">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                  className="h-8 text-sm"
                />
                <Input
                  type="tel"
                  placeholder="Phone number"
                  value={leadForm.phone}
                  onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                  className="h-8 text-sm"
                />
                <Button type="submit" size="sm" className="w-full h-8 text-sm">
                  Submit
                </Button>
              </form>
            </div>
          )}

          {/* Input */}
          <div className="border-t p-3 flex gap-2 bg-white">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="h-9 text-sm"
              disabled={loading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={loading || !inputValue.trim()}
              size="sm"
              className="h-9 px-3"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </>
  );
}

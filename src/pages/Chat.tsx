import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { chatAPI, Message, Character } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Send, Loader2, Info } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { format } from "date-fns";

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [character, setCharacter] = useState<Character | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!conversationId) return;
    fetchConversation();
    scrollToBottom();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversation = async () => {
    try {
      setIsLoading(true);
      
      // Fetch conversation history
      const { messages } = await chatAPI.getConversationHistory(Number(conversationId));
      setMessages(messages);

      // Fetch character details
      const { conversations } = await chatAPI.getConversations();
      const conversation = conversations.find(c => c.conversation_id === Number(conversationId));
      if (conversation) {
        setCharacter(conversation.character);
      } else {
        toast.error("Character not found.");
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
      toast.error("Failed to load conversation.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim() || !conversationId) return;

    try {
      setIsSending(true);

      // Send message to API
      await chatAPI.sendMessage(Number(conversationId), message);

      // Wait and refresh messages
      await fetchConversation();
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "h:mm a");
    } catch (error) {
      return "";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Layout>
      <div className="container mx-auto h-[calc(100vh-10rem)]">
        <div className="flex flex-col h-full overflow-hidden glass rounded-xl border border-white/20">
          {/* Chat Header */}
          <div className="p-4 border-b border-border flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center flex-1">
              <Avatar className="h-10 w-10 mr-3">
                <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-sm font-medium">
                  {character ? getInitials(character.name) : "AI"}
                </div>
              </Avatar>
              
              <div>
                <h3 className="font-medium text-base">
                  {character?.name || "AI Character"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {character?.profession || "AI Assistant"}
                </p>
              </div>
            </div>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-sm">
                    {character?.description || "An AI assistant to chat with"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="text-xl font-medium mb-2">Start a Conversation</h3>
                <p className="text-muted-foreground max-w-md">
                  Send a message to begin chatting with {character?.name || "your AI character"}.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  const showDate = index === 0 || new Date(msg.created_at).getDate() !== new Date(messages[index - 1].created_at).getDate();
                  
                  return (
                    <div key={msg.id || index}>
                      {showDate && (
                        <div className="flex justify-center my-4">
                          <div className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                            {format(new Date(msg.created_at), "MMMM d, yyyy")}
                          </div>
                        </div>
                      )}
                      
                      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[80%] lg:max-w-[70%] rounded-2xl p-4 message-bubble ${isUser ? "bg-primary text-primary-foreground rounded-tr-none" : "glass rounded-tl-none"}`}>
                          <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                          <div className={`text-[10px] mt-1 ${isUser ? "text-primary-foreground/60" : "text-muted-foreground"} text-right`}>
                            {formatDate(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="p-4 border-t border-border">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
              <Textarea 
                placeholder={`Message ${character?.name || "AI"}...`} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                className="resize-none min-h-[60px] max-h-[200px] bg-white/40"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (message.trim() && !isSending) {
                      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                    }
                  }
                }}
                disabled={isSending}
              />
              <Button 
                type="submit" 
                size="icon"
                className="h-[60px] w-[60px] shrink-0"
                disabled={!message.trim() || isSending}
              >
                {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Chat;

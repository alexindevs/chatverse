
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { chatAPI, Conversation } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Search, MessageSquare, Clock } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const Conversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const data = await chatAPI.getConversations();
        setConversations(data.conversations);
        setFilteredConversations(data.conversations);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredConversations(conversations);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = conversations.filter(
        (conversation) =>
          conversation.character.name.toLowerCase().includes(query) ||
          (conversation.last_message && conversation.last_message.content.toLowerCase().includes(query))
      );
      setFilteredConversations(filtered);
    }
  }, [searchQuery, conversations]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // If date is today, show time
    if (date.toDateString() === now.toDateString()) {
      return format(date, "h:mm a");
    }
    
    // If date is within the last week, show relative time
    if (now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    // Otherwise, show full date
    return format(date, "MMM d, yyyy");
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
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Conversations</h1>
            <p className="text-muted-foreground">
              Continue your chats with AI characters
            </p>
          </div>
          
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 w-full md:w-[260px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="mb-4 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No conversations found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try a different search term or clear your search"
                : "Start by chatting with a character"}
            </p>
            {searchQuery ? (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/characters")}
              >
                Browse Characters
              </Button>
            )}
          </div>
        ) : (
          <div className="glass rounded-xl border border-white/20 divide-y divide-border">
            {filteredConversations.map((conversation) => (
              <div 
                key={conversation.conversation_id} 
                className="p-4 hover:bg-white/40 transition-colors cursor-pointer"
                onClick={() => navigate(`/chat/${conversation.conversation_id}`)}
              >
                <div className="flex items-center">
                  <Avatar className="h-12 w-12 mr-4">
                    <div className="bg-primary text-primary-foreground w-full h-full flex items-center justify-center text-sm font-medium">
                      {getInitials(conversation.character.name)}
                    </div>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate">
                        {conversation.character.name}
                      </h3>
                      <span className="text-xs text-muted-foreground flex items-center whitespace-nowrap ml-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(conversation.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      {conversation.last_message
                        ? conversation.last_message.content
                        : "Start a new conversation"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Conversations;

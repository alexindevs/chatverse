import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "https://api.aicharacters.co";

// Types
export interface User {
  email: string;
  name: string;
  username: string;
  id: number;
}

export interface Character {
  id: number;
  name: string;
  nationality: string | null;
  profession: string | null;
  description: string | null;
  image_url: string | null;
  background: string | null;
  personality_traits: string[] | null;
  motivations: string | null;
  quirks_habits: string[] | null;
  example_sentences: string[] | null;
  is_personal_character: boolean;
  owner_id: number | null;
}

export interface Conversation {
  conversation_id: number;
  character_id: number;
  user_id: number;
  created_at: string;
  character: Character;
  last_message?: Message;
}

export interface Message {
  id: number;
  conversation_id?: number;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Helper functions
const handleResponse = async (response: Response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.detail || `Error: ${response.status} ${response.statusText}`);
      throw new Error(data.detail || `Error: ${response.status} ${response.statusText}`);
    }
    return data;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Network error or invalid response format.");
    throw error;
  }
};

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    localStorage.setItem("token", data.access_token);
    return data;
  },

  signup: async (name: string, email: string, username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, email, username, password }),
    });

    return handleResponse(response);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: async (): Promise<User | null> => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },
};

// Characters API
export const charactersAPI = {
  getCharacters: async (): Promise<Character[]> => {
    const response = await fetch(`${API_URL}/characters/`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  getCharacter: async (id: number): Promise<Character> => {
    const response = await fetch(`${API_URL}/characters/${id}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  createCharacter: async (character: Partial<Character>): Promise<Character> => {
    const response = await fetch(`${API_URL}/characters/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(character),
    });

    return handleResponse(response);
  },

  updateCharacter: async (id: number, character: Partial<Character>): Promise<Character> => {
    const response = await fetch(`${API_URL}/characters/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(character),
    });

    return handleResponse(response);
  },

  deleteCharacter: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/characters/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  updateAvatar: async (id: number, imageUrl: string): Promise<Character> => {
    const response = await fetch(`${API_URL}/characters/${id}/avatar`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify({ image_url: imageUrl }), // FIXED: Sending image URL instead of file
    });

    return handleResponse(response);
  },

  generateCharacter: async (prompt: string): Promise<Character> => {
    const response = await fetch(`${API_URL}/characters/ai-generate`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ details: prompt }),
    });

    return handleResponse(response);
  },
};

// Chat API
export const chatAPI = {
  getConversations: async (): Promise<{conversations: Conversation[]}> => {
    const response = await fetch(`${API_URL}/chat/conversations`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  startConversation: async (characterId: number): Promise<Conversation> => {
    const response = await fetch(`${API_URL}/chat/start/${characterId}`, {
      method: "POST",
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  getConversationHistory: async (conversationId: number): Promise<{messages: Message[]}> => {
    const response = await fetch(`${API_URL}/chat/history/${conversationId}`, {
      headers: getAuthHeaders(),
    });

    return handleResponse(response);
  },

  sendMessage: async (conversationId: number, message: string): Promise<Message> => {
    const response = await fetch(`${API_URL}/chat/message/${conversationId}`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ message }), // FIXED: "message" instead of "content"
    });

    return handleResponse(response);
  },
};

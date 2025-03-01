
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { charactersAPI, Character, chatAPI } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Plus, Search, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const Characters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setIsLoading(true);
        const data = await charactersAPI.getCharacters();
        setCharacters(data);
        setFilteredCharacters(data);
      } catch (error) {
        console.error("Error fetching characters:", error);
        toast.error("Failed to load characters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCharacters(characters);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = characters.filter(
        (character) =>
          character.name.toLowerCase().includes(query) ||
          (character.description && character.description.toLowerCase().includes(query)) ||
          (character.profession && character.profession.toLowerCase().includes(query))
      );
      setFilteredCharacters(filtered);
    }
  }, [searchQuery, characters]);

  const startConversation = async (characterId: number) => {
    try {
      const conversation = await chatAPI.startConversation(characterId);
      navigate(`/chat/${conversation.conversation_id}`);
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  const generateCharacter = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a description for your character");
      return;
    }

    try {
      setIsGenerating(true);
      const character = await charactersAPI.generateCharacter(aiPrompt);
      toast.success(`${character.name} has been created!`);
      setCharacters((prev) => [character, ...prev]);
      setIsDialogOpen(false);
      setAiPrompt("");
    } catch (error) {
      console.error("Error generating character:", error);
      toast.error("Failed to generate character");
    } finally {
      setIsGenerating(false);
    }
  };

  const getCharacterImage = (character: Character) => {
    return character.image_url || "https://via.placeholder.com/150?text=" + encodeURIComponent(character.name.charAt(0));
  };

  const renderPersonalityTraits = (traits: string[] | null) => {
    if (!traits || traits.length === 0) return null;
    
    return (
      <div className="flex flex-wrap gap-2 mt-2">
        {traits.slice(0, 3).map((trait, index) => (
          <span 
            key={index} 
            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
          >
            {trait}
          </span>
        ))}
        {traits.length > 3 && (
          <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
            +{traits.length - 3} more
          </span>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Characters</h1>
            <p className="text-muted-foreground">
              Choose a character to start a conversation
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search characters..."
                className="pl-10 w-full sm:w-[260px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Character
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create a New Character</DialogTitle>
                  <DialogDescription>
                    Describe the character you want to create or let AI generate one for you.
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs defaultValue="ai" className="mt-4">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="ai">AI Generation</TabsTrigger>
                    <TabsTrigger value="manual">Manual Creation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ai" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <p className="text-sm font-medium">Let AI create a character for you</p>
                      </div>
                      <textarea
                        className="w-full min-h-[120px] p-3 rounded-md border bg-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Describe the character you want, e.g.: 'A wise old philosopher from ancient Greece who's witty and loves asking profound questions...'"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Be detailed! Include personality traits, background, interests, and speaking style.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="manual" className="space-y-4 mt-4">
                    <p className="text-muted-foreground text-center py-8">
                      Manual character creation coming soon
                    </p>
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={generateCharacter} 
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Character"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredCharacters.length === 0 ? (
          <div className="text-center py-16 glass rounded-2xl">
            <div className="mb-4 text-muted-foreground">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No characters found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try a different search term or clear your search"
                : "Start by creating your first character"}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => (
              <Card 
                key={character.id} 
                className="overflow-hidden border-0 character-card glass h-full flex flex-col"
              >
                <div className="aspect-[3/2] relative overflow-hidden">
                  <img
                    src={getCharacterImage(character)}
                    alt={character.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-white font-semibold text-lg">{character.name}</h3>
                    {character.profession && (
                      <p className="text-white/80 text-sm">{character.profession}</p>
                    )}
                  </div>
                </div>
                
                <CardContent className="flex-grow p-4">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {character.description || "No description available."}
                  </p>
                  {renderPersonalityTraits(character.personality_traits)}
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button 
                    variant="default" 
                    className="w-full"
                    onClick={() => startConversation(character.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Chat
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Characters;

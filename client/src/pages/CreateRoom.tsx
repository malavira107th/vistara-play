import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Loader2, PlusCircle, Brain, Users, Target, Zap, Globe, Lock } from "lucide-react";

const gameModes = [
  { value: "quiz", label: "Cricket Knowledge Quiz", icon: Brain, desc: "Answer cricket questions. Scored on knowledge.", color: "border-blue-200 bg-blue-50" },
  { value: "team_selection", label: "Team Selection Challenge", icon: Users, desc: "Build the best team within a credit budget.", color: "border-green-200 bg-green-50" },
  { value: "strategy", label: "Strategy Challenge", icon: Target, desc: "Choose the best tactical move in match situations.", color: "border-amber-200 bg-amber-50" },
  { value: "scenario", label: "Scenario Decision Game", icon: Zap, desc: "Make captain or coach decisions in real scenarios.", color: "border-purple-200 bg-purple-50" },
];

export default function CreateRoom() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [gameMode, setGameMode] = useState<"quiz" | "team_selection" | "strategy" | "scenario">("quiz");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [maxParticipants, setMaxParticipants] = useState("20");

  const createMutation = trpc.rooms.create.useMutation({
    onSuccess: (room) => {
      toast.success("Room created successfully!");
      navigate(`/rooms/${room.id}`);
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Room name is required"); return; }
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      gameMode,
      visibility,
      maxParticipants: parseInt(maxParticipants) || 20,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <PlusCircle className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Sign in to create a room</h2>
            <p className="text-muted-foreground text-sm mb-6">You need an account to host game rooms.</p>
            <a href={getLoginUrl()}><Button>Sign In</Button></a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-foreground mb-1">Create a Room</h1>
            <p className="text-sm text-muted-foreground">Set up your game room and invite friends or make it public.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <Card className="border border-border">
              <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Room Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Room Name <span className="text-destructive">*</span></Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                    placeholder="e.g. Friday Cricket Quiz"
                    className="mt-1.5"
                    maxLength={100}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                    placeholder="Describe your room (optional)"
                    className="mt-1.5 resize-none"
                    rows={3}
                    maxLength={300}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Max Participants</Label>
                  <Select value={maxParticipants} onValueChange={setMaxParticipants}>
                    <SelectTrigger className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[5, 10, 20, 50, 100].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} players</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Game Mode */}
            <Card className="border border-border">
              <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Game Mode</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {gameModes.map((mode) => (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => setGameMode(mode.value as any)}
                      className={`text-left p-4 rounded-xl border-2 transition-all ${
                        gameMode === mode.value
                          ? "border-primary bg-primary/5"
                          : `border-border hover:border-primary/30 ${mode.color}`
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <mode.icon className="h-4 w-4 text-foreground" />
                        <span className="text-sm font-semibold text-foreground">{mode.label}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{mode.desc}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visibility */}
            <Card className="border border-border">
              <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Visibility</CardTitle></CardHeader>
              <CardContent>
                <RadioGroup value={visibility} onValueChange={(v) => setVisibility(v as any)} className="space-y-3">
                  <div className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${visibility === "public" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    onClick={() => setVisibility("public")}>
                    <RadioGroupItem value="public" id="public" className="mt-0.5" />
                    <div>
                      <Label htmlFor="public" className="flex items-center gap-1.5 cursor-pointer font-medium text-sm">
                        <Globe className="h-4 w-4 text-muted-foreground" /> Public
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Anyone can find and join this room.</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${visibility === "private" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    onClick={() => setVisibility("private")}>
                    <RadioGroupItem value="private" id="private" className="mt-0.5" />
                    <div>
                      <Label htmlFor="private" className="flex items-center gap-1.5 cursor-pointer font-medium text-sm">
                        <Lock className="h-4 w-4 text-muted-foreground" /> Private
                      </Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Only people with the room code or invite link can join.</p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={createMutation.isPending || !name.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              size="lg"
            >
              {createMutation.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Creating Room...</>
              ) : (
                <><PlusCircle className="h-4 w-4 mr-2" />Create Room</>
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

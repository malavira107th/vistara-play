import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import { Loader2, DoorOpen, Users, Search } from "lucide-react";

const modeLabels: Record<string, string> = {
  quiz: "Quiz",
  team_selection: "Team Selection",
  strategy: "Strategy",
  scenario: "Scenario",
};

export default function JoinRoom() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ code?: string }>();

  const [code, setCode] = useState(params.code ?? "");
  const [searchCode, setSearchCode] = useState(params.code ?? "");

  const roomQuery = trpc.rooms.getByCode.useQuery(
    { code: searchCode.toUpperCase() },
    { enabled: searchCode.length >= 4 }
  );

  const joinMutation = trpc.rooms.join.useMutation({
    onSuccess: (data) => {
      toast.success("Joined room!");
      navigate(`/rooms/${data.roomId}`);
    },
    onError: (e) => toast.error(e.message),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchCode(code.trim().toUpperCase());
  };

  const handleJoin = () => {
    if (!roomQuery.data) return;
    joinMutation.mutate({ code: searchCode });
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
            <DoorOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Sign in to join a room</h2>
            <p className="text-muted-foreground text-sm mb-6">You need an account to join game rooms.</p>
            <a href={getLoginUrl()}><Button>Sign In</Button></a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const room = roomQuery.data;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="container max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-display font-bold text-foreground mb-1">Join a Room</h1>
            <p className="text-sm text-muted-foreground">Enter a room code to find and join a game room.</p>
          </div>

          <Card className="border border-border mb-5">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Enter Room Code</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-3">
                <div>
                  <Label htmlFor="code" className="text-sm font-medium">Room Code</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ABC123"
                    className="mt-1.5 font-mono text-center text-lg tracking-widest uppercase"
                    maxLength={10}
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={code.length < 4}>
                  <Search className="h-4 w-4" /> Find Room
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Room Preview */}
          {searchCode.length >= 4 && (
            <Card className="border border-border">
              <CardContent className="p-5">
                {roomQuery.isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : roomQuery.error ? (
                  <div className="text-center py-6">
                    <DoorOpen className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No room found with code <strong>{searchCode}</strong>.</p>
                  </div>
                ) : room ? (
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-foreground">{room.name}</h3>
                        {room.description && <p className="text-sm text-muted-foreground mt-0.5">{room.description}</p>}
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">{modeLabels[room.gameMode] ?? room.gameMode}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{room.currentParticipants}/{room.maxParticipants} players</span>
                      <Badge variant={room.status === "waiting" ? "secondary" : "outline"} className="text-xs capitalize">{room.status}</Badge>
                    </div>
                    {room.status === "waiting" ? (
                      <Button
                        onClick={handleJoin}
                        disabled={joinMutation.isPending || room.currentParticipants >= room.maxParticipants}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {joinMutation.isPending ? (
                          <><Loader2 className="h-4 w-4 animate-spin mr-2" />Joining...</>
                        ) : room.currentParticipants >= room.maxParticipants ? (
                          "Room is Full"
                        ) : (
                          <><DoorOpen className="h-4 w-4 mr-2" />Join Room</>
                        )}
                      </Button>
                    ) : (
                      <p className="text-sm text-center text-muted-foreground">This room is {room.status} and cannot be joined.</p>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

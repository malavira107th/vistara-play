import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useParams } from "wouter";
import {
  Loader2, DoorOpen, Users, Copy, Play, LogOut, Crown,
  Brain, Target, Zap, Trophy
} from "lucide-react";
import { Link } from "wouter";

const modeIcons: Record<string, any> = { quiz: Brain, team_selection: Users, strategy: Target, scenario: Zap };
const modeLabels: Record<string, string> = {
  quiz: "Cricket Knowledge Quiz",
  team_selection: "Team Selection Challenge",
  strategy: "Strategy Challenge",
  scenario: "Scenario Decision Game",
};

export default function RoomLobby() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const roomId = parseInt(params.id ?? "0");

  const roomQuery = trpc.rooms.getById.useQuery({ id: roomId }, { enabled: !!roomId, refetchInterval: 5000 });
  const utils = trpc.useUtils();

  const startMutation = trpc.rooms.start.useMutation({
    onSuccess: () => {
      toast.success("Game started!");
      utils.rooms.getById.invalidate({ id: roomId });
      navigate(`/game/${roomId}`);
    },
    onError: (e) => toast.error(e.message),
  });

  const leaveMutation = trpc.rooms.leave.useMutation({
    onSuccess: () => {
      toast.success("Left room");
      navigate("/rooms");
    },
    onError: (e) => toast.error(e.message),
  });

  const copyCode = () => {
    if (roomQuery.data?.roomCode) {
      navigator.clipboard.writeText(roomQuery.data.roomCode);
      toast.success("Room code copied!");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Invite link copied!");
  };

  if (loading || roomQuery.isLoading) {
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
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Sign in to view this room</h2>
            <a href={getLoginUrl()}><Button>Sign In</Button></a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!roomQuery.data) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <DoorOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Room not found</h2>
            <Link href="/rooms"><Button variant="outline">Browse Rooms</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const room = roomQuery.data;
  const participants = room.participants ?? [];
  const isHost = room.hostId === user?.id;
  const isParticipant = participants.some((p: any) => p.userId === user?.id);
  const ModeIcon = modeIcons[room.gameMode] ?? Brain;

  // If game is active, redirect to game
  if (room.status === "in_progress" && isParticipant) {
    navigate(`/game/${roomId}`);
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          {/* Room Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-display font-bold text-foreground">{room.name}</h1>
                <Badge variant={room.status === "waiting" ? "secondary" : "outline"} className="text-xs capitalize">{room.status}</Badge>
              </div>
              {room.description && <p className="text-sm text-muted-foreground">{room.description}</p>}
            </div>
            <div className="flex gap-2">
              {isParticipant && !isHost && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                  onClick={() => leaveMutation.mutate({ roomId })}
                  disabled={leaveMutation.isPending}
                >
                  <LogOut className="h-4 w-4" /> Leave
                </Button>
              )}
              {isHost && room.status === "waiting" && (
                <Button
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => startMutation.mutate({ roomId })}
                  disabled={startMutation.isPending || participants.length < 1}
                >
                  {startMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                  Start Game
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Left: Room Info */}
            <div className="space-y-4">
              <Card className="border border-border">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Game Mode</CardTitle></CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ModeIcon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{modeLabels[room.gameMode] ?? room.gameMode}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Room Code</CardTitle></CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-center text-xl font-mono font-bold text-foreground bg-muted rounded-lg py-2 tracking-widest">
                      {room.roomCode}
                    </code>
                    <Button variant="outline" size="icon" onClick={copyCode} className="shrink-0">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2 gap-1.5 text-xs" onClick={copyLink}>
                    <Copy className="h-3.5 w-3.5" /> Copy Invite Link
                  </Button>
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Participants</span>
                    <span className="font-medium text-foreground">{participants.length}/{room.maxParticipants}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Visibility</span>
                    <span className="font-medium text-foreground capitalize">{room.visibility}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Participants */}
            <div className="md:col-span-2">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    Participants ({participants.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {participants.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No participants yet. Share the room code to invite players.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {participants.map((p: any, index: number) => {
                        const initials = p.name ? p.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
                        return (
                          <div key={p.userId} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="text-sm font-medium text-muted-foreground w-6 text-center">{index + 1}</div>
                            <Avatar className="h-8 w-8 border border-border">
                              <AvatarImage src={p.avatarUrl ?? undefined} />
                              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-sm font-medium text-foreground truncate">{p.name ?? "Player"}</span>
                                {p.userId === room.hostId && (
                                  <Crown className="h-3.5 w-3.5 text-accent shrink-0" />
                                )}
                                {p.userId === user?.id && (
                                  <Badge variant="secondary" className="text-xs px-1.5 py-0">You</Badge>
                                )}
                              </div>
                              {p.username && <p className="text-xs text-muted-foreground">@{p.username}</p>}
                            </div>
                            {room.status === "completed" && (
                              <div className="text-right">
                                <div className="text-sm font-bold text-foreground">{p.score ?? 0}</div>
                                <div className="text-xs text-muted-foreground">pts</div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {room.status === "completed" && participants.length > 0 && (
                    <>
                      <Separator className="my-4" />
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20">
                        <Trophy className="h-5 w-5 text-accent" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">Game Complete</p>
                          <p className="text-xs text-muted-foreground">Final scores are shown above.</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

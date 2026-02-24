import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Gamepad2, Trophy, Star, LayoutDashboard, PlusCircle, DoorOpen,
  Clock, Loader2, Users, ChevronRight, User
} from "@/components/SvgIcon";
import { formatDistanceToNow } from "date-fns";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <Card className="border border-border">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-display font-bold text-foreground mt-0.5">{value}</p>
          </div>
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RoomCard({ room, type }: { room: any; type: "hosted" | "joined" }) {
  const modeColors: Record<string, string> = {
    quiz: "bg-blue-100 text-blue-700",
    team_selection: "bg-green-100 text-green-700",
    strategy: "bg-amber-100 text-amber-700",
    scenario: "bg-purple-100 text-purple-700",
  };
  const statusColors: Record<string, string> = {
    waiting: "bg-gray-100 text-gray-600",
    active: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-muted/30 transition-all cursor-pointer">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
          <DoorOpen className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">{room.name}</span>
            <Badge variant="outline" className={`text-xs shrink-0 ${modeColors[room.gameMode] ?? ""}`}>
              {room.gameMode?.replace("_", " ")}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-0.5">
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[room.status] ?? ""}`}>{room.status}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />{room.participantCount ?? 0}/{room.maxParticipants}
            </span>
            {room.createdAt && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />{formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const profileQuery = trpc.profile.me.useQuery(undefined, { enabled: isAuthenticated });
  const hostedRoomsQuery = trpc.rooms.myHosted.useQuery(undefined, { enabled: isAuthenticated });
  const joinedRoomsQuery = trpc.rooms.myJoined.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
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
            <LayoutDashboard className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Sign in to view your dashboard</h2>
            <p className="text-muted-foreground text-sm mb-6">Track your games, rooms, and stats.</p>
            <a href={getLoginUrl()}><Button>Sign In</Button></a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const profile = profileQuery.data;
  const initials = user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "VP";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-border">
                <AvatarImage src={user?.avatarUrl ?? undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-display font-bold text-foreground">Welcome, {user?.name?.split(" ")[0] ?? "Player"}</h1>
                <p className="text-sm text-muted-foreground">
                  {profile?.username ? `@${profile.username}` : "Set a username in your profile"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href="/rooms/create">
                <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" /> Create Room
                </Button>
              </Link>
              <Link href="/rooms">
                <Button size="sm" variant="outline" className="gap-1.5">
                  <DoorOpen className="h-4 w-4" /> Browse Rooms
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Gamepad2} label="Games Played" value={profile?.totalGamesPlayed ?? 0} color="bg-blue-100 text-blue-600" />
            <StatCard icon={Trophy} label="Games Won" value={profile?.totalGamesWon ?? 0} color="bg-green-100 text-green-600" />
            <StatCard icon={Star} label="Total Points" value={(profile?.totalPoints ?? 0).toLocaleString()} color="bg-amber-100 text-amber-600" />
            <StatCard icon={User} label="Skill Rating" value={profile?.skillRating ?? 1000} color="bg-purple-100 text-purple-600" />
          </div>

          {/* Rooms */}
          <Tabs defaultValue="hosted">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="hosted">Hosted Rooms</TabsTrigger>
                <TabsTrigger value="joined">Joined Rooms</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="hosted">
              <Card className="border border-border">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold">Rooms You Host</CardTitle>
                  <Link href="/rooms/create">
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <PlusCircle className="h-3.5 w-3.5" /> New Room
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="pt-0">
                  {hostedRoomsQuery.isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : hostedRoomsQuery.data && hostedRoomsQuery.data.length > 0 ? (
                    <div className="space-y-2">
                      {hostedRoomsQuery.data.map((room) => (
                        <RoomCard key={room.id} room={room} type="hosted" />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <DoorOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">You have not hosted any rooms yet.</p>
                      <Link href="/rooms/create">
                        <Button size="sm" variant="outline">Create Your First Room</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="joined">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Rooms You Joined</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {joinedRoomsQuery.isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : joinedRoomsQuery.data && joinedRoomsQuery.data.length > 0 ? (
                    <div className="space-y-2">
                      {joinedRoomsQuery.data.map((entry) => (
                        <RoomCard key={entry.room.id} room={entry.room} type="joined" />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <DoorOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-3">You have not joined any rooms yet.</p>
                      <Link href="/rooms">
                        <Button size="sm" variant="outline">Browse Rooms</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

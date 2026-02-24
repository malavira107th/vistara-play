import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link } from "wouter";
import { DoorOpen, PlusCircle, Search, Users, Clock, Loader2, Lock, Globe } from "@/components/SvgIcon";
import { formatDistanceToNow } from "date-fns";

const modeLabels: Record<string, string> = {
  quiz: "Quiz",
  team_selection: "Team Selection",
  strategy: "Strategy",
  scenario: "Scenario",
};
const modeColors: Record<string, string> = {
  quiz: "bg-blue-100 text-blue-700 border-blue-200",
  team_selection: "bg-green-100 text-green-700 border-green-200",
  strategy: "bg-amber-100 text-amber-700 border-amber-200",
  scenario: "bg-purple-100 text-purple-700 border-purple-200",
};
const statusColors: Record<string, string> = {
  waiting: "bg-gray-100 text-gray-600",
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
};

export default function Rooms() {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("all");

  const roomsQuery = trpc.rooms.listPublic.useQuery({ limit: 50, offset: 0 });

  const filtered = (roomsQuery.data ?? []).filter((room) => {
    const matchesSearch = !search || room.name.toLowerCase().includes(search.toLowerCase());
    const matchesMode = modeFilter === "all" || room.gameMode === modeFilter;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-[oklch(0.20_0.07_145)] to-[oklch(0.34_0.13_145)] py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-1">Game Rooms</h1>
              <p className="text-[oklch(0.80_0.04_145)] text-sm">Browse public rooms or create your own.</p>
            </div>
            <div className="flex gap-2">
              <Link href="/rooms/join">
                <Button variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 bg-transparent gap-1.5">
                  <DoorOpen className="h-4 w-4" /> Join by Code
                </Button>
              </Link>
              {isAuthenticated && (
                <Link href="/rooms/create">
                  <Button size="sm" className="bg-[oklch(0.72_0.18_85)] hover:bg-[oklch(0.62_0.18_85)] text-[oklch(0.15_0.02_145)] gap-1.5 font-semibold">
                    <PlusCircle className="h-4 w-4" /> Create Room
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search rooms..."
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All Modes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="team_selection">Team Selection</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="scenario">Scenario</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Room List */}
          {roomsQuery.isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-7 w-7 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((room) => (
                <Card key={room.id} className="border border-border hover:border-primary/30 hover:shadow-md transition-all">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        {room.visibility === "private" ? (
                          <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                        ) : (
                          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                        <h3 className="text-sm font-semibold text-foreground truncate">{room.name}</h3>
                      </div>
                      <Badge variant="outline" className={`text-xs shrink-0 ${modeColors[room.gameMode] ?? ""}`}>
                        {modeLabels[room.gameMode] ?? room.gameMode}
                      </Badge>
                    </div>
                    {room.description && (
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{room.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {room.currentParticipants}/{room.maxParticipants}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded-full ${statusColors[room.status] ?? ""}`}>
                          {room.status}
                        </span>
                      </div>
                      <Link href={`/rooms/${room.id}`}>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-3">
                          View
                        </Button>
                      </Link>
                    </div>
                    {room.createdAt && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(room.createdAt), { addSuffix: true })}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <DoorOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-foreground mb-2">No rooms found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search || modeFilter !== "all" ? "Try adjusting your filters." : "No public rooms are available right now."}
              </p>
              {isAuthenticated && (
                <Link href="/rooms/create">
                  <Button size="sm">Create the First Room</Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

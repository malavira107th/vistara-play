import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star, Users, Globe, Loader2 } from "@/components/SvgIcon";
import { Link } from "wouter";

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">1</div>;
  if (rank === 2) return <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-600 font-bold text-sm">2</div>;
  if (rank === 3) return <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold text-sm">3</div>;
  return <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground font-medium text-sm">{rank}</div>;
}

function LeaderboardRow({ entry, rank, currentUserId }: { entry: any; rank: number; currentUserId?: number }) {
  const isMe = entry.userId === currentUserId;
  const initials = entry.name ? entry.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isMe ? "bg-primary/8 border border-primary/20" : "hover:bg-muted/50"}`}>
      <RankBadge rank={rank} />
      <Avatar className="h-9 w-9 border border-border">
        <AvatarImage src={entry.avatarUrl ?? undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-foreground truncate">{entry.name ?? "Player"}</span>
          {isMe && <Badge variant="secondary" className="text-xs px-1.5 py-0">You</Badge>}
        </div>
        {entry.username && <p className="text-xs text-muted-foreground">@{entry.username}</p>}
      </div>
      <div className="text-right shrink-0">
        <div className="text-sm font-bold text-foreground">{entry.totalPoints?.toLocaleString() ?? 0}</div>
        <div className="text-xs text-muted-foreground">{entry.gamesPlayed ?? 0} games</div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const { user, isAuthenticated } = useAuth();
  const [tab, setTab] = useState("global");

  const globalQuery = trpc.leaderboard.global.useQuery({ limit: 50 });
  const friendsQuery = trpc.leaderboard.friends.useQuery(undefined, { enabled: isAuthenticated });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-[oklch(0.20_0.07_145)] to-[oklch(0.34_0.13_145)] py-14">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)]">Rankings</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Leaderboard</h1>
          <p className="text-[oklch(0.80_0.04_145)] max-w-xl mx-auto">See how you rank against other players on the platform.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container max-w-3xl">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="global" className="gap-2">
                <Globe className="h-4 w-4" /> Global
              </TabsTrigger>
              <TabsTrigger value="friends" className="gap-2" disabled={!isAuthenticated}>
                <Users className="h-4 w-4" /> Friends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="global">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-accent" /> Global Rankings
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {globalQuery.isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : globalQuery.data && globalQuery.data.length > 0 ? (
                    <div className="px-3 pb-3 space-y-1">
                      {globalQuery.data.map((entry, index) => (
                        <LeaderboardRow key={entry.userId} entry={entry} rank={index + 1} currentUserId={user?.id} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No rankings yet. Play some games to appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="friends">
              {!isAuthenticated ? (
                <Card className="border border-border">
                  <CardContent className="py-12 text-center">
                    <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">Sign in to see your friends leaderboard.</p>
                    <a href={getLoginUrl()}><Button size="sm">Sign In</Button></a>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                      <Users className="h-4 w-4 text-accent" /> Friends Rankings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {friendsQuery.isLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : friendsQuery.data && friendsQuery.data.length > 0 ? (
                      <div className="px-3 pb-3 space-y-1">
                        {friendsQuery.data.map((entry, index) => (
                          <LeaderboardRow key={entry.userId} entry={entry} rank={index + 1} currentUserId={user?.id} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">Add friends to see a friends leaderboard.</p>
                        <Link href="/friends"><Button size="sm" variant="outline">Find Friends</Button></Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}

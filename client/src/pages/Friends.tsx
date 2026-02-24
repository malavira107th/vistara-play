import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Users, UserPlus, Search, Check, X, Trophy, Gamepad2 } from "@/components/SvgIcon";

function UserCard({ user, onAdd, onAccept, onDecline, onRemove, type }: {
  user: any;
  onAdd?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  onRemove?: () => void;
  type: "search" | "friend" | "pending_in" | "pending_out";
}) {
  const initials = user.name ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
      <Avatar className="h-10 w-10 border border-border">
        <AvatarImage src={user.avatarUrl ?? undefined} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">{user.name ?? "Player"}</div>
        {user.username && <div className="text-xs text-muted-foreground">@{user.username}</div>}
        {type === "friend" && (
          <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><Gamepad2 className="h-3 w-3" />{user.totalGamesPlayed ?? 0} games</span>
            <span className="flex items-center gap-1"><Trophy className="h-3 w-3" />{user.totalPoints ?? 0} pts</span>
          </div>
        )}
      </div>
      <div className="flex gap-1.5 shrink-0">
        {type === "search" && onAdd && (
          <Button size="sm" variant="outline" className="h-8 px-3 text-xs gap-1" onClick={onAdd}>
            <UserPlus className="h-3.5 w-3.5" /> Add
          </Button>
        )}
        {type === "pending_in" && (
          <>
            <Button size="sm" className="h-8 px-3 text-xs gap-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={onAccept}>
              <Check className="h-3.5 w-3.5" /> Accept
            </Button>
            <Button size="sm" variant="outline" className="h-8 px-3 text-xs gap-1" onClick={onDecline}>
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        )}
        {type === "pending_out" && (
          <Badge variant="secondary" className="text-xs">Pending</Badge>
        )}
        {type === "friend" && onRemove && (
          <Button size="sm" variant="outline" className="h-8 px-3 text-xs text-muted-foreground" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Friends() {
  const { isAuthenticated, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const utils = trpc.useUtils();

  const friendsQuery = trpc.friends.list.useQuery(undefined, { enabled: isAuthenticated });
  const requestsQuery = trpc.friends.pendingRequests.useQuery(undefined, { enabled: isAuthenticated });
  const searchQuery2 = trpc.profile.search.useQuery(
    { query: searchQuery },
    { enabled: isAuthenticated && searchQuery.length >= 2 }
  );

  const sendMutation = trpc.friends.sendRequest.useMutation({
    onSuccess: () => { toast.success("Friend request sent!"); utils.friends.list.invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });
  const acceptMutation = trpc.friends.acceptRequest.useMutation({
    onSuccess: () => { toast.success("Friend request accepted!"); utils.friends.list.invalidate(); utils.friends.pendingRequests.invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });
  const declineMutation = trpc.friends.declineRequest.useMutation({
    onSuccess: () => { utils.friends.pendingRequests.invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });
  const removeMutation = trpc.friends.remove.useMutation({
    onSuccess: () => { toast.success("Friend removed"); utils.friends.list.invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput.trim());
  };

  // pendingRequests only returns incoming requests (where current user is receiver)
  const pendingIn = requestsQuery.data ?? [];
  const pendingOut: any[] = [];

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
            <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Sign in to manage friends</h2>
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
      <main className="flex-1 py-8">
        <div className="container max-w-2xl">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">Friends</h1>

          {/* Search */}
          <Card className="border border-border mb-6">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">Find Players</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={searchInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
                    placeholder="Search by name or username..."
                    className="pl-9"
                  />
                </div>
                <Button type="submit" disabled={searchInput.length < 2}>Search</Button>
              </form>
              {searchQuery.length >= 2 && (
                <div className="space-y-2">
                  {searchQuery2.isLoading ? (
                    <div className="flex justify-center py-4"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : searchQuery2.data && searchQuery2.data.length > 0 ? (
                    searchQuery2.data.map((u: any) => (
                      <UserCard
                        key={u.id}
                        user={u}
                        type="search"
                        onAdd={() => sendMutation.mutate({ receiverId: u.id })}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-3">No players found.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="friends">
            <TabsList className="grid w-full grid-cols-3 mb-5">
              <TabsTrigger value="friends">
                Friends {friendsQuery.data && friendsQuery.data.length > 0 && `(${friendsQuery.data.length})`}
              </TabsTrigger>
              <TabsTrigger value="incoming">
                Requests {pendingIn.length > 0 && <Badge variant="destructive" className="ml-1.5 text-xs px-1.5 py-0">{pendingIn.length}</Badge>}
              </TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
            </TabsList>

            <TabsContent value="friends">
              <Card className="border border-border">
                <CardContent className="p-4">
                  {friendsQuery.isLoading ? (
                    <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                  ) : friendsQuery.data && friendsQuery.data.length > 0 ? (
                    <div className="space-y-2">
                      {friendsQuery.data.map((f: any) => (
                        <UserCard
                          key={f.id}
                          user={f}
                          type="friend"
                          onRemove={() => removeMutation.mutate({ friendId: f.id })}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No friends yet. Search for players to add them.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="incoming">
              <Card className="border border-border">
                <CardContent className="p-4">
                  {pendingIn.length > 0 ? (
                    <div className="space-y-2">
                      {pendingIn.map((r: any) => (
                        <UserCard
                          key={r.id}
                          user={{ id: r.senderId, name: r.senderName, username: r.senderUsername, avatarUrl: r.senderAvatar }}
                          type="pending_in"
                          onAccept={() => acceptMutation.mutate({ requestId: r.id, senderId: r.senderId })}
                          onDecline={() => declineMutation.mutate({ requestId: r.id })}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <UserPlus className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No incoming friend requests.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sent">
              <Card className="border border-border">
                <CardContent className="p-4">
                  {pendingOut.length > 0 ? (
                    <div className="space-y-2">
                      {pendingOut.map((r: any) => (
                        <UserCard
                          key={r.id}
                          user={r.toUser ?? r}
                          type="pending_out"
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <UserPlus className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">No sent requests.</p>
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

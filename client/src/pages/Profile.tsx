import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, User, Trophy, Gamepad2, Star } from "@/components/SvgIcon";

export default function Profile() {
  const { user, isAuthenticated, loading } = useAuth();
  const utils = trpc.useUtils();

  const profileQuery = trpc.profile.me.useQuery(undefined, { enabled: isAuthenticated });
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (!initialized && profileQuery.data) {
    setUsername(profileQuery.data.username ?? "");
    setBio(profileQuery.data.bio ?? "");
    setInitialized(true);
  }

  const updateMutation = trpc.profile.update.useMutation({
    onSuccess: () => {
      utils.profile.me.invalidate();
      toast.success("Profile updated");
    },
    onError: (e) => toast.error(e.message),
  });

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
            <User className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-display font-bold text-foreground mb-2">Sign in to view your profile</h2>
            <p className="text-muted-foreground text-sm mb-6">Create a free account to get started.</p>
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
      <main className="flex-1 py-10">
        <div className="container max-w-3xl">
          <h1 className="text-2xl font-display font-bold text-foreground mb-6">My Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Avatar & Stats */}
            <div className="space-y-4">
              <Card className="border border-border">
                <CardContent className="p-5 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-3 border-2 border-border">
                    <AvatarImage src={user?.avatarUrl ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">{initials}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-base font-semibold text-foreground">{user?.name ?? "Player"}</h2>
                  {profile?.username && <p className="text-sm text-muted-foreground">@{profile.username}</p>}
                  {user?.role === "admin" && (
                    <Badge variant="secondary" className="mt-2 text-xs">Admin</Badge>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-border">
                <CardHeader className="pb-2 pt-4 px-4">
                  <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Stats</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 space-y-3">
                  {[
                    { icon: Gamepad2, label: "Games Played", value: profile?.totalGamesPlayed ?? 0 },
                    { icon: Trophy, label: "Games Won", value: profile?.totalGamesWon ?? 0 },
                    { icon: Star, label: "Total Points", value: profile?.totalPoints?.toLocaleString() ?? 0 },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <stat.icon className="h-4 w-4" />
                        {stat.label}
                      </div>
                      <span className="text-sm font-semibold text-foreground">{stat.value}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Right: Edit Profile */}
            <div className="md:col-span-2">
              <Card className="border border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Display Name</Label>
                    <Input id="name" value={user?.name ?? ""} disabled className="mt-1.5 bg-muted" />
                    <p className="text-xs text-muted-foreground mt-1">Name is managed by your account provider.</p>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                    <Input id="email" value={user?.email ?? ""} disabled className="mt-1.5 bg-muted" />
                  </div>
                  <Separator />
                  <div>
                    <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="mt-1.5"
                      maxLength={30}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Shown on leaderboards and to other players.</p>
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                    <Input
                      id="bio"
                      value={bio}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBio(e.target.value)}
                      placeholder="A short description about yourself"
                      className="mt-1.5"
                      maxLength={160}
                    />
                  </div>
                  <Button
                    onClick={() => updateMutation.mutate({ username: username || undefined, bio: bio || undefined, name: user?.name || undefined })}
                    disabled={updateMutation.isPending}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {updateMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : "Save Changes"}
                  </Button>
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

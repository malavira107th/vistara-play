import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, Shield } from "@/components/SvgIcon";

export default function AdminUsers() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!loading && (!isAuthenticated || user?.role !== "admin")) navigate("/"); }, [loading, isAuthenticated, user]);
  const usersQuery = trpc.admin.users.useQuery({ limit: 100, offset: 0 }, { enabled: isAuthenticated && user?.role === "admin" });
  if (loading || !isAuthenticated || user?.role !== "admin") return <div className="min-h-screen flex flex-col bg-background"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div><Footer /></div>;
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-6"><Shield className="h-5 w-5 text-primary" /><h1 className="text-xl font-display font-bold text-foreground">User Management</h1></div>
          <Card className="border border-border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold flex items-center gap-2"><Users className="h-4 w-4" />All Users ({usersQuery.data?.total ?? 0})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {usersQuery.isLoading ? <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div> : (
                <div className="divide-y divide-border">
                  {(usersQuery.data?.users ?? []).map((u: any) => {
                    const initials = u.name ? u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
                    return (
                      <div key={u.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                        <Avatar className="h-9 w-9 border border-border"><AvatarImage src={u.avatarUrl ?? undefined} /><AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">{initials}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2"><span className="text-sm font-medium text-foreground truncate">{u.name ?? "Player"}</span>{u.role === "admin" && <Badge variant="secondary" className="text-xs">Admin</Badge>}</div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">{u.email && <span>{u.email}</span>}{u.username && <span>@{u.username}</span>}</div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground"><div>{u.totalGamesPlayed ?? 0} games</div><div>{u.totalPoints ?? 0} pts</div></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

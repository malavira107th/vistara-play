import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Users, Shield, PlusCircle } from "@/components/SvgIcon";

export default function AdminPlayers() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!loading && (!isAuthenticated || user?.role !== "admin")) navigate("/"); }, [loading, isAuthenticated, user]);

  const playersQuery = trpc.admin.listPlayers.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const utils = trpc.useUtils();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [role, setRole] = useState<"batsman" | "bowler" | "allrounder" | "wicketkeeper">("batsman");
  const [credits, setCredits] = useState("8");
  const [rating, setRating] = useState("80");

  const createMutation = trpc.admin.createPlayer.useMutation({
    onSuccess: () => {
      toast.success("Player created");
      utils.admin.listPlayers.invalidate();
      setOpen(false);
      setName(""); setCountry(""); setCredits("8"); setRating("80");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleCreate = () => {
    if (!name || !country) { toast.error("Name and country are required"); return; }
    createMutation.mutate({
      name, country, role: role as any,
      creditValue: parseFloat(credits) || 8,
    });
  };

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <div className="min-h-screen flex flex-col bg-background"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div><Footer /></div>;
  }

  const roleColors: Record<string, string> = {
    batsman: "bg-blue-100 text-blue-700",
    bowler: "bg-green-100 text-green-700",
    all_rounder: "bg-amber-100 text-amber-700",
    wicket_keeper: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-display font-bold text-foreground">Player Data</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" /> Add Player
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Cricket Player</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <div><Label className="text-sm">Name *</Label><Input value={name} onChange={(e: any) => setName(e.target.value)} placeholder="Player name" className="mt-1" /></div>
                  <div><Label className="text-sm">Country *</Label><Input value={country} onChange={(e: any) => setCountry(e.target.value)} placeholder="India" className="mt-1" /></div>
                  <div>
                    <Label className="text-sm">Role</Label>
                    <Select value={role} onValueChange={(v: any) => setRole(v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="batsman">Batsman</SelectItem>
                        <SelectItem value="bowler">Bowler</SelectItem>
                        <SelectItem value="allrounder">All-rounder</SelectItem>
                        <SelectItem value="wicketkeeper">Wicket Keeper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-sm">Credits</Label><Input type="number" value={credits} onChange={(e: any) => setCredits(e.target.value)} min="1" max="15" className="mt-1" /></div>
                    <div><Label className="text-sm">Rating (1-100)</Label><Input type="number" value={rating} onChange={(e: any) => setRating(e.target.value)} min="1" max="100" className="mt-1" /></div>
                  </div>
                  <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Create Player
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border border-border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold flex items-center gap-2"><Users className="h-4 w-4" />Cricket Players</CardTitle></CardHeader>
            <CardContent className="p-0">
              {playersQuery.isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : playersQuery.data && playersQuery.data.length > 0 ? (
                <div className="divide-y divide-border">
                  {playersQuery.data.map((p: any) => (
                    <div key={p.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{p.name}</span>
                          <Badge variant="outline" className={`text-xs ${roleColors[p.role] ?? ""}`}>{p.role?.replace("_", " ")}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">{p.country} · Rating: {p.rating} · Credits: {p.credits}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No players added yet.</p>
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

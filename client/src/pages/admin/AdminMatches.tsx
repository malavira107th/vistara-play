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
import { Loader2, Trophy, Shield, PlusCircle } from "@/components/SvgIcon";
import { format } from "date-fns";

export default function AdminMatches() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!loading && (!isAuthenticated || user?.role !== "admin")) navigate("/"); }, [loading, isAuthenticated, user]);

  const matchesQuery = trpc.admin.listMatches.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const utils = trpc.useUtils();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [team1, setTeam1] = useState("");
  const [team2, setTeam2] = useState("");
  const [venue, setVenue] = useState("");
  const [matchType, setMatchType] = useState<"T20" | "ODI" | "Test">("T20");
  const [matchDate, setMatchDate] = useState("");

  const createMutation = trpc.admin.createMatch.useMutation({
    onSuccess: () => {
      toast.success("Match created");
      utils.admin.listMatches.invalidate();
      setOpen(false);
      setTitle(""); setTeam1(""); setTeam2(""); setVenue(""); setMatchDate("");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleCreate = () => {
    if (!title || !team1 || !team2 || !matchDate) { toast.error("Fill all required fields"); return; }
    createMutation.mutate({
      title, team1, team2,
      venue: venue || undefined,
      matchType,
      matchDate: new Date(matchDate).getTime(),
    });
  };

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <div className="min-h-screen flex flex-col bg-background"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div><Footer /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-display font-bold text-foreground">Match Data</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" /> Add Match
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Add Cricket Match</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <div><Label className="text-sm">Title *</Label><Input value={title} onChange={(e: any) => setTitle(e.target.value)} placeholder="e.g. India vs Australia T20" className="mt-1" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-sm">Team 1 *</Label><Input value={team1} onChange={(e: any) => setTeam1(e.target.value)} placeholder="India" className="mt-1" /></div>
                    <div><Label className="text-sm">Team 2 *</Label><Input value={team2} onChange={(e: any) => setTeam2(e.target.value)} placeholder="Australia" className="mt-1" /></div>
                  </div>
                  <div><Label className="text-sm">Venue</Label><Input value={venue} onChange={(e: any) => setVenue(e.target.value)} placeholder="Wankhede Stadium" className="mt-1" /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Match Type *</Label>
                      <Select value={matchType} onValueChange={(v: any) => setMatchType(v)}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="T20">T20</SelectItem>
                          <SelectItem value="ODI">ODI</SelectItem>
                          <SelectItem value="Test">Test</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label className="text-sm">Match Date *</Label><Input type="date" value={matchDate} onChange={(e: any) => setMatchDate(e.target.value)} className="mt-1" /></div>
                  </div>
                  <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Create Match
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border border-border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold flex items-center gap-2"><Trophy className="h-4 w-4" />Cricket Matches</CardTitle></CardHeader>
            <CardContent className="p-0">
              {matchesQuery.isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : matchesQuery.data && matchesQuery.data.length > 0 ? (
                <div className="divide-y divide-border">
                  {matchesQuery.data.map((m: any) => (
                    <div key={m.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{m.title}</span>
                          <Badge variant="outline" className="text-xs">{m.matchType}</Badge>
                          <Badge variant={m.status === "live" ? "destructive" : "secondary"} className="text-xs capitalize">{m.status}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {m.team1} vs {m.team2}{m.venue ? ` · ${m.venue}` : ""}{m.matchDate ? ` · ${format(new Date(m.matchDate), "dd MMM yyyy")}` : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Trophy className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No matches added yet.</p>
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

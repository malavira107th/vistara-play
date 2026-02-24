import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation, Link } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, DoorOpen, Shield, Users, Eye } from "@/components/SvgIcon";

const statusColors: Record<string, string> = {
  waiting: "bg-gray-100 text-gray-600",
  in_progress: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminRooms() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!loading && (!isAuthenticated || user?.role !== "admin")) navigate("/"); }, [loading, isAuthenticated, user]);

  const roomsQuery = trpc.admin.rooms.useQuery({ limit: 100, offset: 0 }, { enabled: isAuthenticated && user?.role === "admin" });
  const utils = trpc.useUtils();

  const cancelMutation = trpc.admin.closeRoom.useMutation({
    onSuccess: () => { toast.success("Room cancelled"); utils.admin.rooms.invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

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
            <h1 className="text-xl font-display font-bold text-foreground">Room Management</h1>
            <Badge variant="secondary" className="ml-auto">{roomsQuery.data?.total ?? 0} rooms</Badge>
          </div>
          <Card className="border border-border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold flex items-center gap-2"><DoorOpen className="h-4 w-4" />All Rooms</CardTitle></CardHeader>
            <CardContent className="p-0">
              {roomsQuery.isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="divide-y divide-border">
                  {(roomsQuery.data?.rooms ?? []).map((room: any) => (
                    <div key={room.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{room.name}</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[room.status] ?? ""}`}>{room.status}</span>
                          <Badge variant="outline" className="text-xs capitalize">{room.gameMode?.replace("_", " ")}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{room.currentParticipants}/{room.maxParticipants}</span>
                          <span>Code: {room.roomCode}</span>
                          <span className="capitalize">{room.visibility}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Link href={`/rooms/${room.id}`}>
                          <Button size="sm" variant="outline" className="h-7 px-2 text-xs gap-1">
                            <Eye className="h-3 w-3" /> View
                          </Button>
                        </Link>
                        {room.status !== "cancelled" && room.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                            onClick={() => cancelMutation.mutate({ roomId: room.id })}
                            disabled={cancelMutation.isPending}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
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

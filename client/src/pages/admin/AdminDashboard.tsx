import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { Loader2, Users, DoorOpen, Trophy, Settings, Database, Activity, Shield, ChevronRight } from "@/components/SvgIcon";

function StatCard({ icon: Icon, label, value, color, href }: { icon: any; label: string; value: string | number; color: string; href?: string }) {
  const content = (
    <Card className={`border border-border hover:shadow-md transition-shadow ${href ? "cursor-pointer" : ""}`}>
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
  if (href) return <Link href={href}>{content}</Link>;
  return content;
}

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      navigate("/");
    }
  }, [loading, isAuthenticated, user]);

  const statsQuery = trpc.admin.stats.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        <Footer />
      </div>
    );
  }

  const stats = statsQuery.data;

  const adminLinks = [
    { href: "/admin/rooms", icon: DoorOpen, label: "Manage Rooms", desc: "View and manage all game rooms", color: "bg-blue-100 text-blue-600" },
    { href: "/admin/matches", icon: Trophy, label: "Match Data", desc: "Add and update cricket match data", color: "bg-green-100 text-green-600" },
    { href: "/admin/players", icon: Users, label: "Player Data", desc: "Manage cricket player profiles and stats", color: "bg-amber-100 text-amber-600" },
    { href: "/admin/questions", icon: Database, label: "Quiz Questions", desc: "Add and manage quiz question bank", color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Platform management and monitoring</p>
            </div>
            <Badge variant="secondary" className="ml-auto text-xs">Admin</Badge>
          </div>

          {/* Platform Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard icon={Users} label="Total Users" value={stats?.users ?? 0} color="bg-blue-100 text-blue-600" href="/admin/rooms" />
            <StatCard icon={DoorOpen} label="Total Rooms" value={stats?.rooms ?? 0} color="bg-green-100 text-green-600" href="/admin/rooms" />
            <StatCard icon={Activity} label="Active Rooms" value={stats?.activeRooms ?? 0} color="bg-amber-100 text-amber-600" />
            <StatCard icon={Trophy} label="Games Played" value={stats?.games ?? 0} color="bg-purple-100 text-purple-600" />
          </div>

          {/* Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="border border-border hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${link.color}`}>
                        <link.icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-foreground">{link.label}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Platform Health */}
          <Card className="border border-border mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" /> Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "API Status", status: "Operational", color: "text-green-600 bg-green-100" },
                  { label: "Database", status: "Connected", color: "text-green-600 bg-green-100" },
                  { label: "Auth Service", status: "Operational", color: "text-green-600 bg-green-100" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${item.color}`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

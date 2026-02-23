import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Trophy,
  User,
  Users,
  Home,
  BookOpen,
  Shield,
  PlusCircle,
  DoorOpen,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rooms", label: "Rooms", icon: DoorOpen },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/how-to-play", label: "How to Play", icon: BookOpen },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "VP";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-primary-foreground font-bold text-sm">VP</span>
          </div>
          <div className="hidden sm:block">
            <span className="font-display text-lg font-bold text-foreground leading-none">Vistara</span>
            <span className="font-display text-lg font-bold text-accent leading-none"> Play</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`text-sm font-medium ${location === link.href ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link href="/rooms/create" className="hidden sm:block">
                <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" />
                  <span className="hidden lg:inline">Create Room</span>
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <Avatar className="h-8 w-8 border-2 border-border">
                      <AvatarImage src={user?.avatarUrl ?? undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block text-sm font-medium text-foreground max-w-[120px] truncate">
                      {user?.name ?? "Player"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold text-foreground truncate">{user?.name ?? "Player"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/friends" className="flex items-center gap-2 cursor-pointer">
                      <Users className="h-4 w-4" /> Friends
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "admin" && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                          <Shield className="h-4 w-4" />
                          <span>Admin Panel</span>
                          <Badge variant="secondary" className="ml-auto text-xs">Admin</Badge>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <a href={getLoginUrl()}>
                <Button variant="ghost" size="sm" className="text-sm font-medium">
                  Sign In
                </Button>
              </a>
              <a href={getLoginUrl()}>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
                  Get Started
                </Button>
              </a>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-card">
              <div className="flex flex-col gap-1 mt-6">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start gap-3 text-sm font-medium ${location === link.href ? "text-primary bg-primary/10" : "text-muted-foreground"}`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Button>
                  </Link>
                ))}
                {isAuthenticated && (
                  <>
                    <div className="my-2 border-t border-border" />
                    <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground">
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Button>
                    </Link>
                    <Link href="/rooms/create" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground">
                        <PlusCircle className="h-4 w-4" /> Create Room
                      </Button>
                    </Link>
                    <Link href="/friends" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start gap-3 text-sm font-medium text-muted-foreground">
                        <Users className="h-4 w-4" /> Friends
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

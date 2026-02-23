import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import {
  Trophy,
  Users,
  BookOpen,
  Target,
  ChevronRight,
  Shield,
  Zap,
  Star,
  DoorOpen,
  Brain,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

const gameModes = [
  {
    icon: Brain,
    title: "Cricket Knowledge Quiz",
    description: "Answer questions about cricket history, rules, players, and records. Test how well you know the game.",
    badge: "Knowledge",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100 text-blue-600",
  },
  {
    icon: Users,
    title: "Team Selection Challenge",
    description: "Build the best possible team using a credit budget. Your choices are scored based on player stats and form.",
    badge: "Strategy",
    color: "bg-green-50 text-green-700 border-green-200",
    iconBg: "bg-green-100 text-green-600",
  },
  {
    icon: Target,
    title: "Strategy Challenge",
    description: "Read match situations and choose the best tactical move. Scored on cricket strategy knowledge.",
    badge: "Tactics",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    icon: Zap,
    title: "Scenario Decision Game",
    description: "Face real cricket scenarios and make decisions as captain or coach. Your choices are evaluated by experts.",
    badge: "Decision",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    iconBg: "bg-purple-100 text-purple-600",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Create your account",
    description: "Sign up for free. Set up your profile and start exploring the platform.",
  },
  {
    step: "2",
    title: "Create or join a room",
    description: "Host your own game room or join a public room. Invite friends with a room code or link.",
  },
  {
    step: "3",
    title: "Play and score",
    description: "Compete in skill-based cricket challenges. Your score is based on your knowledge and decisions.",
  },
  {
    step: "4",
    title: "Track your progress",
    description: "View your stats, game history, and rank on the leaderboard. Improve with every game.",
  },
];

const features = [
  {
    icon: DoorOpen,
    title: "User-Hosted Rooms",
    description: "Any user can create and host their own game room. Set it as public or private. You are in control.",
  },
  {
    icon: Shield,
    title: "Skill-Based Only",
    description: "All games are based on cricket knowledge, strategy, and decision-making. No luck, no guessing.",
  },
  {
    icon: Trophy,
    title: "Three Leaderboards",
    description: "Compete globally, with friends, or within your room. See where you stand at every level.",
  },
  {
    icon: Users,
    title: "Friends System",
    description: "Add friends, view their stats, and compare scores on the friends leaderboard.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Your dashboard shows all your stats, game history, and improvement over time.",
  },
  {
    icon: Star,
    title: "Free to Play",
    description: "The platform is completely free. No purchase is required to create an account or play games.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{
          backgroundImage: `url('https://files.manuscdn.com/user_upload_by_module/session_file/310519663073602365/LtUsrjkaXCFnqwRQ.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-[oklch(0.10_0.05_145/0.82)]" />
        {/* Subtle green tint gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0.06_145/0.5)] via-transparent to-[oklch(0.08_0.04_145/0.7)]" />
        <div className="container relative py-20 md:py-28 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <Badge
              variant="outline"
              className="mb-6 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)] text-xs font-medium px-3 py-1"
            >
              Free to Play · Skill-Based · Cricket
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              Play Cricket Games{" "}
              <span className="text-[oklch(0.84_0.15_85)]">With Friends</span>
            </h1>
            <p className="text-lg md:text-xl text-[oklch(0.80_0.04_145)] leading-relaxed mb-8 max-w-2xl mx-auto">
              Vistara Play is a free platform where you can host cricket game rooms, challenge friends, and test your cricket knowledge and strategy skills.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/rooms/create">
                    <Button size="lg" className="bg-[oklch(0.72_0.18_85)] hover:bg-[oklch(0.62_0.18_85)] text-[oklch(0.15_0.02_145)] font-semibold px-8 gap-2">
                      Create a Room <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/rooms">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold px-8">
                      Browse Rooms
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <a href={getLoginUrl()}>
                    <Button size="lg" className="bg-[oklch(0.72_0.18_85)] hover:bg-[oklch(0.62_0.18_85)] text-[oklch(0.15_0.02_145)] font-semibold px-8 gap-2">
                      Get Started — Free <ChevronRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <Link href="/how-to-play">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent font-semibold px-8">
                      How It Works
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <p className="mt-5 text-sm text-[oklch(0.65_0.04_145)]">
              No purchase required. Free to create an account and play.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-400 text-[oklch(0.15_0.02_145)] font-bold text-[10px] shrink-0">18+</span>
              <span className="text-xs text-[oklch(0.75_0.04_145)]">For entertainment purposes only. Users aged 18 and above.</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────────── */}
      <section className="bg-card border-b border-border py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Game Modes", value: "4" },
              { label: "Free to Play", value: "100%" },
              { label: "Skill-Based", value: "Always" },
              { label: "Support", value: "Email" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-display font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Game Modes ───────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs font-medium">Game Modes</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Four Ways to Play
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Each game mode tests a different aspect of cricket knowledge and skill. All games are scored based on your choices and answers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gameModes.map((mode) => (
              <Card key={mode.title} className="border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 group">
                <CardContent className="p-5">
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl mb-4 ${mode.iconBg}`}>
                    <mode.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className={`text-xs mb-3 ${mode.color}`}>
                    {mode.badge}
                  </Badge>
                  <h3 className="text-base font-semibold text-foreground mb-2 leading-snug">{mode.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{mode.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20 bg-secondary/40">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs font-medium">Getting Started</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Getting started on Vistara Play takes less than a minute.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step) => (
              <div key={step.step} className="relative">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-display font-bold text-lg mb-4 shrink-0">
                    {step.step}
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-3 text-xs font-medium">Platform Features</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              What the Platform Offers
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-base">
              Vistara Play provides the tools and infrastructure. You host the games and invite your friends.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4 p-5 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Disclaimer ──────────────────────────────────────────────── */}
      <section className="py-10 bg-muted/50 border-y border-border">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              About This Platform
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>This platform is free to use. No payment is required to play.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>All games are skill-based. Scores depend on your knowledge and decisions.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>Games are hosted by users, not by the platform.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>No real money, prizes, or monetary rewards are involved.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>This is not a gambling or betting platform.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>The platform does not predict match outcomes.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Ready to Play?
            </h2>
            <p className="text-muted-foreground mb-8 text-base">
              Create a free account and start hosting or joining cricket game rooms today.
            </p>
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/rooms/create">
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                    Create a Room
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="font-semibold px-8">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href={getLoginUrl()}>
                  <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8">
                    Create Free Account
                  </Button>
                </a>
                <Link href="/how-to-play">
                  <Button size="lg" variant="outline" className="font-semibold px-8">
                    Learn More
                  </Button>
                </Link>
              </div>
            )}
            <p className="mt-4 text-sm text-muted-foreground">
              Free to join. No credit card needed.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, Trophy, Zap } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: Shield,
    title: "Skill First",
    description:
      "Every game on Vistara Play is based on cricket knowledge and decision-making. No luck, no guessing — only skill.",
  },
  {
    icon: Users,
    title: "Social Play",
    description:
      "Play with friends, colleagues, or other cricket fans. Create private rooms or join public ones.",
  },
  {
    icon: Trophy,
    title: "Fair Competition",
    description:
      "Leaderboards and rankings are based purely on performance. Everyone starts on equal footing.",
  },
  {
    icon: Zap,
    title: "Free to Play",
    description:
      "The platform is completely free. No entry fees, no subscriptions, no hidden charges.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-[oklch(0.18_0.07_145)] border-b border-[oklch(0.28_0.07_145)]">
        <div className="container py-14 md:py-20">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)] text-xs font-medium"
            >
              About
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4 leading-tight">
              About Vistara Play
            </h1>
            <p className="text-[oklch(0.78_0.05_145)] text-base leading-relaxed">
              Vistara Play is a free, skill-based cricket gaming platform built for cricket fans who want to test their knowledge, compete with friends, and enjoy the game in a new way.
            </p>
          </div>
        </div>
      </section>

      {/* What We Are */}
      <section className="py-14 md:py-20 border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            What Vistara Play Is
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Vistara Play is a technology platform. It gives cricket fans the tools to create game rooms, invite friends, and play skill-based cricket games together — online, from anywhere.
            </p>
            <p>
              The platform hosts game modes based on cricket knowledge and strategy. These include cricket quizzes, team selection challenges, scenario-based decision games, and strategy rounds. All games are designed around cricket skill, not chance.
            </p>
            <p>
              Users create and manage their own game rooms. Vistara Play provides the infrastructure. The platform does not participate in or control individual user-hosted games.
            </p>
            <p>
              The platform is completely free to use. There are no entry fees, no prizes, and no monetary rewards. It is built for entertainment and skill development.
            </p>
          </div>
        </div>
      </section>

      {/* What We Are Not */}
      <section className="py-14 md:py-20 border-b border-border bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            What Vistara Play Is Not
          </h2>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Vistara Play is not a gambling platform. No real money is involved in any game. No prizes or monetary rewards are offered.
            </p>
            <p>
              Vistara Play is not a prediction platform. Games are not based on predicting match outcomes or future events. All games are based on existing cricket knowledge and decision-making.
            </p>
            <p>
              Vistara Play does not organise or control user-hosted games. The platform provides the tools; users run their own rooms.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-14 md:py-20 border-b border-border">
        <div className="container max-w-4xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-8">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {values.map((v) => (
              <Card key={v.title} className="border border-border bg-card">
                <CardContent className="p-5 flex gap-4 items-start">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <v.icon className="h-4.5 w-4.5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">
                      {v.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-14 md:py-20 border-b border-border bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-xl font-display font-bold text-foreground mb-6">
            Company Information
          </h2>
          <div className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <p><span className="text-foreground font-medium">Platform name:</span> Vistara Play</p>
            <p><span className="text-foreground font-medium">Platform type:</span> Free, skill-based cricket gaming platform</p>
            <p><span className="text-foreground font-medium">For users aged:</span> 18 and above</p>
            <p><span className="text-foreground font-medium">Address:</span> E-15, Block E, East of Kailash, New Delhi, Delhi 110065, India</p>
            <p><span className="text-foreground font-medium">Email:</span>{" "}
              <a href="mailto:Support@vistaraplay.com" className="text-primary hover:underline">
                Support@vistaraplay.com
              </a>
            </p>
            <p><span className="text-foreground font-medium">Phone:</span>{" "}
              <a href="tel:+919557002685" className="text-primary hover:underline">
                +91 9557002685
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20">
        <div className="container max-w-xl text-center">
          <h2 className="text-xl font-display font-bold text-foreground mb-3">
            Ready to Play?
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Create an account and start playing skill-based cricket games with friends. It is free.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/rooms">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                Browse Rooms
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="sm" variant="outline" className="font-medium">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, Target, Zap, DoorOpen, Trophy, UserPlus, BarChart3 } from "lucide-react";

const gameModeDetails = [
  {
    icon: Brain,
    title: "Cricket Knowledge Quiz",
    badge: "Knowledge",
    steps: [
      "The host creates a room and selects Quiz as the game mode.",
      "Participants join using the room code or invite link.",
      "The host starts the game. Each player answers cricket questions independently.",
      "Questions cover history, rules, players, and records.",
      "Each correct answer earns points.",
      "Final scores are shown on the room leaderboard.",
    ],
    scoring: "Points per correct answer (5–50 depending on difficulty). No points for wrong answers.",
  },
  {
    icon: Users,
    title: "Team Selection Challenge",
    badge: "Strategy",
    steps: [
      "The host creates a room linked to a cricket match.",
      "Each player gets a credit budget (100 credits).",
      "Players pick 11 players from the available pool within the budget.",
      "Players also select a captain and vice-captain.",
      "Teams are scored based on player stats, form, and role balance.",
      "The player with the highest team score wins the room.",
    ],
    scoring: "Score based on: team balance, player form, budget discipline, and role distribution.",
  },
  {
    icon: Target,
    title: "Strategy Challenge",
    badge: "Tactics",
    steps: [
      "The host creates a room with Strategy mode.",
      "Players are shown a series of match situations.",
      "Each situation has 4 tactical options to choose from.",
      "Players select the option they think is the best tactical move.",
      "Answers are evaluated against expert cricket strategy.",
      "Points are awarded for each correct strategic choice.",
    ],
    scoring: "15 points per correct strategic decision. Explanation shown after each answer.",
  },
  {
    icon: Zap,
    title: "Scenario Decision Game",
    badge: "Decision",
    steps: [
      "The host creates a room with Scenario mode.",
      "Players face real-world cricket scenarios as captain or coach.",
      "Each scenario has multiple decision options.",
      "Players choose the best course of action.",
      "Decisions are scored based on cricket knowledge and logic.",
      "The player with the most correct decisions wins.",
    ],
    scoring: "Points per correct decision. Explanations provided after each scenario.",
  },
];

export default function HowToPlay() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-gradient-to-br from-[oklch(0.20_0.07_145)] to-[oklch(0.34_0.13_145)] py-14">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)]">Guide</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">How to Play</h1>
          <p className="text-[oklch(0.80_0.04_145)] max-w-xl mx-auto text-base">
            A step-by-step guide to getting started on Vistara Play and understanding each game mode.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <h2 className="text-2xl font-display font-bold text-foreground mb-8 text-center">Quick Start</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: UserPlus, step: "1", title: "Create an account", desc: "Sign up for free. No payment required." },
              { icon: DoorOpen, step: "2", title: "Find or create a room", desc: "Browse public rooms or create your own." },
              { icon: Trophy, step: "3", title: "Play the game", desc: "Answer questions or make strategy decisions." },
              { icon: BarChart3, step: "4", title: "Track your score", desc: "View your rank on the leaderboard." },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center p-5 rounded-xl border border-border bg-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg mb-3">{item.step}</div>
                <item.icon className="h-5 w-5 text-muted-foreground mb-2" />
                <h3 className="text-sm font-semibold text-foreground mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-secondary/40">
        <div className="container">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">Room System</h2>
          <p className="text-muted-foreground text-center mb-8 text-sm max-w-xl mx-auto">Rooms are created and managed by users. The platform provides the infrastructure.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto">
            {[
              { title: "Creating a Room", items: ["Choose a game mode", "Set room name and description", "Choose public or private visibility", "Set maximum participants", "Share the room code or invite link"] },
              { title: "Joining a Room", items: ["Browse public rooms on the Rooms page", "Enter a room code on the Join page", "Click an invite link shared by a friend", "Join before the host starts the game", "View the room lobby and wait for start"] },
            ].map((section) => (
              <Card key={section.title} className="border border-border">
                <CardHeader className="pb-3"><CardTitle className="text-base font-semibold">{section.title}</CardTitle></CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />{item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          <h2 className="text-2xl font-display font-bold text-foreground mb-2 text-center">Game Mode Details</h2>
          <p className="text-muted-foreground text-center mb-10 text-sm max-w-xl mx-auto">Each game mode has different rules and scoring.</p>
          <div className="space-y-6">
            {gameModeDetails.map((mode) => (
              <Card key={mode.title} className="border border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <mode.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-base font-semibold text-foreground">{mode.title}</h3>
                        <Badge variant="secondary" className="text-xs">{mode.badge}</Badge>
                      </div>
                      <ol className="space-y-1.5 mb-4">
                        {mode.steps.map((step, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary font-medium shrink-0">{i + 1}.</span>{step}
                          </li>
                        ))}
                      </ol>
                      <div className="p-3 rounded-lg bg-secondary/60 text-sm">
                        <span className="font-medium text-foreground">Scoring: </span>
                        <span className="text-muted-foreground">{mode.scoring}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

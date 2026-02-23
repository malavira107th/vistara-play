import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Mail } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-[oklch(0.20_0.07_145)] to-[oklch(0.34_0.13_145)] py-14">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)]">About</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">About Vistara Play</h1>
          <p className="text-[oklch(0.80_0.04_145)] max-w-xl mx-auto">A free, skill-based cricket gaming platform for cricket fans.</p>
        </div>
      </section>
      <section className="py-14">
        <div className="container max-w-3xl">
          <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-3">What is Vistara Play?</h2>
              <p>Vistara Play is a free online platform where cricket fans can host game rooms, challenge friends, and test their cricket knowledge and strategy skills. The platform provides the technology and infrastructure. Users create and manage their own game rooms.</p>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-3">What We Offer</h2>
              <ul className="space-y-2">
                {["User-hosted game rooms (public or private)","Skill-based game modes: quiz, team selection, strategy, scenario","Three leaderboards: global, friends, and room","Friends system to connect and compete with people you know","Personal dashboard with stats and game history","Free to use — no payment required"].map(item => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-3">Our Role</h2>
              <p>Vistara Play is a technology provider. We build and maintain the platform. Users host and manage their own games. We do not create, control, or participate in user-hosted games.</p>
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-3">Skill-Based Games Only</h2>
              <p>All games on this platform are based on cricket knowledge, strategy, and decision-making. There are no prediction-based mechanics, no real money, and no monetary rewards. This is not a gambling or betting platform.</p>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-2">Contact Us</h3>
              <a href="mailto:Support@vistaraplay.com" className="flex items-center gap-2 text-sm text-primary hover:underline">
                <Mail className="h-4 w-4" />Support@vistaraplay.com
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

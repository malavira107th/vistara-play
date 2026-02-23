import { Link } from "wouter";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-primary-foreground font-bold text-xs">VP</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground">
                Vistara <span className="text-accent">Play</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A free skill-based cricket gaming platform. Host rooms, play with friends, and test your cricket knowledge.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/rooms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Rooms</Link></li>
              <li><Link href="/rooms/create" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create a Room</Link></li>
              <li><Link href="/leaderboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Leaderboard</Link></li>
              <li><Link href="/how-to-play" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How to Play</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Support</h4>
            <a
              href="mailto:Support@vistaraplay.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Mail className="h-4 w-4 shrink-0" />
              Support@vistaraplay.com
            </a>
            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              This platform is free to use. No purchase required to play.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Vistara Play. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

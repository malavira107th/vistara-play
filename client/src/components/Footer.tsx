import { Link } from "wouter";
import { Mail } from "@/components/SvgIcon";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      {/* 18+ / Entertainment banner */}
      <div className="bg-primary/5 border-b border-border py-3 px-4">
        <div className="container flex flex-col sm:flex-row items-center justify-center gap-2 text-center sm:text-left">
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500 text-white font-bold text-xs shrink-0">18+</span>
          <p className="text-xs text-muted-foreground">
            Vistara Play is for users aged 18 and above. This platform is for entertainment purposes only. No real money is involved. Skill-based games only.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663073602365/vaNrCiFPaQuDrqog.webp" alt="Vistara Play" className="h-8 w-auto object-contain" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A free skill-based cricket gaming platform for entertainment. Host rooms, play with friends, and test your cricket knowledge.
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
              <li><Link href="/responsible-play" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Responsible Play</Link></li>
            </ul>
          </div>

          {/* Support */}
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
              This platform is free to use. No purchase required. No real money involved.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border space-y-3">
          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
            <strong className="text-foreground">Disclaimer:</strong> Vistara Play is a free-to-play entertainment platform. All games are skill-based and for recreational use only. No real money, prizes, or monetary rewards are involved at any stage. This platform is intended for users aged 18 years and above. The platform acts as a technology provider only and does not host or control user-created games.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Vistara Play. All rights reserved.
            </p>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
              <Link href="/responsible-play" className="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium">Responsible Play</Link>
              <Link href="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

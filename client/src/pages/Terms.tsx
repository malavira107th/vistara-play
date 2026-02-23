import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-[oklch(0.20_0.07_145)] to-[oklch(0.34_0.13_145)] py-14">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)]">Legal</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Terms of Service</h1>
          <p className="text-[oklch(0.80_0.04_145)] max-w-xl mx-auto">Last updated: February 2025</p>
        </div>
      </section>
      <section className="py-14">
        <div className="container max-w-3xl">
          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            {[
              { title: "1. Acceptance of Terms", content: "By accessing or using Vistara Play, you agree to these Terms of Service. If you do not agree, do not use the platform." },
              { title: "2. Platform Description", content: "Vistara Play is a free, skill-based cricket gaming platform. We provide the technology and infrastructure. Users create and manage their own game rooms. We do not host, control, or participate in user-hosted games." },
              { title: "3. Free to Use", content: "The platform is free to use. No payment is required to create an account or play games. We do not charge entry fees for any game or room." },
              { title: "4. Skill-Based Games", content: "All games on this platform are based on cricket knowledge, strategy, and decision-making. There are no prediction-based mechanics. This platform does not involve real money, prizes, or monetary rewards of any kind." },
              { title: "5. User Responsibilities", content: "Users are responsible for the rooms they create and the games they host. Users must not use the platform for any illegal activity. Users must not harass, abuse, or harm other users." },
              { title: "6. Account", content: "You are responsible for maintaining the security of your account. You must provide accurate information when registering. We may suspend or terminate accounts that violate these terms." },
              { title: "7. Content", content: "Users may not post offensive, illegal, or harmful content. We reserve the right to remove any content that violates our policies." },
              { title: "8. Limitation of Liability", content: "Vistara Play is provided as-is. We are not liable for any losses or damages arising from use of the platform. We do not guarantee uninterrupted or error-free service." },
              { title: "9. Changes to Terms", content: "We may update these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms." },
              { title: "10. Contact", content: "For questions about these terms, contact us at Support@vistaraplay.com." },
            ].map(section => (
              <div key={section.title}>
                <h2 className="text-base font-semibold text-foreground mb-2">{section.title}</h2>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

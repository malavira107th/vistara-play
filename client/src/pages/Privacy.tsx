import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-[oklch(0.20_0.07_145)] to-[oklch(0.34_0.13_145)] py-14">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)]">Legal</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-[oklch(0.80_0.04_145)] max-w-xl mx-auto">Last updated: February 2025</p>
        </div>
      </section>
      <section className="py-14">
        <div className="container max-w-3xl">
          <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
            {[
              { title: "1. Information We Collect", content: "We collect information you provide when creating an account (name, email). We collect usage data such as games played, scores, and room activity. We do not collect payment information as the platform is free." },
              { title: "2. How We Use Your Information", content: "We use your information to provide and improve the platform, display your profile and stats to other users, and send important service notifications. We do not sell your personal information to third parties." },
              { title: "3. Information Shared with Others", content: "Your username, profile, and game stats are visible to other users on the platform. Room activity is visible to participants of that room. Your email is not shared with other users." },
              { title: "4. Data Security", content: "We take reasonable steps to protect your information. However, no internet service is completely secure. Use the platform at your own risk." },
              { title: "5. Cookies", content: "We use cookies to maintain your login session. We may use analytics cookies to understand how the platform is used. You can disable cookies in your browser settings, but this may affect platform functionality." },
              { title: "6. Your Rights", content: "You can update your profile information at any time. You can request deletion of your account by contacting us. We will respond to data requests within 30 days." },
              { title: "7. Children", content: "This platform is not intended for users under 13 years of age. We do not knowingly collect information from children under 13." },
              { title: "8. Changes to This Policy", content: "We may update this policy at any time. We will notify users of significant changes. Continued use of the platform constitutes acceptance." },
              { title: "9. Contact", content: "For privacy questions or requests, contact us at Support@vistaraplay.com." },
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

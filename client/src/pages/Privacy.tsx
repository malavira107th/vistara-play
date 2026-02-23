import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const LAST_UPDATED = "24 February 2025";

const sections = [
  {
    title: "1. Who We Are",
    content: `Vistara Play is a free, skill-based cricket gaming platform operated from E-15, Block E, East of Kailash, New Delhi, Delhi 110065, India.

If you have any questions about this Privacy Policy or how we handle your data, contact us at Support@vistaraplay.com.`,
  },
  {
    title: "2. What Data We Collect",
    content: `We collect only the data needed to run the platform:

Account information: Your name and email address, provided when you register.

Profile information: Any additional details you choose to add to your profile, such as a username or bio.

Usage data: Information about how you use the platform, such as rooms you create or join, games you play, and scores.

Technical data: Your IP address, browser type, and device type. This is collected automatically when you use the platform.

We do not collect payment information. The platform is free and no payments are processed.`,
  },
  {
    title: "3. How We Use Your Data",
    content: `We use your data to:

• Run your account and let you use the platform.
• Show your profile, stats, and game history.
• Display leaderboards and friend activity.
• Improve the platform and fix technical issues.
• Respond to your support requests.

We do not sell your data to anyone. We do not use your data for advertising targeting.`,
  },
  {
    title: "4. Cookies",
    content: `We use cookies to keep you logged in to your account. These are session cookies and are required for the platform to work.

We do not use advertising cookies or tracking cookies from third parties.

You can disable cookies in your browser settings, but this will prevent you from logging in to the platform.`,
  },
  {
    title: "5. Data Sharing",
    content: `We do not sell or share your personal data with third parties, except in the following limited cases:

Service providers: We use third-party services to host the platform (such as database and server providers). These providers only process your data to run the platform and are bound by confidentiality agreements.

Legal requirements: We may share your data if required by law or to protect the rights and safety of users.`,
  },
  {
    title: "6. Data Retention",
    content: `We keep your account data for as long as your account is active.

If you close your account, we will delete your personal data within 30 days, except where we are required to keep it for legal reasons.

Usage data and game history may be retained in anonymised form for platform analytics.`,
  },
  {
    title: "7. Your Rights",
    content: `You have the right to:

• Access the personal data we hold about you.
• Correct any inaccurate data.
• Request deletion of your data.
• Object to how we use your data.

To exercise any of these rights, contact us at Support@vistaraplay.com. We will respond within 30 days.`,
  },
  {
    title: "8. Children",
    content: `Vistara Play is for users aged 18 and above only. We do not knowingly collect data from anyone under 18.

If we become aware that a user is under 18, we will delete their account and all associated data immediately.`,
  },
  {
    title: "9. Security",
    content: `We take reasonable steps to protect your data from unauthorised access, loss, or misuse. This includes secure connections (HTTPS) and access controls on our systems.

No system is completely secure. If you believe your account has been compromised, contact us immediately at Support@vistaraplay.com.`,
  },
  {
    title: "10. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date at the top of this page.

Continued use of Vistara Play after changes are posted means you accept the updated policy.`,
  },
  {
    title: "11. Contact",
    content: `For any privacy-related questions or requests:

Email: Support@vistaraplay.com
Phone: +91 9557002685
Address: E-15, Block E, East of Kailash, New Delhi, Delhi 110065, India`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <section className="bg-[oklch(0.18_0.07_145)] border-b border-[oklch(0.28_0.07_145)]">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)] text-xs font-medium"
            >
              Legal
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Privacy Policy
            </h1>
            <p className="text-[oklch(0.75_0.04_145)] text-sm">
              Last updated: {LAST_UPDATED}
            </p>
          </div>
        </div>
      </section>

      <section className="flex-1 py-12 md:py-16">
        <div className="container max-w-3xl">
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-base font-semibold text-foreground mb-3">
                  {section.title}
                </h2>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

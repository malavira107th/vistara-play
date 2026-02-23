import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const LAST_UPDATED = "24 February 2025";

const sections = [
  {
    title: "1. About This Platform",
    content: `Vistara Play is a free, skill-based cricket gaming platform. It provides technology tools that allow registered users to create game rooms, invite other users, and participate in skill-based cricket challenges such as quizzes, team selection, and strategy games.

Vistara Play is operated by the company at E-15, Block E, East of Kailash, New Delhi, Delhi 110065, India. You can contact us at Support@vistaraplay.com.

Vistara Play is a technology provider only. It does not host, organise, or control any individual user-created game rooms. All game rooms are created and managed by users themselves.`,
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age to register and use Vistara Play.

By creating an account, you confirm that you are 18 years of age or older. If we learn that a user is under 18, we will close their account immediately.

This platform is intended for users in India. Users outside India access the platform at their own risk and are responsible for compliance with their local laws.`,
  },
  {
    title: "3. Account Registration",
    content: `To use the platform, you must create an account. You agree to provide accurate and complete information during registration and to keep your account details up to date.

You are responsible for keeping your login credentials secure. You must not share your account with anyone else. You are responsible for all activity that takes place under your account.

If you believe your account has been accessed without your permission, contact us immediately at Support@vistaraplay.com.`,
  },
  {
    title: "4. Free to Play",
    content: `Vistara Play is completely free to use. There are no entry fees, subscription charges, or in-app purchases required to access any feature of the platform.

No real money is involved in any game on this platform. No prizes, rewards, or monetary benefits are offered or implied. All games are for entertainment and skill development only.`,
  },
  {
    title: "5. Skill-Based Games Only",
    content: `All games on Vistara Play are based on cricket knowledge, strategy, and decision-making. Games include cricket quizzes, team selection challenges, scenario-based decisions, and strategy games.

This platform does not include any prediction-based, chance-based, or gambling mechanics. No game outcome is based on luck or random chance. Users compete based on their own skill and cricket knowledge.`,
  },
  {
    title: "6. User-Hosted Rooms",
    content: `Users may create their own game rooms and invite others to join. The user who creates a room is the room host and is responsible for managing that room.

Vistara Play provides the technology infrastructure for rooms. It does not participate in, monitor, or control the content or conduct within individual user-hosted rooms.

Room hosts must ensure that their rooms comply with these Terms of Service. Vistara Play may remove any room that violates these terms.`,
  },
  {
    title: "7. Prohibited Conduct",
    content: `You must not use Vistara Play to:

• Harass, abuse, or threaten other users.
• Post or share content that is offensive, harmful, or illegal.
• Attempt to cheat, manipulate scores, or gain unfair advantages.
• Use automated tools, bots, or scripts to interact with the platform.
• Impersonate another person or misrepresent your identity.
• Attempt to access parts of the platform you are not authorised to access.
• Use the platform for any commercial purpose without our written permission.

Violation of these rules may result in immediate account suspension or termination.`,
  },
  {
    title: "8. Intellectual Property",
    content: `All content on Vistara Play — including the platform name, logo, design, text, and software — is owned by Vistara Play or its licensors. You may not copy, reproduce, or distribute any part of the platform without our written permission.

Content you create on the platform (such as room names or profile information) remains yours. By posting it, you give Vistara Play a licence to display it on the platform.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `Vistara Play provides this platform on an "as is" basis. We do not guarantee that the platform will be available at all times or free from errors.

Vistara Play is not responsible for any loss or damage arising from your use of the platform, including any issues within user-hosted game rooms.

We are not responsible for the actions or content of other users on the platform.`,
  },
  {
    title: "10. Changes to These Terms",
    content: `We may update these Terms of Service from time to time. When we do, we will update the "Last Updated" date at the top of this page.

Continued use of Vistara Play after changes are posted means you accept the updated terms. If you do not agree with any changes, you should stop using the platform.`,
  },
  {
    title: "11. Termination",
    content: `You may close your account at any time by contacting us at Support@vistaraplay.com.

We may suspend or terminate your account if you violate these Terms of Service, without prior notice.`,
  },
  {
    title: "12. Governing Law",
    content: `These Terms of Service are governed by the laws of India. Any disputes arising from your use of Vistara Play will be subject to the jurisdiction of the courts in New Delhi, India.`,
  },
  {
    title: "13. Contact",
    content: `If you have any questions about these Terms of Service, please contact us:

Email: Support@vistaraplay.com
Phone: +91 9557002685
Address: E-15, Block E, East of Kailash, New Delhi, Delhi 110065, India`,
  },
];

export default function Terms() {
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
              Terms of Service
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

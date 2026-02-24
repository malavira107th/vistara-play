import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Clock, Users, AlertCircle, Heart, Info } from "@/components/SvgIcon";

const sections = [
  {
    icon: Info,
    title: "Entertainment Purposes Only",
    body: "Vistara Play is a free-to-play skill-based cricket gaming platform. All games on this platform are designed for entertainment and recreational use only. No real money is involved at any stage. You cannot win or lose money on this platform.",
  },
  {
    icon: Shield,
    title: "This Platform Is for Users Aged 18 and Above",
    body: "Vistara Play is intended for users who are 18 years of age or older. By using this platform, you confirm that you meet this age requirement. If you are under 18, please do not use this platform.",
  },
  {
    icon: Clock,
    title: "Manage Your Time",
    body: "Playing games is meant to be enjoyable. We encourage you to set personal time limits for your gaming sessions. Take regular breaks and ensure that gaming does not interfere with your daily responsibilities, work, studies, or personal relationships.",
  },
  {
    icon: Users,
    title: "Play for Fun, Not Pressure",
    body: "Games on Vistara Play are hosted by users and are meant to be social and enjoyable. Never feel pressured to join or continue a game. You are always free to leave a room at any time. The platform is about cricket knowledge, strategy, and friendly competition.",
  },
  {
    icon: Heart,
    title: "Your Well-Being Comes First",
    body: "If you feel that gaming is negatively affecting your mood, sleep, or daily life, take a break. Talk to someone you trust. Your well-being is more important than any game. Vistara Play is here to add enjoyment to your life, not to cause stress.",
  },
  {
    icon: AlertCircle,
    title: "No Real-Money Transactions",
    body: "Vistara Play does not facilitate any real-money transactions, deposits, withdrawals, or prizes. All scores, points, and leaderboard rankings are for entertainment and personal achievement only. They have no monetary value.",
  },
];

export default function ResponsiblePlay() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary text-primary-foreground py-14 px-4">
          <div className="container max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 mb-5">
              <Shield className="h-7 w-7 text-accent" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Responsible Play
            </h1>
            <p className="text-primary-foreground/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              Vistara Play is a free entertainment platform. We want every user to have a safe, enjoyable, and responsible experience. Please read the following guidelines carefully.
            </p>
          </div>
        </section>

        {/* 18+ Notice Banner */}
        <section className="bg-amber-50 border-y border-amber-200 py-4 px-4">
          <div className="container max-w-3xl flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-500 text-white font-bold text-sm shrink-0">18+</span>
            <p className="text-amber-800 text-sm font-medium">
              This platform is strictly for users aged 18 years and above. It is for entertainment purposes only. No real money is involved.
            </p>
          </div>
        </section>

        {/* Sections */}
        <section className="py-12 px-4">
          <div className="container max-w-3xl space-y-8">
            {sections.map((s, i) => (
              <div key={i} className="flex gap-4 p-6 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
                <div className="shrink-0 mt-0.5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="font-display font-semibold text-foreground text-lg mb-2">{s.title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Key Facts Table */}
        <section className="py-8 px-4 bg-muted/30">
          <div className="container max-w-3xl">
            <h2 className="font-display font-bold text-xl text-foreground mb-5 text-center">Platform Facts at a Glance</h2>
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="text-left px-5 py-3 font-semibold text-foreground">Topic</th>
                    <th className="text-left px-5 py-3 font-semibold text-foreground">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr><td className="px-5 py-3 text-muted-foreground">Platform type</td><td className="px-5 py-3 text-foreground font-medium">Free-to-play entertainment</td></tr>
                  <tr><td className="px-5 py-3 text-muted-foreground">Minimum age</td><td className="px-5 py-3 text-foreground font-medium">18 years and above</td></tr>
                  <tr><td className="px-5 py-3 text-muted-foreground">Real money involved</td><td className="px-5 py-3 text-foreground font-medium">No — never</td></tr>
                  <tr><td className="px-5 py-3 text-muted-foreground">Prizes or winnings</td><td className="px-5 py-3 text-foreground font-medium">No monetary prizes</td></tr>
                  <tr><td className="px-5 py-3 text-muted-foreground">Game type</td><td className="px-5 py-3 text-foreground font-medium">Skill-based cricket knowledge and strategy</td></tr>
                  <tr><td className="px-5 py-3 text-muted-foreground">Who hosts games</td><td className="px-5 py-3 text-foreground font-medium">Users host their own rooms</td></tr>
                  <tr><td className="px-5 py-3 text-muted-foreground">Platform role</td><td className="px-5 py-3 text-foreground font-medium">Technology provider only</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-10 px-4">
          <div className="container max-w-3xl text-center">
            <p className="text-muted-foreground text-sm">
              If you have any concerns or questions about responsible play, please contact us at{" "}
              <a href="mailto:Support@vistaraplay.com" className="text-primary font-medium hover:underline">
                Support@vistaraplay.com
              </a>
              . We are here to help.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

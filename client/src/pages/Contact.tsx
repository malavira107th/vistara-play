import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Page Header */}
      <section className="bg-[oklch(0.18_0.07_145)] border-b border-[oklch(0.28_0.07_145)]">
        <div className="container py-12 md:py-16">
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)] text-xs font-medium"
            >
              Support
            </Badge>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              Contact Us
            </h1>
            <p className="text-[oklch(0.75_0.04_145)] text-base leading-relaxed">
              Have a question or need help? Reach out to our support team. We
              will get back to you as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl">

            {/* Contact Details */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                Get in Touch
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Vistara Play is a free skill-based cricket gaming platform. If
                you have questions about your account, game rooms, or the
                platform in general, our support team is here to help.
              </p>

              <div className="space-y-4">
                {/* Email */}
                <Card className="border-border bg-card">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[oklch(0.72_0.18_85/0.12)] shrink-0">
                      <Mail className="h-5 w-5 text-[oklch(0.72_0.18_85)]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Email Support
                      </p>
                      <a
                        href="mailto:Support@vistaraplay.com"
                        className="text-sm font-semibold text-foreground hover:text-[oklch(0.72_0.18_85)] transition-colors"
                      >
                        Support@vistaraplay.com
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">
                        For account, room, and platform queries
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Phone */}
                <Card className="border-border bg-card">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[oklch(0.72_0.18_85/0.12)] shrink-0">
                      <Phone className="h-5 w-5 text-[oklch(0.72_0.18_85)]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <a
                        href="tel:+919557002685"
                        className="text-sm font-semibold text-foreground hover:text-[oklch(0.72_0.18_85)] transition-colors"
                      >
                        +91 9557002685
                      </a>
                      <p className="text-xs text-muted-foreground mt-1">
                        Monday to Saturday, 10:00 AM – 6:00 PM IST
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card className="border-border bg-card">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[oklch(0.72_0.18_85/0.12)] shrink-0">
                      <MapPin className="h-5 w-5 text-[oklch(0.72_0.18_85)]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Office Address
                      </p>
                      <p className="text-sm font-semibold text-foreground leading-relaxed">
                        E-15, Block E, East of Kailash,<br />
                        New Delhi, Delhi 110065,<br />
                        India
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Support Hours */}
                <Card className="border-border bg-card">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[oklch(0.72_0.18_85/0.12)] shrink-0">
                      <Clock className="h-5 w-5 text-[oklch(0.72_0.18_85)]" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Support Hours
                      </p>
                      <div className="text-sm text-foreground space-y-0.5">
                        <p>
                          <span className="font-medium">Monday – Friday:</span>{" "}
                          10:00 AM – 6:00 PM IST
                        </p>
                        <p>
                          <span className="font-medium">Saturday:</span>{" "}
                          10:00 AM – 2:00 PM IST
                        </p>
                        <p>
                          <span className="font-medium">Sunday:</span> Closed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* What We Can Help With */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">
                What We Can Help With
              </h2>

              <div className="space-y-3">
                {[
                  {
                    title: "Account Issues",
                    desc: "Login problems, profile updates, or account access.",
                  },
                  {
                    title: "Room & Game Questions",
                    desc: "Help with creating rooms, joining games, or understanding game modes.",
                  },
                  {
                    title: "Technical Problems",
                    desc: "Bugs, errors, or anything not working as expected on the platform.",
                  },
                  {
                    title: "Platform Feedback",
                    desc: "Suggestions to improve Vistara Play for all users.",
                  },
                  {
                    title: "Responsible Play",
                    desc: "Questions about our responsible play guidelines or platform policies.",
                  },
                  {
                    title: "General Enquiries",
                    desc: "Any other question about the platform or how it works.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-[oklch(0.72_0.18_85/0.4)] transition-colors"
                  >
                    <MessageSquare className="h-4 w-4 text-[oklch(0.72_0.18_85)] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Disclaimer note */}
              <div className="rounded-lg border border-[oklch(0.72_0.18_85/0.3)] bg-[oklch(0.72_0.18_85/0.06)] p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-semibold text-foreground">
                    Please note:
                  </span>{" "}
                  Vistara Play is a technology platform only. We provide the
                  tools for users to host and join cricket game rooms. We do not
                  manage or control individual user-hosted games. For issues
                  within a specific game room, please contact the room host
                  directly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Clock, MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <section className="bg-gradient-to-br from-[oklch(0.20_0.07_145)] to-[oklch(0.34_0.13_145)] py-14">
        <div className="container text-center">
          <Badge variant="outline" className="mb-4 border-[oklch(0.72_0.18_85/0.4)] text-[oklch(0.84_0.15_85)] bg-[oklch(0.72_0.18_85/0.1)]">Support</Badge>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Contact Us</h1>
          <p className="text-[oklch(0.80_0.04_145)] max-w-xl mx-auto">We are here to help with any questions about the platform.</p>
        </div>
      </section>
      <section className="py-14">
        <div className="container max-w-2xl">
          <div className="grid grid-cols-1 gap-5">
            <Card className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Email Support</h3>
                    <p className="text-sm text-muted-foreground mb-2">Send us an email for any platform questions or issues.</p>
                    <a href="mailto:Support@vistaraplay.com" className="text-sm text-primary font-medium hover:underline">Support@vistaraplay.com</a>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Response Time</h3>
                    <p className="text-sm text-muted-foreground">We aim to respond to all emails within 2 business days.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">What to Include</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>Your username or account email</li>
                      <li>A clear description of your question or issue</li>
                      <li>Any relevant room codes or game details</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

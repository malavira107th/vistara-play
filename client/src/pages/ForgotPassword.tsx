import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    forgotMutation.mutate({ email, origin: window.location.origin });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0d1f0d] to-[#1a0a00] -z-10" />
      <div className="absolute inset-0 bg-[url('/assets/hero-bg.webp')] bg-cover bg-center opacity-10 -z-10" />

      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/">
            <img src="/assets/logo.webp" alt="Vistara Play" className="h-14 w-auto cursor-pointer" />
          </Link>
        </div>

        <Card className="border border-white/10 bg-black/60 backdrop-blur-md shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">Forgot Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="h-12 w-12 text-[#c9a84c] mx-auto" />
                <h3 className="text-white font-semibold text-lg">Check your inbox</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  If an account exists for <span className="text-white font-medium">{email}</span>, you'll receive a password reset link within a few minutes.
                </p>
                <p className="text-gray-500 text-xs">
                  Didn't get it? Check your spam folder or{" "}
                  <button
                    className="text-[#c9a84c] hover:underline"
                    onClick={() => { setSubmitted(false); setEmail(""); }}
                  >
                    try again
                  </button>.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c9a84c] focus:ring-[#c9a84c]/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  className="w-full bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold h-11 text-base"
                >
                  {forgotMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Sending…</>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

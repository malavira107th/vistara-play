import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, Eye, EyeOff, ArrowLeft, AlertTriangle } from "lucide-react";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => setSuccess(true),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    resetMutation.mutate({ token, password });
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
            <CardTitle className="text-2xl font-bold text-white">Set New Password</CardTitle>
            <CardDescription className="text-gray-400">
              Choose a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!token ? (
              <div className="text-center space-y-4 py-4">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
                <p className="text-gray-400 text-sm">Invalid reset link. Please request a new one.</p>
                <Link href="/forgot-password" className="text-[#c9a84c] hover:underline text-sm">
                  Request new link
                </Link>
              </div>
            ) : success ? (
              <div className="text-center space-y-4 py-4">
                <CheckCircle2 className="h-12 w-12 text-[#c9a84c] mx-auto" />
                <h3 className="text-white font-semibold text-lg">Password updated!</h3>
                <p className="text-gray-400 text-sm">Your password has been changed successfully.</p>
                <Button
                  onClick={() => navigate("/login")}
                  className="bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold"
                >
                  Sign In Now
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="new-password"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c9a84c] focus:ring-[#c9a84c]/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#c9a84c] focus:ring-[#c9a84c]/20"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={resetMutation.isPending}
                  className="w-full bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold h-11 text-base"
                >
                  {resetMutation.isPending ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Updating…</>
                  ) : (
                    "Update Password"
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

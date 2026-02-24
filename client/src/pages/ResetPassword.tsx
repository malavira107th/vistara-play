import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle } from "lucide-react";

/**
 * This page is kept for backward compatibility with any old reset links.
 * The reset flow now happens directly on /forgot-password.
 */
export default function ResetPassword() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0d1f0d] to-[#1a0a00] -z-10" />

      <div className="w-full max-w-md text-center space-y-6">
        <Link href="/">
          <img src="/assets/logo.webp" alt="Vistara Play" className="h-14 w-auto mx-auto cursor-pointer" />
        </Link>

        <div className="border border-white/10 bg-black/60 backdrop-blur-md rounded-xl p-8 space-y-4">
          <AlertTriangle className="h-12 w-12 text-[#c9a84c] mx-auto" />
          <h2 className="text-white font-bold text-xl">Reset Your Password</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            To reset your password, please use the Forgot Password page and enter your email address.
          </p>
          <Button
            onClick={() => navigate("/forgot-password")}
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-black font-semibold w-full"
          >
            Go to Forgot Password
          </Button>
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#c9a84c] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

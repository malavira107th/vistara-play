import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle2, AlertTriangle } from "@/components/SvgIcon";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY ?? "6Ldys3UsAAAAAIvO7p8XKO6_eUqOJ9dJVCtTQQYi";
type Step = "captcha" | "age" | "done";

// Extend window to include grecaptcha
declare global {
  interface Window {
    grecaptcha: {
      render: (container: string | HTMLElement, params: object) => number;
      getResponse: (widgetId?: number) => string;
      reset: (widgetId?: number) => void;
    };
    onRecaptchaLoad: () => void;
  }
}

interface VerificationGateProps {
  children: React.ReactNode;
}

export default function VerificationGate({ children }: VerificationGateProps) {
  const [step, setStep] = useState<Step>("captcha");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [ageError, setAgeError] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  // Track whether the user has triggered reCAPTCHA load
  const [recaptchaRequested, setRecaptchaRequested] = useState(false);
  const [recaptchaLoading, setRecaptchaLoading] = useState(false);
  const widgetRendered = useRef(false);

  // Load reCAPTCHA script ONLY when user clicks "Load Verification"
  // This defers ~1,068 KiB of Google CDN JS from the initial page load
  const loadRecaptcha = useCallback(() => {
    if (recaptchaRequested) return;
    setRecaptchaRequested(true);
    setRecaptchaLoading(true);

    window.onRecaptchaLoad = () => {
      setCaptchaReady(true);
      setRecaptchaLoading(false);
    };

    if (document.getElementById("recaptcha-script")) {
      // Script already present (e.g. back navigation)
      if (window.grecaptcha) {
        setCaptchaReady(true);
        setRecaptchaLoading(false);
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, [recaptchaRequested]);

  // Render reCAPTCHA widget once script is ready
  useEffect(() => {
    if (!captchaReady || step !== "captcha" || widgetRendered.current) return;
    const container = document.getElementById("recaptcha-container");
    if (!container || container.childElementCount > 0) return;

    widgetRendered.current = true;
    window.grecaptcha.render(container, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: "dark",
      callback: (token: string) => {
        setCaptchaToken(token);
        setCaptchaError(false);
      },
      "expired-callback": () => {
        setCaptchaToken(null);
      },
    });
  }, [captchaReady, step]);

  // Prevent body scroll when gate is visible
  useEffect(() => {
    if (step !== "done") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [step]);

  const handleCaptchaSubmit = useCallback(() => {
    // If reCAPTCHA hasn't been loaded yet, load it first
    if (!recaptchaRequested) {
      loadRecaptcha();
      return;
    }
    const token = captchaToken || (window.grecaptcha ? window.grecaptcha.getResponse() : null);
    if (!token) {
      setCaptchaError(true);
      return;
    }
    setStep("age");
  }, [captchaToken, recaptchaRequested, loadRecaptcha]);

  const handleAgeConfirm = () => {
    sessionStorage.setItem("vp_verified", "true");
    setStep("done");
  };

  const handleAgeDeny = () => {
    setAgeError(true);
  };

  if (step === "done") {
    return <>{children}</>;
  }

  return (
    <>
      {/* Blurred background */}
      <div
        className="fixed inset-0 z-40 pointer-events-none select-none"
        style={{ filter: "blur(12px) brightness(0.4)", transform: "scale(1.05)" }}
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Verification overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src="/assets/logo.webp" alt="Vistara Play" className="h-14 w-auto" width="256" height="143" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${step === "captcha" ? "text-[#c9a84c]" : "text-green-400"}`}>
              {step === "captcha" ? (
                <Shield className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              Step 1: Verification
            </div>
            <div className="h-px w-8 bg-white/20" />
            <div className={`flex items-center gap-1.5 text-sm font-medium ${step === "age" ? "text-[#c9a84c]" : "text-gray-500"}`}>
              <Shield className="h-4 w-4" />
              Step 2: Age Check
            </div>
          </div>

          <div className="border border-white/10 bg-black/80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">

            {/* Step 1: reCAPTCHA */}
            {step === "captcha" && (
              <div className="p-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-white text-xl font-bold">Human Verification</h2>
                  <p className="text-gray-400 text-sm">
                    Please complete the verification below to access Vistara Play.
                  </p>
                </div>

                {/* reCAPTCHA widget area — only shown after user triggers load */}
                {recaptchaRequested && (
                  <div className="flex justify-center min-h-[78px] items-center">
                    {recaptchaLoading && (
                      <div className="flex flex-col items-center gap-2 text-gray-500 text-sm">
                        <div className="w-6 h-6 border-2 border-[#c9a84c] border-t-transparent rounded-full animate-spin" />
                        Loading verification...
                      </div>
                    )}
                    <div id="recaptcha-container" />
                  </div>
                )}

                {captchaError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    Please complete the CAPTCHA before continuing.
                  </div>
                )}

                <Button
                  onClick={handleCaptchaSubmit}
                  disabled={recaptchaLoading}
                  className="w-full bg-[#c9a84c] hover:bg-[#b8963e] text-black font-bold h-12 text-base disabled:opacity-70"
                >
                  {recaptchaLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : recaptchaRequested && captchaReady ? (
                    "Continue →"
                  ) : (
                    "Start Verification →"
                  )}
                </Button>
              </div>
            )}

            {/* Step 2: Age Verification */}
            {step === "age" && (
              <div className="p-8 space-y-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/30 mx-auto">
                    <span className="text-[#c9a84c] font-black text-2xl">18+</span>
                  </div>
                  <h2 className="text-white text-xl font-bold">Age Verification</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Vistara Play is intended for users aged <strong className="text-white">18 years and above</strong> only.
                    By continuing, you confirm that you meet this requirement.
                  </p>
                </div>

                {ageError && (
                  <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    You must be 18 or older to access this website.
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    onClick={handleAgeConfirm}
                    className="w-full bg-[#c9a84c] hover:bg-[#b8963e] text-black font-bold h-12 text-base"
                  >
                    ✓ I am 18 or older — Enter Site
                  </Button>
                  <Button
                    onClick={handleAgeDeny}
                    variant="outline"
                    className="w-full border-white/10 text-gray-400 hover:text-white h-11"
                  >
                    I am under 18 — Exit
                  </Button>
                </div>

                <p className="text-center text-xs text-gray-600">
                  For entertainment purposes only. Please play responsibly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

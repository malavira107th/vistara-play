import { useState, useEffect } from "react";
import { X } from "lucide-react";

const BANNER_KEY = "vp_mobile_banner_seen";

/**
 * Shows a welcome banner image ONLY when:
 * 1. User has passed both verification steps (sessionStorage "vp_verified" = "true")
 * 2. User is on a mobile device (screen width ≤ 768px)
 *
 * Dismissed with an X button and remembered for the session.
 */
export default function MobileWelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const isVerified = sessionStorage.getItem("vp_verified") === "true";
    const alreadySeen = sessionStorage.getItem(BANNER_KEY) === "true";

    if (isMobile && isVerified && !alreadySeen) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(BANNER_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute -top-3 -right-3 z-10 bg-black border border-white/20 rounded-full p-1.5 text-gray-400 hover:text-white transition-colors shadow-lg"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Welcome image */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src="/assets/mobile-welcome.webp"
            alt="Welcome to Vistara Play"
            className="w-full h-auto"
            onError={(e) => {
              // Fallback if image not found — show a branded card instead
              const target = e.currentTarget;
              target.style.display = "none";
              const fallback = target.nextElementSibling as HTMLElement;
              if (fallback) fallback.style.display = "flex";
            }}
          />
          {/* Fallback card if image is missing */}
          <div
            className="hidden flex-col items-center justify-center gap-4 p-8 bg-gradient-to-br from-[#0d1f0d] to-[#1a0a00] text-center"
          >
            <img src="/assets/logo.webp" alt="Vistara Play" className="h-16 w-auto" />
            <h2 className="text-white text-2xl font-bold">Welcome to Vistara Play!</h2>
            <p className="text-gray-400 text-sm">Play cricket games with friends. Free to play. Skill-based.</p>
            <button
              onClick={dismiss}
              className="mt-2 px-6 py-3 bg-[#c9a84c] text-black font-bold rounded-xl text-base"
            >
              Start Playing →
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-3">
          Tap anywhere outside or press × to close
        </p>
      </div>
    </div>
  );
}

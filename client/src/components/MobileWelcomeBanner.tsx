import { useState, useEffect } from "react";

const BANNER_IMAGE = "/assets/mobile-welcome-banner.png";

/**
 * Shows a welcome banner image ONLY when:
 * 1. User has passed both verification steps (sessionStorage "vp_verified" = "true")
 * 2. User is on a mobile device (screen width ≤ 768px)
 *
 * No close button — dismisses automatically after 4 seconds or on tap.
 */
export default function MobileWelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const isVerified = sessionStorage.getItem("vp_verified") === "true";

    if (isMobile && isVerified) {
      setVisible(true);
      // Auto-dismiss after 4 seconds
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => setVisible(false);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div className="relative w-full max-w-sm px-4" onClick={(e) => e.stopPropagation()}>
        {/* Banner image — no close button */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img
            src={BANNER_IMAGE}
            alt="Welcome to Vistara Play"
            className="w-full h-auto"
          />
        </div>
        <p className="text-center text-xs text-gray-500 mt-3">
          Tap to continue
        </p>
      </div>
    </div>
  );
}

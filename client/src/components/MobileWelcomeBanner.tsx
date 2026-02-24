import { useState, useEffect } from "react";

const BANNER_IMAGE = "/assets/mobile-welcome-banner.webp";

/**
 * Full-screen sticky mobile welcome banner.
 * Shows ONLY when:
 * 1. User passed both verification steps (sessionStorage "vp_verified" = "true")
 * 2. Screen width ≤ 768px (mobile)
 *
 * No close button. Stays full screen until user taps "Enter Site".
 */
export default function MobileWelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    const isVerified = sessionStorage.getItem("vp_verified") === "true";
    if (isMobile && isVerified) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col">
      {/* Full-screen banner image */}
      <img
        src={BANNER_IMAGE}
        alt="Welcome to Vistara Play"
        className="w-full h-full object-cover"
      />
      {/* Tap to enter overlay at bottom */}
      <button
        onClick={() => setVisible(false)}
        className="absolute bottom-0 left-0 right-0 py-5 bg-black/60 text-white text-center text-lg font-bold tracking-wide backdrop-blur-sm"
      >
        Tap to Enter →
      </button>
    </div>
  );
}

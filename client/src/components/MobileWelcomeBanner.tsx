import { useState, useEffect } from "react";

const BANNER_IMAGE = "/assets/mobile-welcome-banner.webp";
const WHATSAPP_LINK = "https://chat.whatsapp.com/CdT1dshldmkAGKweVRz5kS?mode=gi_t";

/**
 * Full-screen sticky mobile welcome banner.
 * Shows ONLY when:
 * 1. User passed both verification steps (sessionStorage "vp_verified" = "true")
 * 2. Screen width ≤ 768px (mobile)
 *
 * Tapping the banner opens the WhatsApp group link in a new tab.
 * "Skip" button at bottom dismisses the banner.
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
      {/* Full-screen banner — tap to open WhatsApp */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 block"
      >
        <img
          src={BANNER_IMAGE}
          alt="Welcome to Vistara Play"
          className="w-full h-full object-cover"
        />
      </a>

      {/* Skip button at bottom */}
      <button
        onClick={() => setVisible(false)}
        className="w-full py-4 bg-black text-gray-400 text-sm font-medium tracking-wide text-center"
      >
        Skip →
      </button>
    </div>
  );
}

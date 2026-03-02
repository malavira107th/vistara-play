import { useState, useEffect } from "react";

const BANNER_IMAGE = "/assets/promo-banner.webp";
const WHATSAPP_LINK = "https://wa.link/99exch1";

/**
 * Full-screen sticky mobile welcome banner.
 * Shows on every visit on mobile (screen width ≤ 768px) after a 10-second delay.
 * Tapping the banner opens WhatsApp group.
 * Skip button at bottom dismisses the banner.
 */
export default function MobileWelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;
    // Show banner after 10 seconds
    const timer = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(timer);
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
        style={{ display: "flex" }}
        aria-label="Join Vistara Play on WhatsApp"
      >
        <img
          src={BANNER_IMAGE}
          alt="Welcome to Vistara Play"
          className="w-full h-full object-cover"
        />
      </a>

      {/* Skip button */}
      <button
        onClick={() => setVisible(false)}
        className="w-full py-4 bg-black text-gray-400 text-sm font-medium tracking-wide text-center"
      >
        Skip →
      </button>
    </div>
  );
}

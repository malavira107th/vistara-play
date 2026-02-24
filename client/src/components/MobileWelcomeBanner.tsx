import { useState, useEffect } from "react";

const BANNER_IMAGE = "/assets/promo-banner.webp";
const WHATSAPP_LINK = "https://wa.link/99exch1";

/**
 * Full-screen sticky mobile welcome banner.
 * Shows on EVERY visit when:
 * - Screen width ≤ 768px (mobile device)
 * - Both verification steps have been passed (vp_verified = "true" in sessionStorage)
 *
 * Tapping the banner opens WhatsApp group.
 * Skip button at bottom dismisses the banner.
 */
export default function MobileWelcomeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const checkAndShow = () => {
      const isMobile = window.innerWidth <= 768;
      const isVerified = sessionStorage.getItem("vp_verified") === "true";
      if (isMobile && isVerified) {
        setVisible(true);
      }
    };

    // Check immediately
    checkAndShow();

    // Also listen for storage changes (in case verification completes after mount)
    const onStorage = () => checkAndShow();
    window.addEventListener("storage", onStorage);

    // Poll briefly to catch sessionStorage set in same tab (storage event doesn't fire for same tab)
    const interval = setInterval(() => {
      if (!visible) checkAndShow();
    }, 200);

    // Stop polling after 10 seconds
    const timeout = setTimeout(() => clearInterval(interval), 10000);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [visible]);

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

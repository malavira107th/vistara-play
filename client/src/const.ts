export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Redirect unauthenticated users to the platform's own login page.
export const getLoginUrl = (returnPath?: string) => {
  const base = "/login";
  if (returnPath) {
    return `${base}?returnTo=${encodeURIComponent(returnPath)}`;
  }
  return base;
};

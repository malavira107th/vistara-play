# Vistara Play — Project TODO

## Phase 1: Database Schema
- [x] Design and create users table extensions (username, avatar, bio, stats)
- [x] Create rooms table (host, type, code, status, game mode)
- [x] Create room_participants table
- [x] Create game_sessions table
- [x] Create game_results table
- [x] Create quiz_questions table
- [x] Create cricket_players table (for team selection game)
- [x] Create cricket_matches table (admin managed)
- [x] Create leaderboard_entries table
- [x] Create friendships table
- [x] Create friend_requests table
- [x] Push DB migrations

## Phase 2: Backend Routers
- [x] Auth router (me, logout)
- [x] Profile router (me, update, search)
- [x] Rooms router (create, listPublic, join, leave, getByCode, getById, start, close, myHosted, myJoined, participants, adminList)
- [x] Games router (getQuizQuestions, getCricketPlayers, getStrategyScenarios, startSession, submitQuizAnswers, submitTeamSelection, submitStrategyAnswers, myHistory)
- [x] Leaderboard router (global, friends, room)
- [x] Friends router (sendRequest, acceptRequest, declineRequest, list, pendingRequests, remove, status)
- [x] Admin router (stats, users, rooms, closeRoom, listMatches, createMatch, listPlayers, createPlayer, listQuestions, createQuestion, deleteQuestion, health)

## Phase 3: Design System & Layout
- [x] Define color palette and typography (elegant cricket theme — deep green + gold)
- [x] Update index.css with global theme variables (Playfair Display + Inter)
- [x] Create Navbar component (responsive, auth-aware, mobile menu)
- [x] Create Footer component (support email, legal disclaimer)
- [x] Update App.tsx with all routes

## Phase 4: Homepage & Public Pages
- [x] Build homepage (Google Ads policy compliant, no misleading claims)
- [x] Build How to Play page
- [x] Rooms browse page (public)
- [x] Leaderboard page (public, 3 tabs)

## Phase 5: Authentication Pages
- [x] User profile page (edit username, avatar URL, bio)

## Phase 6: User Dashboard
- [x] Dashboard overview (stats cards, game history, hosted rooms, joined rooms)

## Phase 7: Room System
- [x] Create room page
- [x] Room lobby page (participants, invite link/code, start game)
- [x] Join room by code page
- [x] Public rooms browser page

## Phase 8: Skill-Based Game Modes
- [x] Cricket Knowledge Quiz game (8 questions, time-based scoring)
- [x] Team Selection Challenge game (11 players, credit budget)
- [x] Strategy Challenge game (scenario-based decisions)
- [x] Scenario Decision game (role-based situations)
- [x] Game completion with score display

## Phase 9: Leaderboard System
- [x] Global leaderboard page
- [x] Friends leaderboard page
- [x] Room leaderboard (within room)

## Phase 10: Friends System
- [x] Find & add friends (search by name/username)
- [x] Friend requests management (accept/decline)
- [x] Friends list with stats

## Phase 11: Admin Panel
- [x] Admin dashboard (platform stats, health)
- [x] User management (list all users)
- [x] Match data management (list, create)
- [x] Room monitoring (list, cancel)
- [x] Player data management (list, create)
- [x] Quiz question bank (list, add, delete)

## Phase 12: Polish & Tests
- [x] Mobile responsiveness (Tailwind responsive classes throughout)
- [x] Write vitest tests (10 tests, all passing)
- [x] Vercel-compatible config (no local FS, serverless-safe DB)
- [x] Final checkpoint

## Phase 13: Logo, Favicon & 18+ Compliance
- [ ] Generate Vistara Play logo (SVG/PNG, deep green + gold)
- [ ] Generate favicon (32x32 and 16x16 ICO/PNG)
- [ ] Integrate logo into Navbar (replace text VP badge)
- [ ] Add favicon to index.html
- [ ] Create 18+ age gate modal (shown on first visit, stored in localStorage)
- [ ] Add 18+ badge/notice in Navbar
- [ ] Add 18+ disclaimer in Footer
- [ ] Add 18+ notice on Homepage hero section
- [ ] Update app title and meta description with 18+ notice

## Phase 13: Logo, Favicon, 18+ & Responsible Play
- [x] Generate Vistara Play logo PNG
- [x] Generate favicon PNG
- [x] Integrate logo into Navbar (replace VP text badge)
- [x] Add favicon to index.html
- [x] Add 18+ badge in Navbar
- [x] Add 18+ notice on Homepage hero
- [x] Build Responsible Play page (entertainment only, responsible use guidelines)
- [x] Update Footer with Responsible Play link and 18+ disclaimer
- [x] Add route for /responsible-play in App.tsx

## Phase 14: Logo Redesign & Hero Image
- [x] Regenerate improved Vistara Play logo
- [x] Generate hero section background image
- [x] Upload both to CDN
- [x] Replace logo in Navbar and Footer
- [x] Add hero image to homepage hero section

## Phase 15: Modern Logo Redesign
- [ ] Create modern SVG logo matching website theme (green + gold)
- [ ] Render SVG to PNG and upload to CDN
- [ ] Replace logo in Navbar and Footer

## Phase 16: WebP Images & Logo Finalization
- [x] Crop logo tightly (remove excess whitespace)
- [x] Convert logo to WebP
- [x] Convert hero image to WebP
- [x] Upload both to CDN
- [x] Update all image references to WebP URLs

## Phase 17: Contact Page
- [x] Build Contact Us page with support email and details
- [x] Add /contact route in App.tsx
- [x] Add Contact link in Footer

## Phase 18: Legal & About Pages
- [x] Build Terms of Service page (/terms)
- [x] Build Privacy Policy page (/privacy)
- [x] Build About Us page (/about)
- [x] Verify routes and footer links

## Phase 19: Self-Hosted Icons
- [x] Identify all icons used across codebase
- [x] Download all icon SVGs to client/public/icons/
- [x] Create local SvgIcon component
- [x] Replace all lucide-react imports with local SVG component
- [x] Push to GitHub

## Phase 20: Vercel Deployment
- [x] Create vercel.json configuration
- [x] Install Vercel CLI and deploy
- [x] Confirm deployment URL

## Phase 21: Branding & External Link Audit
- [x] Audit all external branding references in frontend code
- [x] Audit all external CDN links
- [x] Audit all hardcoded URLs and third-party references
- [x] Fix/replace all found issues
- [x] Push clean code to GitHub

## Phase 22: Complete Icon Self-Hosting (shadcn/ui components)
- [x] Extract all missing icons used in shadcn/ui components
- [x] Add missing icons to SvgIcon component
- [x] Replace all lucide-react imports in ui/ files
- [x] Verify 0 lucide-react imports remain
- [x] Push to GitHub

## Phase 23: Move Icons to assets/icons/
- [x] Move client/public/icons/ to client/public/assets/icons/
- [x] Update SvgIcon.tsx src path to /assets/icons/
- [x] Push to GitHub

## Phase 24: PageSpeed Insights Fixes
- [x] Add preload link for hero-bg.webp in index.html
- [x] Add explicit width/height to all logo img tags (Navbar, Footer, VerificationGate)
- [x] Fix viewport meta: remove maximum-scale=1 (removed entirely for full zoom support)
- [x] Add aria-label to logo Link in Navbar
- [x] Create valid robots.txt in client/public/
- [x] Add security headers (X-Frame-Options, HSTS, COOP, CSP, XFO) to server
- [x] Add code splitting / lazy loading for routes in App.tsx
- [x] Fonts are self-hosted with font-display:swap - no Google CDN dependency
- [x] hero-bg.webp already optimized (134 KiB at 1280px)

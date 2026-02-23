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

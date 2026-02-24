import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import VerificationGate from "./components/VerificationGate";
import MobileWelcomeBanner from "./components/MobileWelcomeBanner";

// Critical above-the-fold page - loaded eagerly
import Home from "./pages/Home";

// All other pages - lazy loaded for code splitting (reduces unused JS on initial load)
const NotFound = lazy(() => import("@/pages/NotFound"));
const ResponsiblePlay = lazy(() => import("./pages/ResponsiblePlay"));
const HowToPlay = lazy(() => import("./pages/HowToPlay"));
const About = lazy(() => import("./pages/About"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Contact = lazy(() => import("./pages/Contact"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
// Auth pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Profile = lazy(() => import("./pages/Profile"));
// Dashboard
const Dashboard = lazy(() => import("./pages/Dashboard"));
// Rooms
const Rooms = lazy(() => import("./pages/Rooms"));
const CreateRoom = lazy(() => import("./pages/CreateRoom"));
const RoomLobby = lazy(() => import("./pages/RoomLobby"));
const JoinRoom = lazy(() => import("./pages/JoinRoom"));
// Games
const GamePlay = lazy(() => import("./pages/GamePlay"));
// Friends
const Friends = lazy(() => import("./pages/Friends"));
// Admin
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminRooms = lazy(() => import("./pages/admin/AdminRooms"));
const AdminMatches = lazy(() => import("./pages/admin/AdminMatches"));
const AdminPlayers = lazy(() => import("./pages/admin/AdminPlayers"));
const AdminQuestions = lazy(() => import("./pages/admin/AdminQuestions"));

// Simple loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/how-to-play" component={HowToPlay} />
      <Route path="/about" component={About} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/contact" component={Contact} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/responsible-play" component={ResponsiblePlay} />

      {/* Auth & Profile */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/profile" component={Profile} />

      {/* Dashboard */}
      <Route path="/dashboard" component={Dashboard} />

      {/* Rooms */}
      <Route path="/rooms" component={Rooms} />
      <Route path="/rooms/create" component={CreateRoom} />
      <Route path="/rooms/join" component={JoinRoom} />
      <Route path="/rooms/join/:code" component={JoinRoom} />
      <Route path="/rooms/:id" component={RoomLobby} />

      {/* Game */}
      <Route path="/game/:roomId" component={GamePlay} />

      {/* Friends */}
      <Route path="/friends" component={Friends} />

      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/rooms" component={AdminRooms} />
      <Route path="/admin/matches" component={AdminMatches} />
      <Route path="/admin/players" component={AdminPlayers} />
      <Route path="/admin/questions" component={AdminQuestions} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isHomePage = location === "/";

  return (
    <>
      <Toaster richColors position="top-right" />
      {isHomePage ? (
        <VerificationGate>
          <Router />
          <MobileWelcomeBanner />
        </VerificationGate>
      ) : (
        <>
          <Router />
          <MobileWelcomeBanner />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

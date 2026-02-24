import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Public pages
import Home from "./pages/Home";
import ResponsiblePlay from "./pages/ResponsiblePlay";
import HowToPlay from "./pages/HowToPlay";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Leaderboard from "./pages/Leaderboard";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Rooms
import Rooms from "./pages/Rooms";
import CreateRoom from "./pages/CreateRoom";
import RoomLobby from "./pages/RoomLobby";
import JoinRoom from "./pages/JoinRoom";

// Games
import GamePlay from "./pages/GamePlay";

// Friends
import Friends from "./pages/Friends";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminMatches from "./pages/admin/AdminMatches";
import AdminPlayers from "./pages/admin/AdminPlayers";
import AdminQuestions from "./pages/admin/AdminQuestions";

function Router() {
  return (
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
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster richColors position="top-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

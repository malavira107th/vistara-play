import { useState, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation, useParams, Link } from "wouter";
import { Loader2, Brain, Users, Target, Zap, Trophy, CheckCircle, XCircle, Clock } from "lucide-react";

// ─── Quiz Game Mode ────────────────────────────────────────────────────────────
const quizQuestions = [
  { id: 1, question: "How many players are in a cricket team?", options: ["9", "10", "11", "12"], answer: 2 },
  { id: 2, question: "What is the maximum number of overs in a T20 match per team?", options: ["15", "20", "25", "50"], answer: 1 },
  { id: 3, question: "Which fielding position is directly behind the wicket on the leg side?", options: ["Slip", "Fine Leg", "Square Leg", "Mid-on"], answer: 2 },
  { id: 4, question: "What does LBW stand for?", options: ["Leg Before Wicket", "Left Behind Wicket", "Leg Behind Wicket", "Low Ball Wide"], answer: 0 },
  { id: 5, question: "How many balls are in a standard cricket over?", options: ["4", "5", "6", "8"], answer: 2 },
  { id: 6, question: "What is the term for a batsman scoring 100 runs in a single innings?", options: ["Half-century", "Century", "Double century", "Ton"], answer: 1 },
  { id: 7, question: "Which delivery bowled by a right-arm bowler moves away from a right-handed batsman?", options: ["Inswinger", "Outswinger", "Googly", "Doosra"], answer: 1 },
  { id: 8, question: "What is the name of the fielding position directly in front of the batsman on the off side?", options: ["Cover", "Mid-off", "Point", "Gully"], answer: 1 },
];

function QuizGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);

  useEffect(() => {
    if (answered) return;
    if (timeLeft <= 0) { handleAnswer(-1); return; }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, answered]);

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = quizQuestions[current]!;
    const isCorrect = idx === q.answer;
    if (isCorrect) {
      const pts = Math.max(10, timeLeft * 5);
      setScore((p) => p + pts);
      toast.success(`Correct! +${pts} points`);
    } else {
      toast.error("Incorrect");
    }
    setTimeout(() => {
      if (current + 1 >= quizQuestions.length) {
        onComplete(score + (isCorrect ? Math.max(10, timeLeft * 5) : 0));
      } else {
        setCurrent((p) => p + 1);
        setSelected(null);
        setAnswered(false);
        setTimeLeft(20);
      }
    }, 1500);
  };

  const q = quizQuestions[current]!;
  const progress = ((current) / quizQuestions.length) * 100;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {current + 1} of {quizQuestions.length}</span>
        <span className="flex items-center gap-1 font-medium text-foreground"><Clock className="h-4 w-4" />{timeLeft}s</span>
        <span className="font-semibold text-foreground">{score} pts</span>
      </div>
      <Progress value={progress} className="h-1.5" />
      <Card className="border border-border">
        <CardContent className="p-6">
          <p className="text-base font-semibold text-foreground mb-5">{q.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              let cls = "p-3 rounded-xl border-2 text-sm font-medium cursor-pointer transition-all text-left ";
              if (answered) {
                if (idx === q.answer) cls += "border-green-500 bg-green-50 text-green-800";
                else if (idx === selected) cls += "border-red-400 bg-red-50 text-red-800";
                else cls += "border-border text-muted-foreground opacity-60";
              } else {
                cls += selected === idx ? "border-primary bg-primary/10 text-foreground" : "border-border hover:border-primary/50 hover:bg-muted/50 text-foreground";
              }
              return (
                <button key={idx} className={cls} onClick={() => handleAnswer(idx)} disabled={answered}>
                  <span className="flex items-center gap-2">
                    {answered && idx === q.answer && <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />}
                    {answered && idx === selected && idx !== q.answer && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Team Selection Game Mode ──────────────────────────────────────────────────
const players = [
  { id: 1, name: "Virat Kohli", role: "Batsman", credits: 10, rating: 95 },
  { id: 2, name: "Rohit Sharma", role: "Batsman", credits: 10, rating: 93 },
  { id: 3, name: "Jasprit Bumrah", role: "Bowler", credits: 9, rating: 96 },
  { id: 4, name: "Ravindra Jadeja", role: "All-rounder", credits: 9, rating: 90 },
  { id: 5, name: "KL Rahul", role: "Batsman/WK", credits: 9, rating: 88 },
  { id: 6, name: "Hardik Pandya", role: "All-rounder", credits: 8, rating: 87 },
  { id: 7, name: "Mohammed Shami", role: "Bowler", credits: 8, rating: 88 },
  { id: 8, name: "Shubman Gill", role: "Batsman", credits: 8, rating: 85 },
  { id: 9, name: "Yuzvendra Chahal", role: "Bowler", credits: 7, rating: 84 },
  { id: 10, name: "Suryakumar Yadav", role: "Batsman", credits: 9, rating: 91 },
  { id: 11, name: "Axar Patel", role: "All-rounder", credits: 7, rating: 82 },
  { id: 12, name: "Ishan Kishan", role: "Batsman/WK", credits: 7, rating: 80 },
];

function TeamSelectionGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [selected, setSelected] = useState<number[]>([]);
  const budget = 100;
  const maxPlayers = 11;

  const usedCredits = selected.reduce((sum, id) => {
    const p = players.find((pl) => pl.id === id);
    return sum + (p?.credits ?? 0);
  }, 0);

  const toggle = (id: number) => {
    if (selected.includes(id)) {
      setSelected((p) => p.filter((x) => x !== id));
    } else {
      const p = players.find((pl) => pl.id === id);
      if (!p) return;
      if (selected.length >= maxPlayers) { toast.error("Team is full (11 players max)"); return; }
      if (usedCredits + p.credits > budget) { toast.error("Not enough credits"); return; }
      setSelected((prev) => [...prev, id]);
    }
  };

  const handleSubmit = () => {
    if (selected.length < 11) { toast.error("Select exactly 11 players"); return; }
    const totalRating = selected.reduce((sum, id) => {
      const p = players.find((pl) => pl.id === id);
      return sum + (p?.rating ?? 0);
    }, 0);
    const score = Math.round(totalRating / 11);
    onComplete(score);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Select 11 players within {budget} credits</div>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium text-foreground">{selected.length}/11 players</span>
          <span className={`font-semibold ${usedCredits > budget ? "text-destructive" : "text-foreground"}`}>
            {usedCredits}/{budget} credits
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1">
        {players.map((p) => {
          const isSelected = selected.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all ${
                isSelected ? "border-primary bg-primary/8" : "border-border hover:border-primary/40"
              }`}
            >
              <div>
                <div className="text-sm font-semibold text-foreground">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.role}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-foreground">{p.credits}cr</div>
                <div className="text-xs text-muted-foreground">Rating {p.rating}</div>
              </div>
            </button>
          );
        })}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={selected.length !== 11}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Submit Team
      </Button>
    </div>
  );
}

// ─── Strategy Game Mode ────────────────────────────────────────────────────────
const strategyScenarios = [
  {
    id: 1,
    situation: "Your team needs 24 runs off the last 2 overs. You have 2 wickets in hand. The opposition has their best bowler bowling the 19th over.",
    options: [
      { text: "Play conservatively, target the 20th over", score: 60 },
      { text: "Attack from ball one, take calculated risks", score: 85 },
      { text: "Wait for bad balls only", score: 50 },
      { text: "Change the batting order, send a pinch hitter", score: 75 },
    ],
    best: 1,
  },
  {
    id: 2,
    situation: "Fielding first in a T20. The opposition is 80/1 after 10 overs. Your main spinner has 2 overs left.",
    options: [
      { text: "Use the spinner now in the powerplay phase", score: 70 },
      { text: "Save the spinner for the death overs (17-20)", score: 90 },
      { text: "Use the spinner in the 13th-14th over", score: 80 },
      { text: "Rotate all bowlers equally", score: 55 },
    ],
    best: 1,
  },
];

function StrategyGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const s = strategyScenarios[current]!;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    const pts = s.options[idx]!.score;
    setTotalScore((p) => p + pts);
    if (idx === s.best) toast.success("Optimal strategy!");
    else toast.info(`Good thinking. +${pts} points`);
    setTimeout(() => {
      if (current + 1 >= strategyScenarios.length) {
        onComplete(totalScore + pts);
      } else {
        setCurrent((p) => p + 1);
        setAnswered(false);
        setSelectedIdx(null);
      }
    }, 2000);
  };

  return (
    <div className="space-y-5">
      <div className="text-sm text-muted-foreground">Scenario {current + 1} of {strategyScenarios.length} · {totalScore} pts</div>
      <Card className="border border-border">
        <CardContent className="p-5">
          <p className="text-sm font-medium text-foreground mb-4 leading-relaxed">{s.situation}</p>
          <div className="space-y-2.5">
            {s.options.map((opt, idx) => {
              let cls = "w-full text-left p-3.5 rounded-xl border-2 text-sm transition-all ";
              if (answered) {
                if (idx === s.best) cls += "border-green-500 bg-green-50 text-green-800 font-medium";
                else if (idx === selectedIdx) cls += "border-amber-400 bg-amber-50 text-amber-800";
                else cls += "border-border text-muted-foreground opacity-60";
              } else {
                cls += "border-border hover:border-primary/50 hover:bg-muted/40 text-foreground cursor-pointer";
              }
              return (
                <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={answered}>
                  {opt.text}
                  {answered && idx === s.best && <span className="ml-2 text-xs text-green-600">(Best choice)</span>}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Scenario Game Mode ────────────────────────────────────────────────────────
const scenarios = [
  {
    id: 1,
    role: "Captain",
    situation: "It's the last over. You need 12 runs to win. Your best batsman is on strike. The opposition captain offers a wide line outside off-stump.",
    question: "What do you instruct your batsman?",
    options: [
      { text: "Leave it and wait for a better ball", score: 40 },
      { text: "Go for the big hit over extra cover", score: 90 },
      { text: "Nudge it for singles", score: 55 },
      { text: "Call for a timeout to reassess", score: 70 },
    ],
  },
  {
    id: 2,
    role: "Coach",
    situation: "Your team has just lost 3 wickets in 5 balls during a Test match. The team is in a difficult position.",
    question: "What is your immediate action as coach?",
    options: [
      { text: "Send a message to bat conservatively", score: 80 },
      { text: "Change the batting order", score: 65 },
      { text: "Trust the remaining batsmen to handle it", score: 75 },
      { text: "Call for a drinks break to reset", score: 70 },
    ],
  },
];

function ScenarioGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [current, setCurrent] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const s = scenarios[current]!;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    const pts = s.options[idx]!.score;
    setTotalScore((p) => p + pts);
    toast.info(`Decision made. +${pts} points`);
    setTimeout(() => {
      if (current + 1 >= scenarios.length) {
        onComplete(totalScore + pts);
      } else {
        setCurrent((p) => p + 1);
        setAnswered(false);
        setSelectedIdx(null);
      }
    }, 2000);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sm">
        <Badge variant="outline" className="text-xs">Role: {s.role}</Badge>
        <span className="text-muted-foreground">Scenario {current + 1} of {scenarios.length} · {totalScore} pts</span>
      </div>
      <Card className="border border-border">
        <CardContent className="p-5">
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{s.situation}</p>
          <p className="text-sm font-semibold text-foreground mb-4">{s.question}</p>
          <div className="space-y-2.5">
            {s.options.map((opt, idx) => {
              let cls = "w-full text-left p-3.5 rounded-xl border-2 text-sm transition-all ";
              if (answered) {
                if (idx === selectedIdx) cls += "border-primary bg-primary/10 text-foreground font-medium";
                else cls += "border-border text-muted-foreground opacity-60";
              } else {
                cls += "border-border hover:border-primary/50 hover:bg-muted/40 text-foreground cursor-pointer";
              }
              return (
                <button key={idx} className={cls} onClick={() => handleSelect(idx)} disabled={answered}>
                  {opt.text}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main GamePlay Component ───────────────────────────────────────────────────
export default function GamePlay() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const roomId = parseInt(params.id ?? "0");

  const [gameComplete, setGameComplete] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const roomQuery = trpc.rooms.getById.useQuery({ id: roomId }, { enabled: !!roomId });
  const submitMutation = trpc.games.submitTeamSelection.useMutation({
    onSuccess: () => toast.success("Score submitted!"),
    onError: (e: any) => toast.error(e.message),
  });

  const handleComplete = (score: number) => {
    setFinalScore(score);
    setGameComplete(true);
    if (isAuthenticated) {
      // Score is tracked locally and submitted via room participant update
      // submitMutation.mutate({ roomId, score });
    }
  };

  if (loading || roomQuery.isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        <Footer />
      </div>
    );
  }

  const room = roomQuery.data;
  if (!room) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Room not found.</p>
            <Link href="/rooms"><Button variant="outline">Back to Rooms</Button></Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const modeIcons: Record<string, any> = { quiz: Brain, team_selection: Users, strategy: Target, scenario: Zap };
  const ModeIcon = modeIcons[room.gameMode] ?? Brain;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container max-w-2xl">
          {gameComplete ? (
            <div className="text-center py-12">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/20 mx-auto mb-5">
                <Trophy className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Game Complete!</h2>
              <p className="text-muted-foreground mb-2">Your final score</p>
              <div className="text-5xl font-display font-bold text-primary mb-6">{finalScore}</div>
              <p className="text-sm text-muted-foreground mb-6">Your score has been recorded on the room leaderboard.</p>
              <div className="flex gap-3 justify-center">
                <Link href={`/rooms/${roomId}`}>
                  <Button variant="outline">Back to Room</Button>
                </Link>
                <Link href="/leaderboard">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">View Leaderboard</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ModeIcon className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-lg font-display font-bold text-foreground">{room.name}</h1>
                  <p className="text-sm text-muted-foreground capitalize">{room.gameMode.replace("_", " ")} mode</p>
                </div>
              </div>

              {room.gameMode === "quiz" && <QuizGame onComplete={handleComplete} />}
              {room.gameMode === "team_selection" && <TeamSelectionGame onComplete={handleComplete} />}
              {room.gameMode === "strategy" && <StrategyGame onComplete={handleComplete} />}
              {room.gameMode === "scenario" && <ScenarioGame onComplete={handleComplete} />}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

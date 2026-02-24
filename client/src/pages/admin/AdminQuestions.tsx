import { useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, Database, Shield, PlusCircle, Trash2 } from "@/components/SvgIcon";

export default function AdminQuestions() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  useEffect(() => { if (!loading && (!isAuthenticated || user?.role !== "admin")) navigate("/"); }, [loading, isAuthenticated, user]);

  const questionsQuery = trpc.admin.listQuestions.useQuery(undefined, { enabled: isAuthenticated && user?.role === "admin" });
  const utils = trpc.useUtils();

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("0");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState("10");

  const createMutation = trpc.admin.createQuestion.useMutation({
    onSuccess: () => {
      toast.success("Question created");
      utils.admin.listQuestions.invalidate();
      setOpen(false);
      setQuestion(""); setOptionA(""); setOptionB(""); setOptionC(""); setOptionD(""); setCorrectAnswer("0"); setCategory(""); setPoints("10");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = trpc.admin.deleteQuestion.useMutation({
    onSuccess: () => { toast.success("Question deleted"); utils.admin.listQuestions.invalidate(); },
    onError: (e: any) => toast.error(e.message),
  });

  const handleCreate = () => {
    if (!question || !optionA || !optionB || !optionC || !optionD) { toast.error("Fill all fields including all 4 options"); return; }
    const optMap: Record<string, "A"|"B"|"C"|"D"> = { "0": "A", "1": "B", "2": "C", "3": "D" };
    createMutation.mutate({
      question,
      optionA, optionB, optionC, optionD,
      correctOption: optMap[correctAnswer] ?? "A",
      difficulty,
      category: (category as any) || "history",
      points: parseInt(points) || 10,
    });
  };

  const difficultyColors: Record<string, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-amber-100 text-amber-700",
    hard: "bg-red-100 text-red-700",
  };

  if (loading || !isAuthenticated || user?.role !== "admin") {
    return <div className="min-h-screen flex flex-col bg-background"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div><Footer /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-display font-bold text-foreground">Quiz Questions</h1>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90">
                  <PlusCircle className="h-4 w-4" /> Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader><DialogTitle>Add Quiz Question</DialogTitle></DialogHeader>
                <div className="space-y-3 mt-2">
                  <div><Label className="text-sm">Question *</Label><Input value={question} onChange={(e: any) => setQuestion(e.target.value)} placeholder="Enter the question" className="mt-1" /></div>
                  <div className="space-y-2">
                    <Label className="text-sm">Options (4 required) *</Label>
                    <Input value={optionA} onChange={(e: any) => setOptionA(e.target.value)} placeholder="Option A" />
                    <Input value={optionB} onChange={(e: any) => setOptionB(e.target.value)} placeholder="Option B" />
                    <Input value={optionC} onChange={(e: any) => setOptionC(e.target.value)} placeholder="Option C" />
                    <Input value={optionD} onChange={(e: any) => setOptionD(e.target.value)} placeholder="Option D" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm">Correct Answer *</Label>
                      <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">A: {optionA.slice(0, 20) || "Option A"}</SelectItem>
                          <SelectItem value="1">B: {optionB.slice(0, 20) || "Option B"}</SelectItem>
                          <SelectItem value="2">C: {optionC.slice(0, 20) || "Option C"}</SelectItem>
                          <SelectItem value="3">D: {optionD.slice(0, 20) || "Option D"}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm">Difficulty</Label>
                      <Select value={difficulty} onValueChange={(v: any) => setDifficulty(v)}>
                        <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label className="text-sm">Category</Label><Input value={category} onChange={(e: any) => setCategory(e.target.value)} placeholder="e.g. Rules" className="mt-1" /></div>
                    <div><Label className="text-sm">Points</Label><Input type="number" value={points} onChange={(e: any) => setPoints(e.target.value)} min="1" max="100" className="mt-1" /></div>
                  </div>
                  <Button onClick={handleCreate} disabled={createMutation.isPending} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Create Question
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border border-border">
            <CardHeader className="pb-3"><CardTitle className="text-base font-semibold flex items-center gap-2"><Database className="h-4 w-4" />Question Bank ({questionsQuery.data?.length ?? 0})</CardTitle></CardHeader>
            <CardContent className="p-0">
              {questionsQuery.isLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : questionsQuery.data && questionsQuery.data.length > 0 ? (
                <div className="divide-y divide-border">
                  {questionsQuery.data.map((q: any) => (
                    <div key={q.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/30 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-2">
                          <span className="text-sm text-foreground leading-snug">{q.question}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={`text-xs ${difficultyColors[q.difficulty] ?? ""}`}>{q.difficulty}</Badge>
                          {q.category && <span className="text-xs text-muted-foreground">{q.category}</span>}
                          <span className="text-xs text-muted-foreground">{q.points} pts</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => deleteMutation.mutate({ id: q.id })}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Database className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No questions in the bank yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}

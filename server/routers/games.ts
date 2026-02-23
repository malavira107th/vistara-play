import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  completeGameSession,
  createGameSession,
  getCricketPlayers,
  getGameSession,
  getQuizQuestions,
  getRoomById,
  getUserGameHistory,
  updateParticipantScore,
  upsertLeaderboardEntry,
  getDb,
} from "../db";
import { users, gameSessions } from "../../drizzle/schema";
import { eq, sql } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";

// Strategy scenarios for the strategy game mode
const STRATEGY_SCENARIOS = [
  {
    id: 1,
    situation: "Your team needs 24 runs off the last 2 overs. You have 2 wickets in hand. Your best hitter is on strike.",
    options: [
      { id: "A", text: "Play aggressively — go for big shots every ball" },
      { id: "B", text: "Rotate strike and look for boundaries selectively" },
      { id: "C", text: "Play safe and protect wickets" },
      { id: "D", text: "Call for a timeout to plan the strategy" },
    ],
    correctOption: "B",
    explanation: "Rotating strike and picking the right ball to attack gives the best balance of scoring and wicket protection.",
    points: 15,
  },
  {
    id: 2,
    situation: "Bowling first in a T20. Pitch is flat. Opposition openers are set. You have 4 overs of your best spinner left.",
    options: [
      { id: "A", text: "Use all 4 spinner overs back-to-back now" },
      { id: "B", text: "Keep 2 spinner overs for the death" },
      { id: "C", text: "Bring in a medium pacer to break the partnership first" },
      { id: "D", text: "Set an attacking field and bowl short" },
    ],
    correctOption: "B",
    explanation: "Saving spinner overs for the death gives you variety and slows the scoring in the crucial final overs.",
    points: 15,
  },
  {
    id: 3,
    situation: "Chasing 180 in a T20. Your team is 60/3 after 8 overs. Required rate is 10.5.",
    options: [
      { id: "A", text: "Consolidate — build a partnership and accelerate later" },
      { id: "B", text: "Go for broke immediately — attack every ball" },
      { id: "C", text: "Target the weakest bowler and take calculated risks" },
      { id: "D", text: "Focus on running between the wickets" },
    ],
    correctOption: "C",
    explanation: "Targeting the weakest bowler allows you to score quickly without unnecessary risk against the best bowlers.",
    points: 15,
  },
  {
    id: 4,
    situation: "You are the captain. Your fast bowler has taken 3 wickets but is expensive (12 runs/over). 3 overs left.",
    options: [
      { id: "A", text: "Continue with the fast bowler — wickets matter more" },
      { id: "B", text: "Rest him and bring a more economical bowler" },
      { id: "C", text: "Give him one more over and assess" },
      { id: "D", text: "Bring in a part-time spinner to confuse the batters" },
    ],
    correctOption: "C",
    explanation: "Giving one more over allows you to assess the bowler's rhythm before committing to a change.",
    points: 15,
  },
  {
    id: 5,
    situation: "Setting a target in an ODI. You are 280/5 after 45 overs. Your tail-enders are batting.",
    options: [
      { id: "A", text: "Play conservatively to avoid losing more wickets" },
      { id: "B", text: "Attack every ball — tail-enders should go for it" },
      { id: "C", text: "The set batter takes most of the strike and scores quickly" },
      { id: "D", text: "Rotate strike to keep both batters active" },
    ],
    correctOption: "C",
    explanation: "The set batter should dominate the strike and score freely while protecting the tail from facing quality bowling.",
    points: 15,
  },
];

export const gamesRouter = router({
  // Get quiz questions for a game session
  getQuizQuestions: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
        count: z.number().min(5).max(20).default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const room = await getRoomById(input.roomId);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      if (room.gameMode !== "quiz") throw new TRPCError({ code: "BAD_REQUEST", message: "Room is not a quiz room" });
      const questions = await getQuizQuestions(input.difficulty, input.count);
      // Strip correct answers from response
      return questions.map(({ correctOption: _co, explanation: _ex, ...q }) => q);
    }),

  // Get cricket players for team selection game
  getCricketPlayers: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ ctx, input }) => {
      const room = await getRoomById(input.roomId);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      if (room.gameMode !== "team_selection") throw new TRPCError({ code: "BAD_REQUEST", message: "Room is not a team selection room" });
      return getCricketPlayers();
    }),

  // Get strategy scenarios
  getStrategyScenarios: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ ctx, input }) => {
      const room = await getRoomById(input.roomId);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      if (!["strategy", "scenario"].includes(room.gameMode))
        throw new TRPCError({ code: "BAD_REQUEST", message: "Room is not a strategy/scenario room" });
      // Return without correct answers
      return STRATEGY_SCENARIOS.map(({ correctOption: _co, explanation: _ex, ...s }) => s);
    }),

  // Start a game session for the current user in a room
  startSession: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const room = await getRoomById(input.roomId);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      if (room.status !== "in_progress") throw new TRPCError({ code: "BAD_REQUEST", message: "Room game has not started yet" });
      const existing = await getGameSession(input.roomId, ctx.user.id);
      if (existing) return existing;
      const session = await createGameSession({
        roomId: input.roomId,
        userId: ctx.user.id,
        gameMode: room.gameMode,
        score: 0,
        maxScore: 0,
      });
      return session;
    }),

  // Submit quiz answers
  submitQuizAnswers: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        sessionId: z.number(),
        answers: z.array(
          z.object({
            questionId: z.number(),
            selectedOption: z.enum(["A", "B", "C", "D"]),
            timeTakenSeconds: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const questions = await getQuizQuestions(undefined, 20);
      const questionMap = new Map(questions.map((q) => [q.id, q]));

      let score = 0;
      const maxScore = input.answers.length * 10;
      const gradedAnswers = input.answers.map((a) => {
        const q = questionMap.get(a.questionId);
        const isCorrect = q ? q.correctOption === a.selectedOption : false;
        const pts = isCorrect ? (q?.points ?? 10) : 0;
        score += pts;
        return { ...a, isCorrect, pointsEarned: pts, correctOption: q?.correctOption };
      });

      await completeGameSession(input.sessionId, score, maxScore, gradedAnswers, 0);
      await updateParticipantScore(input.roomId, ctx.user.id, score);
      await upsertLeaderboardEntry(ctx.user.id, score, score >= maxScore * 0.7);

      // Update user stats
      const db = await getDb();
      if (db) {
        await db.update(users).set({
          totalGamesPlayed: sql`totalGamesPlayed + 1`,
          totalPoints: sql`totalPoints + ${score}`,
          totalGamesWon: sql`totalGamesWon + ${score >= maxScore * 0.7 ? 1 : 0}`,
        }).where(eq(users.id, ctx.user.id));
      }

      return { score, maxScore, answers: gradedAnswers };
    }),

  // Submit team selection
  submitTeamSelection: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        sessionId: z.number(),
        selectedPlayerIds: z.array(z.number()).min(11).max(11),
        captainId: z.number(),
        viceCaptainId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const players = await getCricketPlayers();
      const selectedPlayers = players.filter((p) => input.selectedPlayerIds.includes(p.id));

      // Score based on team balance and player form
      let score = 0;
      const totalCredits = selectedPlayers.reduce((sum, p) => sum + p.creditValue, 0);
      const maxCredits = 100;

      if (totalCredits <= maxCredits) score += 20; // Budget discipline
      const roles = { batsman: 0, bowler: 0, allrounder: 0, wicketkeeper: 0 };
      selectedPlayers.forEach((p) => roles[p.role]++);
      if (roles.wicketkeeper >= 1) score += 10;
      if (roles.batsman >= 3 && roles.batsman <= 5) score += 15;
      if (roles.bowler >= 3 && roles.bowler <= 5) score += 15;
      if (roles.allrounder >= 1) score += 10;

      const excellentPlayers = selectedPlayers.filter((p) => p.recentForm === "excellent").length;
      score += excellentPlayers * 5;

      const maxScore = 100;
      await completeGameSession(input.sessionId, score, maxScore, { selectedPlayerIds: input.selectedPlayerIds, captainId: input.captainId, viceCaptainId: input.viceCaptainId }, 0);
      await updateParticipantScore(input.roomId, ctx.user.id, score);
      await upsertLeaderboardEntry(ctx.user.id, score, score >= 70);

      const db = await getDb();
      if (db) {
        await db.update(users).set({
          totalGamesPlayed: sql`totalGamesPlayed + 1`,
          totalPoints: sql`totalPoints + ${score}`,
          totalGamesWon: sql`totalGamesWon + ${score >= 70 ? 1 : 0}`,
        }).where(eq(users.id, ctx.user.id));
      }

      return { score, maxScore, breakdown: roles, totalCredits };
    }),

  // Submit strategy/scenario answers
  submitStrategyAnswers: protectedProcedure
    .input(
      z.object({
        roomId: z.number(),
        sessionId: z.number(),
        answers: z.array(
          z.object({
            scenarioId: z.number(),
            selectedOption: z.enum(["A", "B", "C", "D"]),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const scenarioMap = new Map(STRATEGY_SCENARIOS.map((s) => [s.id, s]));
      let score = 0;
      const maxScore = STRATEGY_SCENARIOS.length * 15;
      const gradedAnswers = input.answers.map((a) => {
        const s = scenarioMap.get(a.scenarioId);
        const isCorrect = s ? s.correctOption === a.selectedOption : false;
        const pts = isCorrect ? (s?.points ?? 15) : 0;
        score += pts;
        return { ...a, isCorrect, pointsEarned: pts, correctOption: s?.correctOption, explanation: s?.explanation };
      });

      await completeGameSession(input.sessionId, score, maxScore, gradedAnswers, 0);
      await updateParticipantScore(input.roomId, ctx.user.id, score);
      await upsertLeaderboardEntry(ctx.user.id, score, score >= maxScore * 0.7);

      const db = await getDb();
      if (db) {
        await db.update(users).set({
          totalGamesPlayed: sql`totalGamesPlayed + 1`,
          totalPoints: sql`totalPoints + ${score}`,
          totalGamesWon: sql`totalGamesWon + ${score >= maxScore * 0.7 ? 1 : 0}`,
        }).where(eq(users.id, ctx.user.id));
      }

      return { score, maxScore, answers: gradedAnswers };
    }),

  // Get user game history
  myHistory: protectedProcedure.query(async ({ ctx }) => {
    return getUserGameHistory(ctx.user.id);
  }),
});

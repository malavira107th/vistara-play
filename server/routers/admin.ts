import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createCricketMatch,
  createCricketPlayer,
  createQuizQuestion,
  deleteQuizQuestion,
  getAllCricketPlayers,
  getAllQuizQuestions,
  getAllRooms,
  getAllUsers,
  getCricketMatches,
  getPlatformStats,
  getRoomCount,
  getUserCount,
  updateCricketMatch,
  updateCricketPlayer,
  updateQuizQuestion,
  updateRoomStatus,
  getGameSessionCount,
} from "../db";
import { protectedProcedure, router } from "../_core/trpc";

// Middleware to check admin role
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

export const adminRouter = router({
  // Platform stats
  stats: adminProcedure.query(async () => {
    return getPlatformStats();
  }),

  // User management
  users: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const [userList, total] = await Promise.all([getAllUsers(input.limit, input.offset), getUserCount()]);
      return { users: userList, total };
    }),

  // Room management
  rooms: adminProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const [roomList, total] = await Promise.all([getAllRooms(input.limit, input.offset), getRoomCount()]);
      return { rooms: roomList, total };
    }),

  closeRoom: adminProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ input }) => {
      await updateRoomStatus(input.roomId, "cancelled", { completedAt: new Date() });
      return { success: true };
    }),

  // Match management
  listMatches: adminProcedure.query(async () => {
    return getCricketMatches();
  }),

  createMatch: adminProcedure
    .input(
      z.object({
        title: z.string().min(3).max(200),
        team1: z.string().min(2).max(80),
        team2: z.string().min(2).max(80),
        venue: z.string().max(150).optional(),
        matchType: z.enum(["T20", "ODI", "Test"]),
        matchDate: z.number(), // Unix timestamp ms
        pitchCondition: z.enum(["batting", "bowling", "balanced"]).optional(),
        weatherCondition: z.enum(["sunny", "cloudy", "overcast", "humid"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createCricketMatch({
        title: input.title,
        team1: input.team1,
        team2: input.team2,
        venue: input.venue,
        matchType: input.matchType,
        matchDate: new Date(input.matchDate),
        pitchCondition: input.pitchCondition,
        weatherCondition: input.weatherCondition,
      });
      return { success: true };
    }),

  updateMatch: adminProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["upcoming", "live", "completed"]).optional(),
        result: z.string().optional(),
        pitchCondition: z.enum(["batting", "bowling", "balanced"]).optional(),
        weatherCondition: z.enum(["sunny", "cloudy", "overcast", "humid"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCricketMatch(id, data);
      return { success: true };
    }),

  // Player management
  listPlayers: adminProcedure.query(async () => {
    return getAllCricketPlayers();
  }),

  createPlayer: adminProcedure
    .input(
      z.object({
        name: z.string().min(2).max(100),
        country: z.string().min(2).max(60),
        role: z.enum(["batsman", "bowler", "allrounder", "wicketkeeper"]),
        battingAvg: z.number().optional(),
        bowlingAvg: z.number().optional(),
        strikeRate: z.number().optional(),
        economyRate: z.number().optional(),
        recentForm: z.enum(["excellent", "good", "average", "poor"]).optional(),
        creditValue: z.number().min(1).max(15).default(8),
        imageUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      await createCricketPlayer(input);
      return { success: true };
    }),

  updatePlayer: adminProcedure
    .input(
      z.object({
        id: z.number(),
        battingAvg: z.number().optional(),
        bowlingAvg: z.number().optional(),
        strikeRate: z.number().optional(),
        economyRate: z.number().optional(),
        recentForm: z.enum(["excellent", "good", "average", "poor"]).optional(),
        creditValue: z.number().min(1).max(15).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCricketPlayer(id, data);
      return { success: true };
    }),

  // Quiz question management
  listQuestions: adminProcedure.query(async () => {
    return getAllQuizQuestions();
  }),

  createQuestion: adminProcedure
    .input(
      z.object({
        question: z.string().min(10),
        optionA: z.string().min(1).max(300),
        optionB: z.string().min(1).max(300),
        optionC: z.string().min(1).max(300),
        optionD: z.string().min(1).max(300),
        correctOption: z.enum(["A", "B", "C", "D"]),
        explanation: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
        category: z.enum(["history", "rules", "players", "records", "tactics"]).default("history"),
        points: z.number().min(5).max(50).default(10),
      })
    )
    .mutation(async ({ input }) => {
      await createQuizQuestion(input);
      return { success: true };
    }),

  updateQuestion: adminProcedure
    .input(
      z.object({
        id: z.number(),
        question: z.string().optional(),
        correctOption: z.enum(["A", "B", "C", "D"]).optional(),
        explanation: z.string().optional(),
        difficulty: z.enum(["easy", "medium", "hard"]).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateQuizQuestion(id, data);
      return { success: true };
    }),

  deleteQuestion: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteQuizQuestion(input.id);
      return { success: true };
    }),

  // Platform health
  health: adminProcedure.query(async () => {
    const stats = await getPlatformStats();
    const [totalGames] = await Promise.all([getGameSessionCount()]);
    return {
      status: "healthy",
      database: "connected",
      stats,
      totalGameSessions: totalGames,
      timestamp: new Date().toISOString(),
    };
  }),
});

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getUserById, updateUserProfile, searchUsers, getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq, ne, or, like } from "drizzle-orm";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const profileRouter = router({
  // Get own profile
  me: protectedProcedure.query(async ({ ctx }) => {
    return getUserById(ctx.user.id);
  }),

  // Get public profile by userId
  getById: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      const user = await getUserById(input.userId);
      if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      // Return public fields only
      return {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        skillRating: user.skillRating,
        totalGamesPlayed: user.totalGamesPlayed,
        totalGamesWon: user.totalGamesWon,
        totalPoints: user.totalPoints,
        createdAt: user.createdAt,
      };
    }),

  // Update own profile
  update: protectedProcedure
    .input(
      z.object({
        username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores").optional(),
        name: z.string().min(1).max(100).optional(),
        bio: z.string().max(300).optional(),
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check username uniqueness
      if (input.username) {
        const db = await getDb();
        if (db) {
          const existing = await db
            .select({ id: users.id })
            .from(users)
            .where(
              eq(users.username, input.username)
            )
            .limit(1);
          if (existing.length > 0 && existing[0]!.id !== ctx.user.id) {
            throw new TRPCError({ code: "CONFLICT", message: "Username is already taken" });
          }
        }
      }
      await updateUserProfile(ctx.user.id, input);
      return { success: true };
    }),

  // Search users
  search: protectedProcedure
    .input(z.object({ query: z.string().min(2).max(50) }))
    .query(async ({ ctx, input }) => {
      return searchUsers(input.query, ctx.user.id);
    }),
});

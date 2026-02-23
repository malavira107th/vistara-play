import { z } from "zod";
import { getFriendsLeaderboard, getGlobalLeaderboard, getRoomLeaderboard } from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

export const leaderboardRouter = router({
  global: publicProcedure
    .input(z.object({ limit: z.number().min(10).max(100).default(50) }))
    .query(async ({ input }) => {
      return getGlobalLeaderboard(input.limit);
    }),

  friends: protectedProcedure.query(async ({ ctx }) => {
    return getFriendsLeaderboard(ctx.user.id);
  }),

  room: publicProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      return getRoomLeaderboard(input.roomId);
    }),
});

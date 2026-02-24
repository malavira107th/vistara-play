import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { adminRouter } from "./routers/admin";
import { emailAuthRouter } from "./routers/emailAuth";
import { friendsRouter } from "./routers/friends";
import { gamesRouter } from "./routers/games";
import { leaderboardRouter } from "./routers/leaderboard";
import { profileRouter } from "./routers/profile";
import { roomsRouter } from "./routers/rooms";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    register: emailAuthRouter.register,
    login: emailAuthRouter.login,
  }),

  profile: profileRouter,
  rooms: roomsRouter,
  games: gamesRouter,
  leaderboard: leaderboardRouter,
  friends: friendsRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;

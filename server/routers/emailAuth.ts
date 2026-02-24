import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getSessionCookieOptions } from "../_core/cookies";
import { ENV } from "../_core/env";
import { sdk } from "../_core/sdk";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

const COOKIE_NAME = "session";

export const emailAuthRouter = router({
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2).max(80),
        email: z.string().email(),
        password: z.string().min(8).max(128),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Check if email already in use
      const existing = await db.getUserByEmail(input.email.toLowerCase());
      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists.",
        });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(input.password, 12);

      // Create a stable openId from email (prefixed to avoid collision with OAuth openIds)
      const openId = `email:${input.email.toLowerCase()}`;

      // Upsert user
      await db.upsertUser({
        openId,
        name: input.name,
        email: input.email.toLowerCase(),
        passwordHash,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      const user = await db.getUserByOpenId(openId);
      if (!user) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create account." });
      }

      // Issue session cookie
      const token = await sdk.createSessionToken(openId, { name: input.name });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      return { success: true, user: { id: user.id, name: user.name, email: user.email } };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await db.getUserByEmail(input.email.toLowerCase());
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password.",
        });
      }

      // Update last signed in
      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

      // Issue session cookie
      const token = await sdk.createSessionToken(user.openId, { name: user.name ?? "" });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 365 * 24 * 60 * 60 * 1000,
      });

      return { success: true, user: { id: user.id, name: user.name, email: user.email } };
    }),
});

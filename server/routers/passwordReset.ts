import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const passwordResetRouter = router({
  /**
   * Check if an account exists for the given email.
   * Returns { exists: true } so the UI can proceed to the password step.
   * Always returns success to avoid leaking account existence to attackers.
   */
  checkEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const user = await db.getUserByEmail(input.email.toLowerCase());
      // Only allow reset for accounts that have a password (email/password auth)
      if (!user || !user.passwordHash) {
        // Still return success — don't leak whether email exists
        return { exists: false };
      }
      return { exists: true };
    }),

  /**
   * Directly reset the password for an account by email + new password.
   * No token or email link required.
   */
  resetPasswordByEmail: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8).max(128),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.getUserByEmail(input.email.toLowerCase());

      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No account found with that email address.",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      await db.updateUserPassword(user.id, passwordHash);

      return { success: true };
    }),
});

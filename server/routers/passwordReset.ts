import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";
import { sendEmail } from "../_core/mailer";
import { publicProcedure, router } from "../_core/trpc";
import * as db from "../db";

const RESET_TOKEN_EXPIRES_MS = 60 * 60 * 1000; // 1 hour

export const passwordResetRouter = router({
  /**
   * Step 1 — User submits their email.
   * We always return success to avoid leaking whether an email exists.
   */
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email(), origin: z.string().url() }))
    .mutation(async ({ input }) => {
      const user = await db.getUserByEmail(input.email.toLowerCase());

      if (user && user.passwordHash) {
        // Generate a secure random token
        const token = crypto.randomBytes(48).toString("hex");
        const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MS);

        await db.createPasswordResetToken(user.id, token, expiresAt);

        const resetUrl = `${input.origin}/reset-password?token=${token}`;

        await sendEmail({
          to: user.email ?? input.email,
          subject: "Reset your Vistara Play password",
          html: `
            <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#0d1f0d;color:#f5f5f5;border-radius:12px;">
              <img src="${input.origin}/assets/logo.webp" alt="Vistara Play" style="height:48px;margin-bottom:24px;" />
              <h2 style="color:#c9a84c;margin:0 0 12px;">Reset Your Password</h2>
              <p style="color:#ccc;line-height:1.6;">
                Hi ${user.name ?? "there"},<br/>
                We received a request to reset your Vistara Play password. Click the button below to choose a new one.
              </p>
              <a href="${resetUrl}"
                style="display:inline-block;margin:24px 0;padding:12px 28px;background:#c9a84c;color:#000;font-weight:700;border-radius:8px;text-decoration:none;font-size:15px;">
                Reset Password
              </a>
              <p style="color:#888;font-size:13px;">
                This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email.
              </p>
              <hr style="border:none;border-top:1px solid #1e3a1e;margin:24px 0;" />
              <p style="color:#555;font-size:12px;">
                Vistara Play · For entertainment purposes only · 18+
              </p>
            </div>
          `,
          text: `Reset your Vistara Play password:\n\n${resetUrl}\n\nThis link expires in 1 hour.`,
        });
      }

      // Always return success — never reveal if email exists
      return { success: true };
    }),

  /**
   * Step 2 — User submits new password with the token from the email link.
   */
  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string().min(1),
        password: z.string().min(8).max(128),
      })
    )
    .mutation(async ({ input }) => {
      const record = await db.getPasswordResetToken(input.token);

      if (!record) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid or expired reset link." });
      }
      if (record.usedAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This reset link has already been used." });
      }
      if (new Date() > record.expiresAt) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "This reset link has expired. Please request a new one." });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      await db.updateUserPassword(record.userId, passwordHash);
      await db.markPasswordResetTokenUsed(input.token);

      return { success: true };
    }),
});

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  areFriends,
  createFriendship,
  getFriendRequest,
  getFriends,
  getPendingFriendRequests,
  getUserById,
  removeFriendship,
  searchUsers,
  sendFriendRequest,
  updateFriendRequest,
} from "../db";
import { protectedProcedure, router } from "../_core/trpc";

export const friendsRouter = router({
  // Search users to add as friends
  search: protectedProcedure
    .input(z.object({ query: z.string().min(2).max(50) }))
    .query(async ({ ctx, input }) => {
      return searchUsers(input.query, ctx.user.id);
    }),

  // Send a friend request
  sendRequest: protectedProcedure
    .input(z.object({ receiverId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.receiverId)
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot send a friend request to yourself" });
      const already = await areFriends(ctx.user.id, input.receiverId);
      if (already) throw new TRPCError({ code: "BAD_REQUEST", message: "Already friends" });
      const existing = await getFriendRequest(ctx.user.id, input.receiverId);
      if (existing && existing.status === "pending")
        throw new TRPCError({ code: "BAD_REQUEST", message: "Friend request already sent" });
      await sendFriendRequest(ctx.user.id, input.receiverId);
      return { success: true };
    }),

  // Accept a friend request
  acceptRequest: protectedProcedure
    .input(z.object({ requestId: z.number(), senderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await updateFriendRequest(input.requestId, "accepted");
      await createFriendship(ctx.user.id, input.senderId);
      return { success: true };
    }),

  // Decline a friend request
  declineRequest: protectedProcedure
    .input(z.object({ requestId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await updateFriendRequest(input.requestId, "declined");
      return { success: true };
    }),

  // List friends
  list: protectedProcedure.query(async ({ ctx }) => {
    return getFriends(ctx.user.id);
  }),

  // Pending requests (received)
  pendingRequests: protectedProcedure.query(async ({ ctx }) => {
    return getPendingFriendRequests(ctx.user.id);
  }),

  // Remove a friend
  remove: protectedProcedure
    .input(z.object({ friendId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await removeFriendship(ctx.user.id, input.friendId);
      return { success: true };
    }),

  // Check friendship status with a user
  status: protectedProcedure
    .input(z.object({ targetUserId: z.number() }))
    .query(async ({ ctx, input }) => {
      const isFriend = await areFriends(ctx.user.id, input.targetUserId);
      const sentRequest = await getFriendRequest(ctx.user.id, input.targetUserId);
      const receivedRequest = await getFriendRequest(input.targetUserId, ctx.user.id);
      return {
        isFriend,
        sentRequest: sentRequest?.status === "pending",
        receivedRequest: receivedRequest?.status === "pending" ? receivedRequest : null,
      };
    }),
});

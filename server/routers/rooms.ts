import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import {
  addRoomParticipant,
  createRoom,
  getAllRooms,
  getPublicRooms,
  getRoomByCode,
  getRoomById,
  getRoomCount,
  getRoomParticipants,
  getRoomsByHost,
  getUserJoinedRooms,
  removeRoomParticipant,
  updateRoomParticipantCount,
  updateRoomStatus,
} from "../db";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";

function generateRoomCode(): string {
  return nanoid(6).toUpperCase();
}

export const roomsRouter = router({
  // List public rooms (open to all)
  listPublic: publicProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(20), offset: z.number().default(0) }))
    .query(async ({ input }) => {
      const roomList = await getPublicRooms(input.limit, input.offset);
      return roomList;
    }),

  // Get room by code
  getByCode: publicProcedure
    .input(z.object({ code: z.string().min(4).max(10) }))
    .query(async ({ input }) => {
      const room = await getRoomByCode(input.code);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      return room;
    }),

  // Get room by ID with participants
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const room = await getRoomById(input.id);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      const participants = await getRoomParticipants(input.id);
      return { ...room, participants };
    }),

  // Create a new room (host)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(3).max(100),
        description: z.string().max(300).optional(),
        gameMode: z.enum(["quiz", "team_selection", "strategy", "scenario"]),
        visibility: z.enum(["public", "private"]).default("public"),
        entryType: z.enum(["open", "invite_only"]).default("open"),
        maxParticipants: z.number().min(2).max(50).default(10),
        matchId: z.number().optional(),
        settings: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const roomCode = generateRoomCode();
      const room = await createRoom({
        hostId: ctx.user.id,
        name: input.name,
        description: input.description,
        roomCode,
        gameMode: input.gameMode,
        visibility: input.visibility,
        entryType: input.entryType,
        maxParticipants: input.maxParticipants,
        matchId: input.matchId,
        settings: input.settings ?? {},
        currentParticipants: 1,
      });
      if (!room) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create room" });
      // Auto-join host
      await addRoomParticipant({ roomId: room.id, userId: ctx.user.id, score: 0 });
      return room;
    }),

  // Join a room by code
  join: protectedProcedure
    .input(z.object({ code: z.string().min(4).max(10) }))
    .mutation(async ({ ctx, input }) => {
      const room = await getRoomByCode(input.code);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      if (room.status !== "waiting") throw new TRPCError({ code: "BAD_REQUEST", message: "Room is not accepting participants" });
      if (room.currentParticipants >= room.maxParticipants)
        throw new TRPCError({ code: "BAD_REQUEST", message: "Room is full" });
      await addRoomParticipant({ roomId: room.id, userId: ctx.user.id, score: 0 });
      await updateRoomParticipantCount(room.id, 1);
      return { success: true, roomId: room.id };
    }),

  // Leave a room
  leave: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await removeRoomParticipant(input.roomId, ctx.user.id);
      await updateRoomParticipantCount(input.roomId, -1);
      return { success: true };
    }),

  // Start a room (host only)
  start: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const room = await getRoomById(input.roomId);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      if (room.hostId !== ctx.user.id) throw new TRPCError({ code: "FORBIDDEN", message: "Only the host can start the room" });
      if (room.status !== "waiting") throw new TRPCError({ code: "BAD_REQUEST", message: "Room is not in waiting state" });
      await updateRoomStatus(input.roomId, "in_progress", { startedAt: new Date() });
      return { success: true };
    }),

  // Close/cancel a room (host only)
  close: protectedProcedure
    .input(z.object({ roomId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const room = await getRoomById(input.roomId);
      if (!room) throw new TRPCError({ code: "NOT_FOUND", message: "Room not found" });
      if (room.hostId !== ctx.user.id && ctx.user.role !== "admin")
        throw new TRPCError({ code: "FORBIDDEN", message: "Only the host can close the room" });
      await updateRoomStatus(input.roomId, "cancelled", { completedAt: new Date() });
      return { success: true };
    }),

  // Get rooms hosted by current user
  myHosted: protectedProcedure.query(async ({ ctx }) => {
    return getRoomsByHost(ctx.user.id);
  }),

  // Get rooms joined by current user
  myJoined: protectedProcedure.query(async ({ ctx }) => {
    return getUserJoinedRooms(ctx.user.id);
  }),

  // Get participants of a room
  participants: publicProcedure
    .input(z.object({ roomId: z.number() }))
    .query(async ({ input }) => {
      return getRoomParticipants(input.roomId);
    }),

  // Admin: list all rooms
  adminList: protectedProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      const [roomList, total] = await Promise.all([
        getAllRooms(input.limit, input.offset),
        getRoomCount(),
      ]);
      return { rooms: roomList, total };
    }),
});

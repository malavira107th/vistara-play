import { and, desc, eq, like, ne, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  CricketMatch,
  CricketPlayer,
  InsertCricketMatch,
  InsertCricketPlayer,
  InsertGameSession,
  InsertQuizQuestion,
  InsertRoom,
  InsertRoomParticipant,
  InsertUser,
  QuizQuestion,
  Room,
  friendRequests,
  friendships,
  gameSessions,
  leaderboardEntries,
  cricketMatches,
  cricketPlayers,
  quizQuestions,
  roomParticipants,
  rooms,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── User Helpers ─────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const fields = ["name", "email", "loginMethod"] as const;
  for (const field of fields) {
    const val = user[field];
    if (val !== undefined) {
      values[field] = val ?? null;
      updateSet[field] = val ?? null;
    }
  }
  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function updateUserProfile(
  userId: number,
  data: { username?: string; bio?: string; avatarUrl?: string; name?: string }
) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function searchUsers(query: string, excludeUserId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ id: users.id, name: users.name, username: users.username, avatarUrl: users.avatarUrl, skillRating: users.skillRating })
    .from(users)
    .where(
      and(
        ne(users.id, excludeUserId),
        or(like(users.name, `%${query}%`), like(users.username, `%${query}%`))
      )
    )
    .limit(20);
}

export async function getAllUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt)).limit(limit).offset(offset);
}

export async function getUserCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(users);
  return result[0]?.count ?? 0;
}

// ─── Room Helpers ─────────────────────────────────────────────────────────────

export async function createRoom(data: InsertRoom) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(rooms).values(data);
  const result = await db.select().from(rooms).where(eq(rooms.roomCode, data.roomCode!)).limit(1);
  return result[0];
}

export async function getRoomById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
  return result[0];
}

export async function getRoomByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rooms).where(eq(rooms.roomCode, code.toUpperCase())).limit(1);
  return result[0];
}

export async function getPublicRooms(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(rooms)
    .where(and(eq(rooms.visibility, "public"), eq(rooms.status, "waiting")))
    .orderBy(desc(rooms.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getRoomsByHost(hostId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rooms).where(eq(rooms.hostId, hostId)).orderBy(desc(rooms.createdAt)).limit(50);
}

export async function updateRoomStatus(
  roomId: number,
  status: Room["status"],
  extra?: { startedAt?: Date; completedAt?: Date }
) {
  const db = await getDb();
  if (!db) return;
  await db.update(rooms).set({ status, ...extra, updatedAt: new Date() }).where(eq(rooms.id, roomId));
}

export async function updateRoomParticipantCount(roomId: number, delta: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(rooms)
    .set({ currentParticipants: sql`currentParticipants + ${delta}`, updatedAt: new Date() })
    .where(eq(rooms.id, roomId));
}

export async function getAllRooms(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rooms).orderBy(desc(rooms.createdAt)).limit(limit).offset(offset);
}

export async function getRoomCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(rooms);
  return result[0]?.count ?? 0;
}

// ─── Room Participant Helpers ─────────────────────────────────────────────────

export async function addRoomParticipant(data: InsertRoomParticipant) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(roomParticipants)
    .values(data)
    .onDuplicateKeyUpdate({ set: { isActive: true, leftAt: null } });
}

export async function removeRoomParticipant(roomId: number, userId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(roomParticipants)
    .set({ isActive: false, leftAt: new Date() })
    .where(and(eq(roomParticipants.roomId, roomId), eq(roomParticipants.userId, userId)));
}

export async function getRoomParticipants(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: roomParticipants.id,
      userId: roomParticipants.userId,
      score: roomParticipants.score,
      rank: roomParticipants.rank,
      joinedAt: roomParticipants.joinedAt,
      name: users.name,
      username: users.username,
      avatarUrl: users.avatarUrl,
      skillRating: users.skillRating,
    })
    .from(roomParticipants)
    .innerJoin(users, eq(roomParticipants.userId, users.id))
    .where(and(eq(roomParticipants.roomId, roomId), eq(roomParticipants.isActive, true)))
    .orderBy(desc(roomParticipants.score));
}

export async function getUserJoinedRooms(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ room: rooms, joinedAt: roomParticipants.joinedAt, score: roomParticipants.score })
    .from(roomParticipants)
    .innerJoin(rooms, eq(roomParticipants.roomId, rooms.id))
    .where(eq(roomParticipants.userId, userId))
    .orderBy(desc(roomParticipants.joinedAt))
    .limit(50);
}

export async function updateParticipantScore(roomId: number, userId: number, score: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(roomParticipants)
    .set({ score })
    .where(and(eq(roomParticipants.roomId, roomId), eq(roomParticipants.userId, userId)));
}

// ─── Game Session Helpers ─────────────────────────────────────────────────────

export async function createGameSession(data: InsertGameSession) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.insert(gameSessions).values(data);
  const result = await db
    .select()
    .from(gameSessions)
    .where(and(eq(gameSessions.roomId, data.roomId), eq(gameSessions.userId, data.userId)))
    .orderBy(desc(gameSessions.createdAt))
    .limit(1);
  return result[0];
}

export async function getGameSession(roomId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(gameSessions)
    .where(and(eq(gameSessions.roomId, roomId), eq(gameSessions.userId, userId), eq(gameSessions.status, "active")))
    .limit(1);
  return result[0];
}

export async function completeGameSession(
  sessionId: number,
  score: number,
  maxScore: number,
  answers: unknown,
  timeTakenSeconds: number
) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(gameSessions)
    .set({ status: "completed", score, maxScore, answers, timeTakenSeconds, completedAt: new Date() })
    .where(eq(gameSessions.id, sessionId));
}

export async function getUserGameHistory(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      session: gameSessions,
      roomName: rooms.name,
      roomCode: rooms.roomCode,
    })
    .from(gameSessions)
    .innerJoin(rooms, eq(gameSessions.roomId, rooms.id))
    .where(eq(gameSessions.userId, userId))
    .orderBy(desc(gameSessions.createdAt))
    .limit(50);
}

export async function getGameSessionCount() {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`count(*)` }).from(gameSessions);
  return result[0]?.count ?? 0;
}

// ─── Leaderboard Helpers ──────────────────────────────────────────────────────

export async function upsertLeaderboardEntry(userId: number, pointsToAdd: number, won: boolean) {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(leaderboardEntries)
    .values({
      userId,
      totalPoints: pointsToAdd,
      gamesPlayed: 1,
      gamesWon: won ? 1 : 0,
      weeklyPoints: pointsToAdd,
      monthlyPoints: pointsToAdd,
    })
    .onDuplicateKeyUpdate({
      set: {
        totalPoints: sql`totalPoints + ${pointsToAdd}`,
        gamesPlayed: sql`gamesPlayed + 1`,
        gamesWon: sql`gamesWon + ${won ? 1 : 0}`,
        weeklyPoints: sql`weeklyPoints + ${pointsToAdd}`,
        monthlyPoints: sql`monthlyPoints + ${pointsToAdd}`,
        updatedAt: new Date(),
      },
    });
}

export async function getGlobalLeaderboard(limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      userId: leaderboardEntries.userId,
      totalPoints: leaderboardEntries.totalPoints,
      gamesPlayed: leaderboardEntries.gamesPlayed,
      gamesWon: leaderboardEntries.gamesWon,
      skillRating: leaderboardEntries.skillRating,
      weeklyPoints: leaderboardEntries.weeklyPoints,
      monthlyPoints: leaderboardEntries.monthlyPoints,
      name: users.name,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(leaderboardEntries.userId, users.id))
    .orderBy(desc(leaderboardEntries.totalPoints))
    .limit(limit);
}

export async function getFriendsLeaderboard(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const friendIds = await db
    .select({ friendId: friendships.friendId })
    .from(friendships)
    .where(eq(friendships.userId, userId));
  const ids = [userId, ...friendIds.map((f) => f.friendId)];
  if (ids.length === 0) return [];
  return db
    .select({
      userId: leaderboardEntries.userId,
      totalPoints: leaderboardEntries.totalPoints,
      gamesPlayed: leaderboardEntries.gamesPlayed,
      gamesWon: leaderboardEntries.gamesWon,
      skillRating: leaderboardEntries.skillRating,
      name: users.name,
      username: users.username,
      avatarUrl: users.avatarUrl,
    })
    .from(leaderboardEntries)
    .innerJoin(users, eq(leaderboardEntries.userId, users.id))
    .where(sql`${leaderboardEntries.userId} IN (${sql.join(ids.map((id) => sql`${id}`), sql`, `)})`)
    .orderBy(desc(leaderboardEntries.totalPoints))
    .limit(50);
}

export async function getRoomLeaderboard(roomId: number) {
  return getRoomParticipants(roomId);
}

// ─── Friends Helpers ──────────────────────────────────────────────────────────

export async function sendFriendRequest(senderId: number, receiverId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(friendRequests).values({ senderId, receiverId }).onDuplicateKeyUpdate({ set: { status: "pending", updatedAt: new Date() } });
}

export async function getFriendRequest(senderId: number, receiverId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(friendRequests)
    .where(and(eq(friendRequests.senderId, senderId), eq(friendRequests.receiverId, receiverId)))
    .limit(1);
  return result[0];
}

export async function updateFriendRequest(id: number, status: "accepted" | "declined") {
  const db = await getDb();
  if (!db) return;
  await db.update(friendRequests).set({ status, updatedAt: new Date() }).where(eq(friendRequests.id, id));
}

export async function createFriendship(userId: number, friendId: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(friendships).values({ userId, friendId }).onDuplicateKeyUpdate({ set: { createdAt: new Date() } });
  await db.insert(friendships).values({ userId: friendId, friendId: userId }).onDuplicateKeyUpdate({ set: { createdAt: new Date() } });
}

export async function removeFriendship(userId: number, friendId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(friendships).where(and(eq(friendships.userId, userId), eq(friendships.friendId, friendId)));
  await db.delete(friendships).where(and(eq(friendships.userId, friendId), eq(friendships.friendId, userId)));
}

export async function getFriends(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: users.id,
      name: users.name,
      username: users.username,
      avatarUrl: users.avatarUrl,
      skillRating: users.skillRating,
      totalGamesPlayed: users.totalGamesPlayed,
      totalGamesWon: users.totalGamesWon,
      totalPoints: users.totalPoints,
    })
    .from(friendships)
    .innerJoin(users, eq(friendships.friendId, users.id))
    .where(eq(friendships.userId, userId));
}

export async function getPendingFriendRequests(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: friendRequests.id,
      senderId: friendRequests.senderId,
      createdAt: friendRequests.createdAt,
      senderName: users.name,
      senderUsername: users.username,
      senderAvatar: users.avatarUrl,
    })
    .from(friendRequests)
    .innerJoin(users, eq(friendRequests.senderId, users.id))
    .where(and(eq(friendRequests.receiverId, userId), eq(friendRequests.status, "pending")));
}

export async function areFriends(userId: number, friendId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(friendships)
    .where(and(eq(friendships.userId, userId), eq(friendships.friendId, friendId)))
    .limit(1);
  return result.length > 0;
}

// ─── Quiz Question Helpers ────────────────────────────────────────────────────

export async function getQuizQuestions(difficulty?: QuizQuestion["difficulty"], count = 10) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(quizQuestions.isActive, true)];
  if (difficulty) conditions.push(eq(quizQuestions.difficulty, difficulty));
  return db
    .select()
    .from(quizQuestions)
    .where(and(...conditions))
    .orderBy(sql`RAND()`)
    .limit(count);
}

export async function getAllQuizQuestions() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizQuestions).orderBy(desc(quizQuestions.createdAt));
}

export async function createQuizQuestion(data: InsertQuizQuestion) {
  const db = await getDb();
  if (!db) return;
  await db.insert(quizQuestions).values(data);
}

export async function updateQuizQuestion(id: number, data: Partial<InsertQuizQuestion>) {
  const db = await getDb();
  if (!db) return;
  await db.update(quizQuestions).set(data).where(eq(quizQuestions.id, id));
}

export async function deleteQuizQuestion(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(quizQuestions).set({ isActive: false }).where(eq(quizQuestions.id, id));
}

// ─── Cricket Player Helpers ───────────────────────────────────────────────────

export async function getCricketPlayers(matchId?: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cricketPlayers).where(eq(cricketPlayers.isActive, true)).orderBy(cricketPlayers.name);
}

export async function getAllCricketPlayers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(cricketPlayers).orderBy(cricketPlayers.name);
}

export async function createCricketPlayer(data: InsertCricketPlayer) {
  const db = await getDb();
  if (!db) return;
  await db.insert(cricketPlayers).values(data);
}

export async function updateCricketPlayer(id: number, data: Partial<InsertCricketPlayer>) {
  const db = await getDb();
  if (!db) return;
  await db.update(cricketPlayers).set({ ...data, updatedAt: new Date() }).where(eq(cricketPlayers.id, id));
}

// ─── Cricket Match Helpers ────────────────────────────────────────────────────

export async function getCricketMatches(status?: CricketMatch["status"]) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(cricketMatches.isActive, true)];
  if (status) conditions.push(eq(cricketMatches.status, status));
  return db.select().from(cricketMatches).where(and(...conditions)).orderBy(desc(cricketMatches.matchDate));
}

export async function getCricketMatchById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(cricketMatches).where(eq(cricketMatches.id, id)).limit(1);
  return result[0];
}

export async function createCricketMatch(data: InsertCricketMatch) {
  const db = await getDb();
  if (!db) return;
  await db.insert(cricketMatches).values(data);
}

export async function updateCricketMatch(id: number, data: Partial<InsertCricketMatch>) {
  const db = await getDb();
  if (!db) return;
  await db.update(cricketMatches).set({ ...data, updatedAt: new Date() }).where(eq(cricketMatches.id, id));
}

// ─── Platform Stats (Admin) ───────────────────────────────────────────────────

export async function getPlatformStats() {
  const db = await getDb();
  if (!db) return { users: 0, rooms: 0, games: 0, activeRooms: 0 };
  const [userCount, roomCount, gameCount, activeRoomCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(rooms),
    db.select({ count: sql<number>`count(*)` }).from(gameSessions),
    db.select({ count: sql<number>`count(*)` }).from(rooms).where(eq(rooms.status, "in_progress")),
  ]);
  return {
    users: userCount[0]?.count ?? 0,
    rooms: roomCount[0]?.count ?? 0,
    games: gameCount[0]?.count ?? 0,
    activeRooms: activeRoomCount[0]?.count ?? 0,
  };
}

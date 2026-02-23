import {
  boolean,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  float,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

// ─── Users ────────────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  username: varchar("username", { length: 50 }).unique(),
  avatarUrl: text("avatarUrl"),
  bio: text("bio"),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  // Stats
  totalGamesPlayed: int("totalGamesPlayed").default(0).notNull(),
  totalGamesWon: int("totalGamesWon").default(0).notNull(),
  totalPoints: int("totalPoints").default(0).notNull(),
  skillRating: int("skillRating").default(1000).notNull(),
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Cricket Players (Admin managed, used in Team Selection game) ─────────────
export const cricketPlayers = mysqlTable("cricket_players", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  country: varchar("country", { length: 60 }).notNull(),
  role: mysqlEnum("role", ["batsman", "bowler", "allrounder", "wicketkeeper"]).notNull(),
  battingAvg: float("battingAvg").default(0),
  bowlingAvg: float("bowlingAvg").default(0),
  strikeRate: float("strikeRate").default(0),
  economyRate: float("economyRate").default(0),
  recentForm: mysqlEnum("recentForm", ["excellent", "good", "average", "poor"]).default("average"),
  creditValue: int("creditValue").default(8).notNull(), // points cost in team selection
  imageUrl: text("imageUrl"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CricketPlayer = typeof cricketPlayers.$inferSelect;
export type InsertCricketPlayer = typeof cricketPlayers.$inferInsert;

// ─── Cricket Matches (Admin managed, used as context for games) ───────────────
export const cricketMatches = mysqlTable("cricket_matches", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  team1: varchar("team1", { length: 80 }).notNull(),
  team2: varchar("team2", { length: 80 }).notNull(),
  venue: varchar("venue", { length: 150 }),
  matchType: mysqlEnum("matchType", ["T20", "ODI", "Test"]).notNull(),
  matchDate: timestamp("matchDate").notNull(),
  status: mysqlEnum("status", ["upcoming", "live", "completed"]).default("upcoming").notNull(),
  pitchCondition: mysqlEnum("pitchCondition", ["batting", "bowling", "balanced"]).default("balanced"),
  weatherCondition: mysqlEnum("weatherCondition", ["sunny", "cloudy", "overcast", "humid"]).default("sunny"),
  result: text("result"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CricketMatch = typeof cricketMatches.$inferSelect;
export type InsertCricketMatch = typeof cricketMatches.$inferInsert;

// ─── Quiz Questions (Admin managed) ──────────────────────────────────────────
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  question: text("question").notNull(),
  optionA: varchar("optionA", { length: 300 }).notNull(),
  optionB: varchar("optionB", { length: 300 }).notNull(),
  optionC: varchar("optionC", { length: 300 }).notNull(),
  optionD: varchar("optionD", { length: 300 }).notNull(),
  correctOption: mysqlEnum("correctOption", ["A", "B", "C", "D"]).notNull(),
  explanation: text("explanation"),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  category: mysqlEnum("category", ["history", "rules", "players", "records", "tactics"]).default("history").notNull(),
  points: int("points").default(10).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

// ─── Rooms ────────────────────────────────────────────────────────────────────
export const rooms = mysqlTable(
  "rooms",
  {
    id: int("id").autoincrement().primaryKey(),
    hostId: int("hostId").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    roomCode: varchar("roomCode", { length: 8 }).notNull().unique(),
    gameMode: mysqlEnum("gameMode", ["quiz", "team_selection", "strategy", "scenario"]).notNull(),
    matchId: int("matchId"), // optional: link to a cricket match
    visibility: mysqlEnum("visibility", ["public", "private"]).default("public").notNull(),
    status: mysqlEnum("status", ["waiting", "in_progress", "completed", "cancelled"]).default("waiting").notNull(),
    maxParticipants: int("maxParticipants").default(10).notNull(),
    currentParticipants: int("currentParticipants").default(0).notNull(),
    entryType: mysqlEnum("entryType", ["open", "invite_only"]).default("open").notNull(),
    settings: json("settings"), // game-mode specific settings
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
    startedAt: timestamp("startedAt"),
    completedAt: timestamp("completedAt"),
  },
  (table) => [index("rooms_hostId_idx").on(table.hostId), index("rooms_status_idx").on(table.status)]
);

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

// ─── Room Participants ────────────────────────────────────────────────────────
export const roomParticipants = mysqlTable(
  "room_participants",
  {
    id: int("id").autoincrement().primaryKey(),
    roomId: int("roomId").notNull(),
    userId: int("userId").notNull(),
    joinedAt: timestamp("joinedAt").defaultNow().notNull(),
    leftAt: timestamp("leftAt"),
    isActive: boolean("isActive").default(true).notNull(),
    score: int("score").default(0).notNull(),
    rank: int("rank"),
  },
  (table) => [
    index("rp_roomId_idx").on(table.roomId),
    index("rp_userId_idx").on(table.userId),
    uniqueIndex("rp_room_user_unique").on(table.roomId, table.userId),
  ]
);

export type RoomParticipant = typeof roomParticipants.$inferSelect;
export type InsertRoomParticipant = typeof roomParticipants.$inferInsert;

// ─── Game Sessions ────────────────────────────────────────────────────────────
export const gameSessions = mysqlTable(
  "game_sessions",
  {
    id: int("id").autoincrement().primaryKey(),
    roomId: int("roomId").notNull(),
    userId: int("userId").notNull(),
    gameMode: mysqlEnum("gameMode", ["quiz", "team_selection", "strategy", "scenario"]).notNull(),
    status: mysqlEnum("status", ["active", "completed", "abandoned"]).default("active").notNull(),
    score: int("score").default(0).notNull(),
    maxScore: int("maxScore").default(0).notNull(),
    answers: json("answers"), // array of {questionId, selectedOption, isCorrect, timeTaken}
    teamSelection: json("teamSelection"), // for team_selection mode
    strategyChoices: json("strategyChoices"), // for strategy/scenario modes
    timeTakenSeconds: int("timeTakenSeconds").default(0),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [index("gs_roomId_idx").on(table.roomId), index("gs_userId_idx").on(table.userId)]
);

export type GameSession = typeof gameSessions.$inferSelect;
export type InsertGameSession = typeof gameSessions.$inferInsert;

// ─── Leaderboard Entries (aggregated per user, global) ────────────────────────
export const leaderboardEntries = mysqlTable(
  "leaderboard_entries",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    totalPoints: int("totalPoints").default(0).notNull(),
    gamesPlayed: int("gamesPlayed").default(0).notNull(),
    gamesWon: int("gamesWon").default(0).notNull(),
    skillRating: int("skillRating").default(1000).notNull(),
    weeklyPoints: int("weeklyPoints").default(0).notNull(),
    monthlyPoints: int("monthlyPoints").default(0).notNull(),
    rank: int("rank"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [index("lb_totalPoints_idx").on(table.totalPoints)]
);

export type LeaderboardEntry = typeof leaderboardEntries.$inferSelect;
export type InsertLeaderboardEntry = typeof leaderboardEntries.$inferInsert;

// ─── Friendships ──────────────────────────────────────────────────────────────
export const friendships = mysqlTable(
  "friendships",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    friendId: int("friendId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => [
    index("fs_userId_idx").on(table.userId),
    uniqueIndex("fs_user_friend_unique").on(table.userId, table.friendId),
  ]
);

export type Friendship = typeof friendships.$inferSelect;

// ─── Friend Requests ──────────────────────────────────────────────────────────
export const friendRequests = mysqlTable(
  "friend_requests",
  {
    id: int("id").autoincrement().primaryKey(),
    senderId: int("senderId").notNull(),
    receiverId: int("receiverId").notNull(),
    status: mysqlEnum("status", ["pending", "accepted", "declined"]).default("pending").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => [
    index("fr_senderId_idx").on(table.senderId),
    index("fr_receiverId_idx").on(table.receiverId),
    uniqueIndex("fr_sender_receiver_unique").on(table.senderId, table.receiverId),
  ]
);

export type FriendRequest = typeof friendRequests.$inferSelect;

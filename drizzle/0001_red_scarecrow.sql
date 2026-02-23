CREATE TABLE `cricket_matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(200) NOT NULL,
	`team1` varchar(80) NOT NULL,
	`team2` varchar(80) NOT NULL,
	`venue` varchar(150),
	`matchType` enum('T20','ODI','Test') NOT NULL,
	`matchDate` timestamp NOT NULL,
	`status` enum('upcoming','live','completed') NOT NULL DEFAULT 'upcoming',
	`pitchCondition` enum('batting','bowling','balanced') DEFAULT 'balanced',
	`weatherCondition` enum('sunny','cloudy','overcast','humid') DEFAULT 'sunny',
	`result` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cricket_matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cricket_players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`country` varchar(60) NOT NULL,
	`role` enum('batsman','bowler','allrounder','wicketkeeper') NOT NULL,
	`battingAvg` float DEFAULT 0,
	`bowlingAvg` float DEFAULT 0,
	`strikeRate` float DEFAULT 0,
	`economyRate` float DEFAULT 0,
	`recentForm` enum('excellent','good','average','poor') DEFAULT 'average',
	`creditValue` int NOT NULL DEFAULT 8,
	`imageUrl` text,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cricket_players_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `friend_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`senderId` int NOT NULL,
	`receiverId` int NOT NULL,
	`status` enum('pending','accepted','declined') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `friend_requests_id` PRIMARY KEY(`id`),
	CONSTRAINT `fr_sender_receiver_unique` UNIQUE(`senderId`,`receiverId`)
);
--> statement-breakpoint
CREATE TABLE `friendships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`friendId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `friendships_id` PRIMARY KEY(`id`),
	CONSTRAINT `fs_user_friend_unique` UNIQUE(`userId`,`friendId`)
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`gameMode` enum('quiz','team_selection','strategy','scenario') NOT NULL,
	`status` enum('active','completed','abandoned') NOT NULL DEFAULT 'active',
	`score` int NOT NULL DEFAULT 0,
	`maxScore` int NOT NULL DEFAULT 0,
	`answers` json,
	`teamSelection` json,
	`strategyChoices` json,
	`timeTakenSeconds` int DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `game_sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaderboard_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalPoints` int NOT NULL DEFAULT 0,
	`gamesPlayed` int NOT NULL DEFAULT 0,
	`gamesWon` int NOT NULL DEFAULT 0,
	`skillRating` int NOT NULL DEFAULT 1000,
	`weeklyPoints` int NOT NULL DEFAULT 0,
	`monthlyPoints` int NOT NULL DEFAULT 0,
	`rank` int,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboard_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaderboard_entries_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `quiz_questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`question` text NOT NULL,
	`optionA` varchar(300) NOT NULL,
	`optionB` varchar(300) NOT NULL,
	`optionC` varchar(300) NOT NULL,
	`optionD` varchar(300) NOT NULL,
	`correctOption` enum('A','B','C','D') NOT NULL,
	`explanation` text,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`category` enum('history','rules','players','records','tactics') NOT NULL DEFAULT 'history',
	`points` int NOT NULL DEFAULT 10,
	`isActive` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_questions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `room_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`roomId` int NOT NULL,
	`userId` int NOT NULL,
	`joinedAt` timestamp NOT NULL DEFAULT (now()),
	`leftAt` timestamp,
	`isActive` boolean NOT NULL DEFAULT true,
	`score` int NOT NULL DEFAULT 0,
	`rank` int,
	CONSTRAINT `room_participants_id` PRIMARY KEY(`id`),
	CONSTRAINT `rp_room_user_unique` UNIQUE(`roomId`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `rooms` (
	`id` int AUTO_INCREMENT NOT NULL,
	`hostId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	`roomCode` varchar(8) NOT NULL,
	`gameMode` enum('quiz','team_selection','strategy','scenario') NOT NULL,
	`matchId` int,
	`visibility` enum('public','private') NOT NULL DEFAULT 'public',
	`status` enum('waiting','in_progress','completed','cancelled') NOT NULL DEFAULT 'waiting',
	`maxParticipants` int NOT NULL DEFAULT 10,
	`currentParticipants` int NOT NULL DEFAULT 0,
	`entryType` enum('open','invite_only') NOT NULL DEFAULT 'open',
	`settings` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`startedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `rooms_id` PRIMARY KEY(`id`),
	CONSTRAINT `rooms_roomCode_unique` UNIQUE(`roomCode`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `totalGamesPlayed` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalGamesWon` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `skillRating` int DEFAULT 1000 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_username_unique` UNIQUE(`username`);--> statement-breakpoint
CREATE INDEX `fr_senderId_idx` ON `friend_requests` (`senderId`);--> statement-breakpoint
CREATE INDEX `fr_receiverId_idx` ON `friend_requests` (`receiverId`);--> statement-breakpoint
CREATE INDEX `fs_userId_idx` ON `friendships` (`userId`);--> statement-breakpoint
CREATE INDEX `gs_roomId_idx` ON `game_sessions` (`roomId`);--> statement-breakpoint
CREATE INDEX `gs_userId_idx` ON `game_sessions` (`userId`);--> statement-breakpoint
CREATE INDEX `lb_totalPoints_idx` ON `leaderboard_entries` (`totalPoints`);--> statement-breakpoint
CREATE INDEX `rp_roomId_idx` ON `room_participants` (`roomId`);--> statement-breakpoint
CREATE INDEX `rp_userId_idx` ON `room_participants` (`userId`);--> statement-breakpoint
CREATE INDEX `rooms_hostId_idx` ON `rooms` (`hostId`);--> statement-breakpoint
CREATE INDEX `rooms_status_idx` ON `rooms` (`status`);
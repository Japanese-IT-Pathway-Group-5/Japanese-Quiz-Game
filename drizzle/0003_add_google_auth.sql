ALTER TABLE `players` ADD `email` text;
--> statement-breakpoint
ALTER TABLE `players` ADD `google_id` text;
--> statement-breakpoint
ALTER TABLE `players` ADD `avatar_url` text;
--> statement-breakpoint
ALTER TABLE `players` ADD `is_anonymous` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
CREATE INDEX `players_google_id_idx` ON `players` (`google_id`);

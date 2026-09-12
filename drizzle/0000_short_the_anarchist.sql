CREATE TABLE `cats` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`names` text NOT NULL,
	`location` text NOT NULL,
	`notes` text NOT NULL,
	`photos` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_cats_owner` ON `cats` (`owner`);
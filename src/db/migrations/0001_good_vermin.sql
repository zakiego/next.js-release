CREATE INDEX `prerelease` ON `releases` (`prerelease`);--> statement-breakpoint
CREATE INDEX `draft` ON `releases` (`draft`);--> statement-breakpoint
CREATE UNIQUE INDEX `created_at` ON `releases` (`created_at`);
CREATE TABLE `chains` (
	`name` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `collections` (
	`name` text PRIMARY KEY NOT NULL,
	`chain` text NOT NULL,
	`presentation_picture_url` text NOT NULL,
	`marketplace_url` text NOT NULL,
	`discord_url` text NOT NULL,
	`twitter_url` text NOT NULL,
	`website_url` text,
	`created_at` text NOT NULL,
	`active` integer DEFAULT true,
	`paylink_id` text,
	`cache_strategy_sMaxAge` integer,
	`cache_strategy_maxAge` integer,
	FOREIGN KEY (`chain`) REFERENCES `chains`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_paylink_id_unique` ON `collections` (`paylink_id`);--> statement-breakpoint
CREATE TABLE `currencies` (
	`chain` text NOT NULL,
	`name` text NOT NULL,
	`symbol` text NOT NULL,
	`decimals` integer NOT NULL,
	`address` text NOT NULL,
	PRIMARY KEY(`chain`, `symbol`),
	FOREIGN KEY (`chain`) REFERENCES `chains`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `logos` (
	`url` text PRIMARY KEY NOT NULL,
	`collection` text NOT NULL,
	FOREIGN KEY (`collection`) REFERENCES `collections`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `nft_metadata` (
	`collection` text NOT NULL,
	`nft_id` integer NOT NULL,
	`uri` text NOT NULL,
	PRIMARY KEY(`collection`, `nft_id`),
	FOREIGN KEY (`collection`) REFERENCES `collections`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `refunds` (
	`id` text PRIMARY KEY NOT NULL,
	`refunded` integer DEFAULT false,
	`verified` integer DEFAULT false,
	`canDelete` integer,
	`created_at` text NOT NULL,
	`paylink_id` text,
	`helio_transaction_id` text,
	`client_public_key` text,
	`amount` text,
	`associated_refund_transaction_signature` text,
	`chain` text NOT NULL,
	`currency` text NOT NULL,
	FOREIGN KEY (`chain`,`currency`) REFERENCES `currencies`(`chain`,`symbol`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `refunds_helio_transaction_id_unique` ON `refunds` (`helio_transaction_id`);--> statement-breakpoint
CREATE TABLE `unsupported_traits` (
	`collection` text NOT NULL,
	`trait_type` text NOT NULL,
	`value` text NOT NULL,
	PRIMARY KEY(`collection`, `trait_type`, `value`),
	FOREIGN KEY (`collection`) REFERENCES `collections`(`name`) ON UPDATE no action ON DELETE no action
);

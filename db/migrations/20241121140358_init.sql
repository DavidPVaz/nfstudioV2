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
	`paylink_id` text NOT NULL,
	`cache_strategy_sMaxAge` integer,
	`cache_strategy_maxAge` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `collections_paylink_id_unique` ON `collections` (`paylink_id`);--> statement-breakpoint
CREATE TABLE `currencies` (
	`symbol` text PRIMARY KEY NOT NULL,
	`mint_address` text NOT NULL,
	`decimals` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `currencies_mint_address_unique` ON `currencies` (`mint_address`);--> statement-breakpoint
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
	`transaction_signature` text,
	`currency` text,
	FOREIGN KEY (`paylink_id`) REFERENCES `collections`(`paylink_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`currency`) REFERENCES `currencies`(`symbol`) ON UPDATE no action ON DELETE no action
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

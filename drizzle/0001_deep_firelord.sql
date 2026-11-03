CREATE TABLE `applications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`internshipId` int NOT NULL,
	`studentId` int NOT NULL,
	`coverLetter` text,
	`status` enum('sent','viewed','shortlisted','rejected','accepted') NOT NULL DEFAULT 'sent',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `applications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `companyProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`legalName` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`city` varchar(120) NOT NULL,
	`industry` varchar(120) NOT NULL,
	`website` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companyProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `companyProfiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `internships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text NOT NULL,
	`area` varchar(100) NOT NULL,
	`city` varchar(120) NOT NULL,
	`modality` enum('presencial','hibrido','remoto') NOT NULL,
	`requirements` text NOT NULL,
	`deadline` timestamp NOT NULL,
	`status` enum('open','closed') NOT NULL DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `internships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `studentProfiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`university` varchar(180) NOT NULL,
	`universityCity` varchar(120) NOT NULL,
	`course` varchar(140) NOT NULL,
	`semester` varchar(40) NOT NULL,
	`skills` text NOT NULL,
	`objective` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `studentProfiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `studentProfiles_userId_unique` UNIQUE(`userId`)
);

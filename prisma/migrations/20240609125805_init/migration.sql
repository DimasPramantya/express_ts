/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `user_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `users` table. All the data in the column will be lost.
  - The primary key for the `users_authorities` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `authorityId` on the `users_authorities` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `users_authorities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `user_tokens` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refresh_token` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `user_tokens` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authority_id` to the `users_authorities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `users_authorities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `user_tokens` DROP FOREIGN KEY `user_tokens_userId_fkey`;

-- DropForeignKey
ALTER TABLE `users_authorities` DROP FOREIGN KEY `users_authorities_authorityId_fkey`;

-- DropForeignKey
ALTER TABLE `users_authorities` DROP FOREIGN KEY `users_authorities_userId_fkey`;

-- AlterTable
ALTER TABLE `user_tokens` DROP COLUMN `refreshToken`,
    DROP COLUMN `userId`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `refresh_token` VARCHAR(2048) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `profilePicture`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `profile_picture` VARCHAR(300) NULL,
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users_authorities` DROP PRIMARY KEY,
    DROP COLUMN `authorityId`,
    DROP COLUMN `userId`,
    ADD COLUMN `authority_id` INTEGER NOT NULL,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_id`, `authority_id`);

-- CreateIndex
CREATE UNIQUE INDEX `user_tokens_user_id_key` ON `user_tokens`(`user_id`);

-- AddForeignKey
ALTER TABLE `users_authorities` ADD CONSTRAINT `users_authorities_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_authorities` ADD CONSTRAINT `users_authorities_authority_id_fkey` FOREIGN KEY (`authority_id`) REFERENCES `authorities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_tokens` ADD CONSTRAINT `user_tokens_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

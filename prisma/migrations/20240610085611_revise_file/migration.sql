/*
  Warnings:

  - You are about to alter the column `file_id` on the `blogs` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `files` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `files` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Added the required column `cloudinary_id` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `blogs` DROP FOREIGN KEY `blogs_file_id_fkey`;

-- AlterTable
ALTER TABLE `blogs` MODIFY `file_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `files` DROP PRIMARY KEY,
    ADD COLUMN `cloudinary_id` VARCHAR(191) NOT NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `blogs` ADD CONSTRAINT `blogs_file_id_fkey` FOREIGN KEY (`file_id`) REFERENCES `files`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

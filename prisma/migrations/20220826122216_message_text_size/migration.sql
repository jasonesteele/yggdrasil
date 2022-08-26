/*
  Warnings:

  - You are about to alter the column `text` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(2048)`.

*/
-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "text" SET DATA TYPE VARCHAR(2048);

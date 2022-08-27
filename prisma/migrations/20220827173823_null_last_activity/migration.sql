-- AlterTable
ALTER TABLE "User" ALTER COLUMN "last_activity" DROP NOT NULL,
ALTER COLUMN "last_activity" DROP DEFAULT;

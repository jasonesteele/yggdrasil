/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `World` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "World_name_key" ON "World"("name");

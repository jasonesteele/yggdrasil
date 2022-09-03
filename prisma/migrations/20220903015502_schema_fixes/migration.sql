-- CreateTable
CREATE TABLE "_UserToWorld" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserToWorld_AB_unique" ON "_UserToWorld"("A", "B");

-- CreateIndex
CREATE INDEX "_UserToWorld_B_index" ON "_UserToWorld"("B");

-- AddForeignKey
ALTER TABLE "_UserToWorld" ADD CONSTRAINT "_UserToWorld_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserToWorld" ADD CONSTRAINT "_UserToWorld_B_fkey" FOREIGN KEY ("B") REFERENCES "World"("id") ON DELETE CASCADE ON UPDATE CASCADE;

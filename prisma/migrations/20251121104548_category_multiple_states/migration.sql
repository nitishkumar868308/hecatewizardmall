/*
  Warnings:

  - You are about to drop the column `stateId` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Category" DROP CONSTRAINT "Category_stateId_fkey";

-- AlterTable
ALTER TABLE "public"."Category" DROP COLUMN "stateId";

-- CreateTable
CREATE TABLE "public"."_CategoryStates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CategoryStates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CategoryStates_B_index" ON "public"."_CategoryStates"("B");

-- AddForeignKey
ALTER TABLE "public"."_CategoryStates" ADD CONSTRAINT "_CategoryStates_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_CategoryStates" ADD CONSTRAINT "_CategoryStates_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

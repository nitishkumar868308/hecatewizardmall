/*
  Warnings:

  - You are about to drop the column `receiver` on the `ChatMessage` table. All the data in the column will be lost.
  - Added the required column `receiverId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChatMessage" DROP COLUMN "receiver",
ADD COLUMN     "receiverId" INTEGER NOT NULL;

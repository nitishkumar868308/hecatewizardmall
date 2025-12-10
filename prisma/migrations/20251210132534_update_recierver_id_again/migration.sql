/*
  Warnings:

  - You are about to drop the column `sender` on the `ChatMessage` table. All the data in the column will be lost.
  - Added the required column `senderId` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChatMessage" DROP COLUMN "sender",
ADD COLUMN     "senderId" INTEGER NOT NULL;

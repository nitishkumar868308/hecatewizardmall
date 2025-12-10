/*
  Warnings:

  - Added the required column `receiver` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverRole` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderRole` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."ChatMessage" ADD COLUMN     "receiver" TEXT NOT NULL,
ADD COLUMN     "receiverRole" TEXT NOT NULL,
ADD COLUMN     "senderRole" TEXT NOT NULL;

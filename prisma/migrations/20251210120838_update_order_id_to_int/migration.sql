/*
  Warnings:

  - Changed the type of `orderId` on the `ChatMessage` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."ChatMessage" DROP COLUMN "orderId",
ADD COLUMN     "orderId" INTEGER NOT NULL;

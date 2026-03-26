/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `AstrologerAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `AstrologerAccount` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `countryCode` to the `AstrologerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `AstrologerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneLocal` to the `AstrologerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `AstrologerService` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currencySymbol` to the `AstrologerService` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."AstrologerAccount_phoneNumber_key";

-- AlterTable
ALTER TABLE "public"."AstrologerAccount" DROP COLUMN "phoneNumber",
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "phoneLocal" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."AstrologerService" ADD COLUMN     "currency" TEXT NOT NULL,
ADD COLUMN     "currencySymbol" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AstrologerAccount_phone_key" ON "public"."AstrologerAccount"("phone");

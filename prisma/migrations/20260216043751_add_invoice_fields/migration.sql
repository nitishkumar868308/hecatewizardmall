/*
  Warnings:

  - A unique constraint covering the columns `[invoiceNumber]` on the table `Orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Orders" ADD COLUMN     "invoiceDate" TIMESTAMP(3),
ADD COLUMN     "invoiceNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Orders_invoiceNumber_key" ON "public"."Orders"("invoiceNumber");

/*
  Warnings:

  - You are about to drop the column `dimensions` on the `DelhiWarehouseStock` table. All the data in the column will be lost.
  - You are about to drop the column `productsSnapshot` on the `DelhiWarehouseStock` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dispatchId,productId,variationId]` on the table `DelhiWarehouseStock` will be added. If there are existing duplicate values, this will fail.
  - Made the column `dispatchId` on table `DelhiWarehouseStock` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."DelhiWarehouseStock" DROP COLUMN "dimensions",
DROP COLUMN "productsSnapshot",
ADD COLUMN     "productId" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "variationId" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "dispatchId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DelhiWarehouseStock_dispatchId_productId_variationId_key" ON "public"."DelhiWarehouseStock"("dispatchId", "productId", "variationId");

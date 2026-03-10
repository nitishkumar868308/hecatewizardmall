/*
  Warnings:

  - A unique constraint covering the columns `[locationCode,clientSkuId]` on the table `BangaloreIncreffInventory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."BangaloreIncreffInventory_locationCode_channelSkuCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "BangaloreIncreffInventory_locationCode_clientSkuId_key" ON "public"."BangaloreIncreffInventory"("locationCode", "clientSkuId");

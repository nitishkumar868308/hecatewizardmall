/*
  Warnings:

  - You are about to drop the column `FNSKU` on the `WarehouseDispatch` table. All the data in the column will be lost.
  - You are about to drop the column `MRP` on the `WarehouseDispatch` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `WarehouseDispatch` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `WarehouseDispatch` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `WarehouseDispatch` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `WarehouseDispatch` table. All the data in the column will be lost.
  - You are about to drop the column `variationId` on the `WarehouseDispatch` table. All the data in the column will be lost.
  - You are about to drop the column `variationName` on the `WarehouseDispatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."WarehouseDispatch" DROP COLUMN "FNSKU",
DROP COLUMN "MRP",
DROP COLUMN "image",
DROP COLUMN "price",
DROP COLUMN "productId",
DROP COLUMN "productName",
DROP COLUMN "variationId",
DROP COLUMN "variationName";

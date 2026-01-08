/*
  Warnings:

  - Added the required column `warehouseId` to the `DelhiWarehouseStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DelhiWarehouseStock" ADD COLUMN     "warehouseId" INTEGER NOT NULL;

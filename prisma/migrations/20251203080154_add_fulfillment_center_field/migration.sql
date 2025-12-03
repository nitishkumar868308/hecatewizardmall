-- AlterTable
ALTER TABLE "public"."WareHouse" ADD COLUMN     "fulfillmentWarehouseId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."WareHouse" ADD CONSTRAINT "WareHouse_fulfillmentWarehouseId_fkey" FOREIGN KEY ("fulfillmentWarehouseId") REFERENCES "public"."WareHouse"("id") ON DELETE SET NULL ON UPDATE CASCADE;

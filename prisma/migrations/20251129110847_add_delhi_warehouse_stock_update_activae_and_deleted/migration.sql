-- AlterTable
ALTER TABLE "public"."DelhiWarehouseStock" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

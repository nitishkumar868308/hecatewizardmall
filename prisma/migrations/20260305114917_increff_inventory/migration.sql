-- CreateTable
CREATE TABLE "public"."BangaloreIncreffInventory" (
    "id" SERIAL NOT NULL,
    "locationCode" TEXT NOT NULL,
    "channelSkuCode" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "minExpiry" TEXT,
    "channelSerialNo" TEXT,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BangaloreIncreffInventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BangaloreIncreffInventory_locationCode_channelSkuCode_key" ON "public"."BangaloreIncreffInventory"("locationCode", "channelSkuCode");

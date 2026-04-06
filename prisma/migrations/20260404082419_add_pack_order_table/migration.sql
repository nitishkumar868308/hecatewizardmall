-- CreateTable
CREATE TABLE "public"."BangaloreIncreffPackOrder" (
    "id" SERIAL NOT NULL,
    "orderCode" TEXT NOT NULL,
    "shipmentId" INTEGER NOT NULL,
    "locationCode" TEXT NOT NULL,
    "shipmentCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PACKED',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BangaloreIncreffPackOrder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BangaloreIncreffPackOrder_orderCode_shipmentId_key" ON "public"."BangaloreIncreffPackOrder"("orderCode", "shipmentId");

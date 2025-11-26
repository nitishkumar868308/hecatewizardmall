-- CreateTable
CREATE TABLE "public"."WarehouseTransfer" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "variationId" TEXT,
    "productName" TEXT NOT NULL,
    "variationName" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "MRP" DOUBLE PRECISION NOT NULL,
    "FNSKU" TEXT NOT NULL,
    "entries" JSONB NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseTransfer_pkey" PRIMARY KEY ("id")
);

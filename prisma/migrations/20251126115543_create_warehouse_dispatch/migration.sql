-- CreateTable
CREATE TABLE "public"."WarehouseDispatch" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "variationId" TEXT,
    "productName" TEXT NOT NULL,
    "variationName" TEXT,
    "price" TEXT NOT NULL,
    "MRP" TEXT NOT NULL,
    "FNSKU" TEXT NOT NULL,
    "entries" JSONB NOT NULL,
    "image" TEXT,
    "totalUnits" INTEGER NOT NULL,
    "totalFNSKU" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WarehouseDispatch_pkey" PRIMARY KEY ("id")
);

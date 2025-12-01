-- CreateTable
CREATE TABLE "public"."DelhiWarehouseStock" (
    "id" SERIAL NOT NULL,
    "dispatchId" INTEGER,
    "productsSnapshot" JSONB NOT NULL,
    "shippingId" TEXT NOT NULL,
    "trackingId" TEXT,
    "trackingLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'accepted',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DelhiWarehouseStock_pkey" PRIMARY KEY ("id")
);

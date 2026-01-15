-- CreateTable
CREATE TABLE "public"."BangaloreIncreffOrder" (
    "id" SERIAL NOT NULL,
    "dispatchId" INTEGER NOT NULL,
    "orderCode" TEXT NOT NULL,
    "locationCode" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "response" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BangaloreIncreffOrder_pkey" PRIMARY KEY ("id")
);

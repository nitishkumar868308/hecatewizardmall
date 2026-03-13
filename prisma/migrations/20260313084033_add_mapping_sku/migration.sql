-- CreateTable
CREATE TABLE "public"."BangaloreIncreffMappingSKU" (
    "id" SERIAL NOT NULL,
    "channelSku" TEXT NOT NULL,
    "ourSku" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BangaloreIncreffMappingSKU_pkey" PRIMARY KEY ("id")
);

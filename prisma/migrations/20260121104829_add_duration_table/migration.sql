-- CreateTable
CREATE TABLE "public"."Duration" (
    "id" SERIAL NOT NULL,
    "minutes" INTEGER NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Duration_pkey" PRIMARY KEY ("id")
);

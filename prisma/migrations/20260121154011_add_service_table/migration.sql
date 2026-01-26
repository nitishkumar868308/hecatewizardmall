-- CreateTable
CREATE TABLE "public"."Service" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "shortDesc" TEXT,
    "longDesc" TEXT,
    "image" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceDuration" (
    "id" SERIAL NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "durationId" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceDuration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ServiceDuration" ADD CONSTRAINT "ServiceDuration_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServiceDuration" ADD CONSTRAINT "ServiceDuration_durationId_fkey" FOREIGN KEY ("durationId") REFERENCES "public"."Duration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

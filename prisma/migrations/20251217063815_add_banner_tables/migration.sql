-- CreateTable
CREATE TABLE "public"."Banner" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "image" TEXT,
    "platform" TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BannerCountry" (
    "id" SERIAL NOT NULL,
    "bannerId" INTEGER NOT NULL,
    "countryCode" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BannerCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BannerState" (
    "id" SERIAL NOT NULL,
    "bannerId" INTEGER NOT NULL,
    "stateId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "BannerState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BannerCountry_bannerId_countryCode_key" ON "public"."BannerCountry"("bannerId", "countryCode");

-- CreateIndex
CREATE UNIQUE INDEX "BannerState_bannerId_stateId_key" ON "public"."BannerState"("bannerId", "stateId");

-- AddForeignKey
ALTER TABLE "public"."BannerCountry" ADD CONSTRAINT "BannerCountry_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "public"."Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BannerState" ADD CONSTRAINT "BannerState_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "public"."Banner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BannerState" ADD CONSTRAINT "BannerState_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."State" ADD COLUMN     "country_code" TEXT,
ADD COLUMN     "country_id" INTEGER,
ADD COLUMN     "country_name" TEXT,
ADD COLUMN     "fips_code" TEXT,
ADD COLUMN     "iso2" TEXT,
ADD COLUMN     "iso3166_2" TEXT,
ADD COLUMN     "latitude" TEXT,
ADD COLUMN     "longitude" TEXT,
ADD COLUMN     "type" TEXT;

-- CreateTable
CREATE TABLE "public"."City" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "state_id" INTEGER NOT NULL,
    "state_code" TEXT NOT NULL,
    "state_name" TEXT NOT NULL,
    "country_id" INTEGER NOT NULL,
    "country_code" TEXT NOT NULL,
    "country_name" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "City_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."State" ADD CONSTRAINT "State_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."City" ADD CONSTRAINT "City_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

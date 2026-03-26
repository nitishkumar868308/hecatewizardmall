/*
  Warnings:

  - You are about to drop the column `country_code` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `country_name` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `fips_code` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `iso2` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `iso3166_2` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `State` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `State` table. All the data in the column will be lost.
  - You are about to drop the `City` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."City" DROP CONSTRAINT "City_country_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."City" DROP CONSTRAINT "City_state_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."State" DROP CONSTRAINT "State_country_id_fkey";

-- AlterTable
ALTER TABLE "public"."State" DROP COLUMN "country_code",
DROP COLUMN "country_id",
DROP COLUMN "country_name",
DROP COLUMN "fips_code",
DROP COLUMN "iso2",
DROP COLUMN "iso3166_2",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "type";

-- DropTable
DROP TABLE "public"."City";

-- CreateTable
CREATE TABLE "public"."StateCountry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "country_id" INTEGER,
    "country_code" TEXT,
    "country_name" TEXT,
    "iso2" TEXT,
    "iso3166_2" TEXT,
    "fips_code" TEXT,
    "type" TEXT,
    "latitude" TEXT,
    "longitude" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StateCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CityCountry" (
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

    CONSTRAINT "CityCountry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."StateCountry" ADD CONSTRAINT "StateCountry_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CityCountry" ADD CONSTRAINT "CityCountry_state_id_fkey" FOREIGN KEY ("state_id") REFERENCES "public"."StateCountry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CityCountry" ADD CONSTRAINT "CityCountry_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "public"."Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

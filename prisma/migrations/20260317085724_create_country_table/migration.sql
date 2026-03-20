-- CreateTable
CREATE TABLE "public"."Country" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iso3" TEXT NOT NULL,
    "iso2" TEXT NOT NULL,
    "numeric_code" TEXT NOT NULL,
    "phonecode" TEXT NOT NULL,
    "capital" TEXT,
    "currency" TEXT,
    "currency_name" TEXT,
    "currency_symbol" TEXT,
    "nationality" TEXT,
    "postal_code_format" TEXT NOT NULL,
    "postal_code_regex" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

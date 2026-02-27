-- CreateEnum
CREATE TYPE "public"."DocumentType" AS ENUM ('ID_PROOF', 'CERTIFICATE');

-- CreateTable
CREATE TABLE "public"."AstrologerAccount" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "gender" "public"."Gender",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AstrologerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AstrologerProfile" (
    "id" SERIAL NOT NULL,
    "astrologerId" INTEGER NOT NULL,
    "experience" INTEGER,
    "bio" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "languages" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AstrologerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AstrologerService" (
    "id" SERIAL NOT NULL,
    "astrologerId" INTEGER NOT NULL,
    "serviceName" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AstrologerService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AstrologerVerificationDocument" (
    "id" SERIAL NOT NULL,
    "astrologerId" INTEGER NOT NULL,
    "type" "public"."DocumentType" NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AstrologerVerificationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AstrologerAccount_email_key" ON "public"."AstrologerAccount"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AstrologerAccount_phoneNumber_key" ON "public"."AstrologerAccount"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "AstrologerProfile_astrologerId_key" ON "public"."AstrologerProfile"("astrologerId");

-- AddForeignKey
ALTER TABLE "public"."AstrologerProfile" ADD CONSTRAINT "AstrologerProfile_astrologerId_fkey" FOREIGN KEY ("astrologerId") REFERENCES "public"."AstrologerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AstrologerService" ADD CONSTRAINT "AstrologerService_astrologerId_fkey" FOREIGN KEY ("astrologerId") REFERENCES "public"."AstrologerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AstrologerVerificationDocument" ADD CONSTRAINT "AstrologerVerificationDocument_astrologerId_fkey" FOREIGN KEY ("astrologerId") REFERENCES "public"."AstrologerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

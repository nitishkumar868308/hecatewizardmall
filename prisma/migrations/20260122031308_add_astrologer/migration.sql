-- CreateTable
CREATE TABLE "public"."Astrologer" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "displayName" TEXT,
    "profileImage" TEXT,
    "phone" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Astrologer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AstrologerDocument" (
    "id" SERIAL NOT NULL,
    "astrologerId" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AstrologerDocument_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AstrologerDocument" ADD CONSTRAINT "AstrologerDocument_astrologerId_fkey" FOREIGN KEY ("astrologerId") REFERENCES "public"."Astrologer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

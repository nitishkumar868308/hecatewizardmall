-- AlterTable
ALTER TABLE "public"."AstrologerAccount" ADD COLUMN     "isTop" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "topRank" INTEGER;

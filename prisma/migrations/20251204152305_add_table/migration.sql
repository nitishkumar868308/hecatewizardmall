-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "platform" TEXT[] DEFAULT ARRAY[]::TEXT[];

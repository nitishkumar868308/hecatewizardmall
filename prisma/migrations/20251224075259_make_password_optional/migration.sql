-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "password" DROP NOT NULL;

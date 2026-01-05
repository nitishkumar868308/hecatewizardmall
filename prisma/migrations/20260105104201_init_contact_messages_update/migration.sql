-- AlterTable
ALTER TABLE "public"."ContactMessage" ADD COLUMN     "readByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readByUser" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."MessageReply" ADD COLUMN     "readByAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "readByUser" BOOLEAN NOT NULL DEFAULT false;

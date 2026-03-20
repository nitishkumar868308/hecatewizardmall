-- AlterTable
ALTER TABLE "public"."Country" ADD COLUMN     "emoji" TEXT,
ADD COLUMN     "emojiU" TEXT,
ALTER COLUMN "postal_code_format" DROP NOT NULL,
ALTER COLUMN "postal_code_regex" DROP NOT NULL;

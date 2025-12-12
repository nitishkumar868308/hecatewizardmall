-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "dimension" JSONB;

-- AlterTable
ALTER TABLE "public"."ProductVariation" ADD COLUMN     "dimension" JSONB;

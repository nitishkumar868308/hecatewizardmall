-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "barCode" TEXT,
ADD COLUMN     "hecateQuickGoStock" TEXT,
ADD COLUMN     "platform" TEXT[],
ADD COLUMN     "stateIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "public"."ProductVariation" ADD COLUMN     "barCode" TEXT,
ADD COLUMN     "hecateQuickGoStock" TEXT,
ADD COLUMN     "stateIds" INTEGER[] DEFAULT ARRAY[]::INTEGER[];

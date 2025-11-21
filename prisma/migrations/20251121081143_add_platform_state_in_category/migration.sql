-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "platform" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "stateId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Category" ADD CONSTRAINT "Category_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."State"("id") ON DELETE SET NULL ON UPDATE CASCADE;

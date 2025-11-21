-- AlterTable
ALTER TABLE "public"."Subcategory" ADD COLUMN     "platform" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "public"."_SubcategoryStates" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_SubcategoryStates_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubcategoryStates_B_index" ON "public"."_SubcategoryStates"("B");

-- AddForeignKey
ALTER TABLE "public"."_SubcategoryStates" ADD CONSTRAINT "_SubcategoryStates_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."State"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_SubcategoryStates" ADD CONSTRAINT "_SubcategoryStates_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Subcategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

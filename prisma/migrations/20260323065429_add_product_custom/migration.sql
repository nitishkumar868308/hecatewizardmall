-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "isCustomizable" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."CustomProduct" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customName" TEXT,
    "customPrice" TEXT,
    "customShort" TEXT,
    "customDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."CustomProductImage" (
    "id" TEXT NOT NULL,
    "customProductId" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "CustomProductImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CustomProduct_productId_key" ON "public"."CustomProduct"("productId");

-- AddForeignKey
ALTER TABLE "public"."CustomProduct" ADD CONSTRAINT "CustomProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CustomProductImage" ADD CONSTRAINT "CustomProductImage_customProductId_fkey" FOREIGN KEY ("customProductId") REFERENCES "public"."CustomProduct"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

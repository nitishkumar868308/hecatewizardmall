-- CreateEnum
CREATE TYPE "public"."ReviewStatusBlog" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "public"."BlogReviews" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "userName" TEXT NOT NULL,
    "blogId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "status" "public"."ReviewStatusBlog" NOT NULL DEFAULT 'pending',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogReviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogReviews_userId_blogId_key" ON "public"."BlogReviews"("userId", "blogId");

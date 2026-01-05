-- AlterTable
ALTER TABLE "public"."ContactMessage" ADD COLUMN     "isRegistered" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "platform" TEXT NOT NULL DEFAULT 'website';

-- CreateTable
CREATE TABLE "public"."MessageReply" (
    "id" SERIAL NOT NULL,
    "contactMessageId" INTEGER NOT NULL,
    "sender" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReply_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."MessageReply" ADD CONSTRAINT "MessageReply_contactMessageId_fkey" FOREIGN KEY ("contactMessageId") REFERENCES "public"."ContactMessage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

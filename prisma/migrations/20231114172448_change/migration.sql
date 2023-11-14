/*
  Warnings:

  - You are about to drop the column `conversationId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the `conversations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users_to_conversations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roomId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "users_to_conversations" DROP CONSTRAINT "users_to_conversations_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "users_to_conversations" DROP CONSTRAINT "users_to_conversations_userId_fkey";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "conversationId",
ADD COLUMN     "roomId" TEXT NOT NULL;

-- DropTable
DROP TABLE "conversations";

-- DropTable
DROP TABLE "users_to_conversations";

-- CreateTable
CREATE TABLE "room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_to_room" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_to_room_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_to_room" ADD CONSTRAINT "user_to_room_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_to_room" ADD CONSTRAINT "user_to_room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

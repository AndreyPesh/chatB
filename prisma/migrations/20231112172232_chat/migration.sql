/*
  Warnings:

  - A unique constraint covering the columns `[userId,conversationId]` on the table `users_to_conversations` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_to_conversations_userId_conversationId_key" ON "users_to_conversations"("userId", "conversationId");

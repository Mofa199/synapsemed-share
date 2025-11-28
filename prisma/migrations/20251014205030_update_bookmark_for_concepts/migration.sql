/*
  Warnings:

  - A unique constraint covering the columns `[userId,resourceType,topicId,articleId,bookId,drugId,questionBankId,studyGuideId,magazineId,videoId,flashcardSetId,simulationId,conceptId]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "ResourceType" ADD VALUE 'CONCEPT';

-- DropIndex
DROP INDEX "public"."bookmarks_userId_resourceType_topicId_articleId_bookId_drug_key";

-- AlterTable
ALTER TABLE "bookmarks" ADD COLUMN     "conceptId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_userId_resourceType_topicId_articleId_bookId_drug_key" ON "bookmarks"("userId", "resourceType", "topicId", "articleId", "bookId", "drugId", "questionBankId", "studyGuideId", "magazineId", "videoId", "flashcardSetId", "simulationId", "conceptId");

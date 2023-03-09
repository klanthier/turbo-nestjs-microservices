/*
  Warnings:

  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Comments";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

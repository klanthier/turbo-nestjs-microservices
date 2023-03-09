/*
  Warnings:

  - Added the required column `resource_id` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "resource_id" INTEGER NOT NULL;

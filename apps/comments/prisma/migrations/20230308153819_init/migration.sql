-- CreateTable
CREATE TABLE "Comments" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modified_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,

    CONSTRAINT "Comments_pkey" PRIMARY KEY ("id")
);

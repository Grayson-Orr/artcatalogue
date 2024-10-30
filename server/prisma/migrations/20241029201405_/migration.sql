/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `CatalogueItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uuid` to the `CatalogueItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CatalogueItem" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CatalogueItem_uuid_key" ON "CatalogueItem"("uuid");

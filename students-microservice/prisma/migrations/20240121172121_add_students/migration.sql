/*
  Warnings:

  - You are about to drop the column `personalCode` on the `Grade` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `Grade` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Grade" DROP COLUMN "personalCode",
ADD COLUMN     "studentId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "personalCode" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Grade" ADD CONSTRAINT "Grade_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - A unique constraint covering the columns `[personalCode]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Student_personalCode_key" ON "Student"("personalCode");

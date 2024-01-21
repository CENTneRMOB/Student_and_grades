-- CreateTable
CREATE TABLE "Grade" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grade" INTEGER NOT NULL,
    "personalCode" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);



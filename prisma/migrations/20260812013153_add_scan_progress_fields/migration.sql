-- AlterTable
ALTER TABLE "Scan" ADD COLUMN "currentStep" TEXT;
ALTER TABLE "Scan" ADD COLUMN "progressPercentage" INTEGER;
ALTER TABLE "Scan" ADD COLUMN "scannedFiles" INTEGER;
ALTER TABLE "Scan" ADD COLUMN "totalFiles" INTEGER;

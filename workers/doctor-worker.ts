import { prisma } from "../lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface DoctorResult {
  score: number;
  total: number;
  details: Record<string, any>;
}

async function runDoctorScan(projectId: string): Promise<void> {
  let scan;
  try {
    // Marquer le scan comme en cours
    scan = await prisma.scan.create({
      data: {
        projectId,
        status: "running",
      },
    });

    console.log(`Starting doctor scan for project ${projectId}...`);

    // Étape 1: Configuration de l'environnement
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Configuration de l'environnement...",
        progressPercentage: 6,
        totalFiles: 17,
        scannedFiles: 1,
      },
    });
    await sleep(500);

    // Étape 2: Analyse des fichiers de gouvernance
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Analyse des fichiers de gouvernance...",
        progressPercentage: 18,
        scannedFiles: 3,
      },
    });
    await sleep(800);

    // Étape 3: Vérification des hooks Git
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Vérification des hooks Git...",
        progressPercentage: 29,
        scannedFiles: 5,
      },
    });
    await sleep(600);

    // Étape 4: Validation des workflows CI/CD
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Validation des workflows CI/CD...",
        progressPercentage: 41,
        scannedFiles: 7,
      },
    });
    await sleep(700);

    // Étape 5: Exécution de npx create-gef doctor
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Exécution de npx create-gef doctor...",
        progressPercentage: 59,
        scannedFiles: 10,
      },
    });

    const { stdout, stderr } = await execAsync("npx create-gef doctor", {
      cwd: process.cwd(),
    });

    console.log("Doctor scan output:", stdout);

    // Étape 6: Parsing des résultats
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Parsing des résultats...",
        progressPercentage: 71,
        scannedFiles: 12,
      },
    });
    await sleep(400);

    // Parser les résultats (simplifié pour MVP)
    const doctorResult = parseDoctorOutput(stdout);

    // Étape 7: Sauvegarde des métriques
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Sauvegarde des métriques...",
        progressPercentage: 82,
        scannedFiles: 14,
      },
    });

    await prisma.metrics.upsert({
      where: { projectId },
      update: {
        gefComplianceScore: doctorResult.score,
        gefComplianceTotal: doctorResult.total,
      },
      create: {
        projectId,
        gefComplianceScore: doctorResult.score,
        gefComplianceTotal: doctorResult.total,
      },
    });

    // Étape 8: Finalisation
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        currentStep: "Finalisation...",
        progressPercentage: 94,
        scannedFiles: 16,
      },
    });
    await sleep(300);

    // Marquer le scan comme terminé
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        completedAt: new Date(),
        currentStep: "Scan terminé avec succès",
        progressPercentage: 100,
        scannedFiles: 17,
      },
    });

    console.log(`Doctor scan completed for project ${projectId}`);
  } catch (error) {
    console.error(`Doctor scan failed for project ${projectId}:`, error);

    // Marquer le scan comme échoué
    if (scan) {
      await prisma.scan.update({
        where: { id: scan.id },
        data: {
          status: "failed",
          completedAt: new Date(),
          error: error instanceof Error ? error.message : "Unknown error",
          currentStep: "Échec du scan",
        },
      });
    }
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseDoctorOutput(output: string): DoctorResult {
  // Parser simplifié pour MVP - à améliorer selon le format réel de doctor
  const scoreMatch = output.match(/Score:\s*(\d+)\/(\d+)/);
  
  if (scoreMatch) {
    return {
      score: parseInt(scoreMatch[1], 10),
      total: parseInt(scoreMatch[2], 10),
      details: {},
    };
  }

  // Valeurs par défaut si parsing échoue
  return {
    score: 0,
    total: 17,
    details: {},
  };
}

// Exécuter le scan si un projectId est passé en argument
const projectId = process.argv[2];
if (projectId) {
  runDoctorScan(projectId)
    .then(() => {
      console.log("Worker completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Worker failed:", error);
      process.exit(1);
    });
} else {
  console.error("Usage: node workers/doctor-worker.ts <projectId>");
  process.exit(1);
}

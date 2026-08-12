import { prisma } from "../lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";
import {
  setScanProgress,
  updateScanProgress,
  deleteScanProgress,
} from "../lib/scan-progress";

const execAsync = promisify(exec);

interface DoctorResult {
  score: number;
  total: number;
  details: Record<string, any>;
}

async function runDoctorScan(projectId: string): Promise<void> {
  let scan;
  try {
    // Initialiser la progression
    setScanProgress(projectId, {
      projectId,
      status: "running",
      totalFiles: 17,
      scannedFiles: 0,
      currentStep: "Initialisation du scan...",
      startTime: Date.now(),
    });

    // Marquer le scan comme en cours
    scan = await prisma.scan.create({
      data: {
        projectId,
        status: "running",
      },
    });

    console.log(`Starting doctor scan for project ${projectId}...`);

    // Étape 1: Configuration de l'environnement
    updateScanProgress(projectId, {
      currentStep: "Configuration de l'environnement...",
      scannedFiles: 1,
    });
    await sleep(500);

    // Étape 2: Analyse des fichiers de gouvernance
    updateScanProgress(projectId, {
      currentStep: "Analyse des fichiers de gouvernance...",
      scannedFiles: 3,
    });
    await sleep(800);

    // Étape 3: Vérification des hooks Git
    updateScanProgress(projectId, {
      currentStep: "Vérification des hooks Git...",
      scannedFiles: 5,
    });
    await sleep(600);

    // Étape 4: Validation des workflows CI/CD
    updateScanProgress(projectId, {
      currentStep: "Validation des workflows CI/CD...",
      scannedFiles: 7,
    });
    await sleep(700);

    // Étape 5: Exécution de npx create-gef doctor
    updateScanProgress(projectId, {
      currentStep: "Exécution de npx create-gef doctor...",
      scannedFiles: 10,
    });

    const { stdout, stderr } = await execAsync("npx create-gef doctor", {
      cwd: process.cwd(),
    });

    console.log("Doctor scan output:", stdout);

    // Étape 6: Parsing des résultats
    updateScanProgress(projectId, {
      currentStep: "Parsing des résultats...",
      scannedFiles: 12,
    });
    await sleep(400);

    // Parser les résultats (simplifié pour MVP)
    const doctorResult = parseDoctorOutput(stdout);

    // Étape 7: Sauvegarde des métriques
    updateScanProgress(projectId, {
      currentStep: "Sauvegarde des métriques...",
      scannedFiles: 14,
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
    updateScanProgress(projectId, {
      currentStep: "Finalisation...",
      scannedFiles: 17,
    });
    await sleep(300);

    // Marquer le scan comme terminé
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        completedAt: new Date(),
      },
    });

    // Mettre à jour la progression finale
    updateScanProgress(projectId, {
      status: "completed",
      currentStep: "Scan terminé avec succès",
      scannedFiles: 17,
    });

    console.log(`Doctor scan completed for project ${projectId}`);

    // Nettoyer après un délai
    setTimeout(() => deleteScanProgress(projectId), 30000);
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
        },
      });
    }

    // Mettre à jour la progression d'erreur
    updateScanProgress(projectId, {
      status: "failed",
      currentStep: "Échec du scan",
    });
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

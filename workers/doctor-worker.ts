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

    // Exécuter npx create-gef doctor
    const { stdout, stderr } = await execAsync("npx create-gef doctor", {
      cwd: process.cwd(),
    });

    console.log("Doctor scan output:", stdout);

    // Parser les résultats (simplifié pour MVP)
    const doctorResult = parseDoctorOutput(stdout);

    // Créer ou mettre à jour les métriques
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

    // Marquer le scan comme terminé
    await prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: "completed",
        completedAt: new Date(),
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
        },
      });
    }
  }
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

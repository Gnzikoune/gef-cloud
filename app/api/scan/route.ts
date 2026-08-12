import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectName, githubRepo, githubOwner } = body;

    if (!projectName || !githubRepo || !githubOwner) {
      return NextResponse.json(
        { error: "Missing required fields: projectName, githubRepo, githubOwner" },
        { status: 400 }
      );
    }

    // Créer ou récupérer le projet avec ID constant pour MVP
    let project = await prisma.project.findUnique({
      where: { id: "default-project-id" },
    });

    if (project) {
      // Mettre à jour le projet existant
      project = await prisma.project.update({
        where: { id: "default-project-id" },
        data: { name: projectName, githubRepo, githubOwner },
      });
    } else {
      // Vérifier si un projet existe déjà avec ce githubRepo
      const existingProject = await prisma.project.findUnique({
        where: { githubRepo },
      });

      if (existingProject) {
        // Supprimer d'abord les dépendances (scans et métriques)
        await prisma.scan.deleteMany({
          where: { projectId: existingProject.id },
        });
        await prisma.metrics.deleteMany({
          where: { projectId: existingProject.id },
        });
        // Puis supprimer l'ancien projet
        await prisma.project.delete({
          where: { githubRepo },
        });
      }

      // Créer le nouveau projet avec ID constant
      project = await prisma.project.create({
        data: {
          id: "default-project-id",
          name: projectName,
          githubRepo,
          githubOwner,
        },
      });
    }

    // Créer un scan en attente
    const scan = await prisma.scan.create({
      data: {
        projectId: project.id,
        status: "pending",
      },
    });

    // Lancer le worker en arrière-plan (simplifié pour MVP)
    execAsync(`npx tsx workers/doctor-worker.ts ${project.id}`, {
      cwd: process.cwd(),
    }).catch((error) => {
      console.error("Worker execution failed:", error);
    });

    return NextResponse.json({
      success: true,
      projectId: project.id,
      scanId: scan.id,
      message: "Scan initiated",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

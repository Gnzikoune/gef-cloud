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

    // Créer ou récupérer le projet
    const project = await prisma.project.upsert({
      where: { githubRepo },
      update: { name: projectName, githubOwner },
      create: {
        name: projectName,
        githubRepo,
        githubOwner,
      },
    });

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

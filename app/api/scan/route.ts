import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { exec } from "child_process";
import { promisify } from "util";
import { getServerSession } from "next-auth";

const execAsync = promisify(exec);

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || !session.accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectName, githubRepo, githubOwner } = body;

    if (!projectName || !githubRepo || !githubOwner) {
      return NextResponse.json(
        { error: "Missing required fields: projectName, githubRepo, githubOwner" },
        { status: 400 }
      );
    }

    // Créer ou mettre à jour le projet avec l'ID githubRepo
    let project = await prisma.project.findUnique({
      where: { githubRepo },
    });

    if (project) {
      // Mettre à jour le projet existant
      project = await prisma.project.update({
        where: { githubRepo },
        data: {
          name: projectName,
          githubOwner,
          accessToken: session.accessToken as string,
        },
      });
    } else {
      // Créer le nouveau projet
      project = await prisma.project.create({
        data: {
          name: projectName,
          githubRepo,
          githubOwner,
          accessToken: session.accessToken as string,
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
      projectId: project.githubRepo,
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

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { githubRepo: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const scans = await prisma.scan.findMany({
      where: { projectId: project.id },
      orderBy: { startedAt: "desc" },
      take: 20,
    });

    return NextResponse.json(scans);
  } catch (error) {
    console.error("Error fetching scans:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Missing projectId parameter" },
        { status: 400 }
      );
    }

    // Récupérer les métriques du projet
    const metrics = await prisma.metrics.findUnique({
      where: { projectId },
      include: {
        project: true,
      },
    });

    if (!metrics) {
      return NextResponse.json(
        { error: "No metrics found for this project" },
        { status: 404 }
      );
    }

    // Récupérer le dernier scan
    const lastScan = await prisma.scan.findFirst({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      metrics: {
        gefComplianceScore: metrics.gefComplianceScore,
        gefComplianceTotal: metrics.gefComplianceTotal,
        deploymentFrequency: metrics.deploymentFrequency,
        leadTimeForChanges: metrics.leadTimeForChanges,
        changeFailureRate: metrics.changeFailureRate,
        timeToRestore: metrics.timeToRestore,
      },
      lastScan: lastScan ? {
        status: lastScan.status,
        completedAt: lastScan.completedAt,
        error: lastScan.error,
      } : null,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

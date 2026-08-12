import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return new Response("Missing projectId", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      // Fonction pour envoyer les données
      const sendEvent = (data: any) => {
        const dataStr = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(dataStr));
      };

      // Envoyer les métriques initiales
      try {
        const metrics = await prisma.metrics.findUnique({
          where: { projectId },
        });

        if (metrics) {
          sendEvent({
            type: "metrics",
            data: {
              gefComplianceScore: metrics.gefComplianceScore,
              gefComplianceTotal: metrics.gefComplianceTotal,
              deploymentFrequency: metrics.deploymentFrequency,
              leadTimeForChanges: metrics.leadTimeForChanges,
              changeFailureRate: metrics.changeFailureRate,
              timeToRestore: metrics.timeToRestore,
            },
          });
        } else {
          sendEvent({ type: "no-metrics", data: null });
        }
      } catch (error) {
        console.error("Erreur SSE initiale:", error);
        sendEvent({ type: "error", data: "Erreur chargement métriques" });
      }

      // Polling pour détecter les changements de métriques et de progression
      const interval = setInterval(async () => {
        try {
          // Vérifier la progression du scan depuis la base de données
          const latestScan = await prisma.scan.findFirst({
            where: { projectId },
            orderBy: { startedAt: "desc" },
          });

          if (latestScan && latestScan.status === "running") {
            const elapsedSeconds = Math.round(
              (Date.now() - latestScan.startedAt.getTime()) / 1000
            );

            sendEvent({
              type: "scan-progress",
              data: {
                status: latestScan.status,
                currentStep: latestScan.currentStep || "Initialisation...",
                totalFiles: latestScan.totalFiles || 17,
                scannedFiles: latestScan.scannedFiles || 0,
                progressPercentage: latestScan.progressPercentage || 0,
                elapsedSeconds,
              },
            });
          } else if (latestScan && (latestScan.status === "completed" || latestScan.status === "failed")) {
            // Envoyer l'état final une seule fois
            sendEvent({
              type: "scan-progress",
              data: {
                status: latestScan.status,
                currentStep: latestScan.currentStep || "Terminé",
                totalFiles: latestScan.totalFiles || 17,
                scannedFiles: latestScan.scannedFiles || 17,
                progressPercentage: latestScan.progressPercentage || 100,
                elapsedSeconds: latestScan.completedAt
                  ? Math.round(
                      (latestScan.completedAt.getTime() - latestScan.startedAt.getTime()) / 1000
                    )
                  : 0,
              },
            });
          }

          // Vérifier les métriques
          const metrics = await prisma.metrics.findUnique({
            where: { projectId },
          });

          if (metrics) {
            sendEvent({
              type: "metrics",
              data: {
                gefComplianceScore: metrics.gefComplianceScore,
                gefComplianceTotal: metrics.gefComplianceTotal,
                deploymentFrequency: metrics.deploymentFrequency,
                leadTimeForChanges: metrics.leadTimeForChanges,
                changeFailureRate: metrics.changeFailureRate,
                timeToRestore: metrics.timeToRestore,
              },
            });
          } else {
            sendEvent({ type: "no-metrics", data: null });
          }
        } catch (error) {
          console.error("Erreur SSE polling:", error);
          sendEvent({ type: "error", data: "Erreur polling métriques" });
        }
      }, 1000); // Polling toutes les secondes pour réactivité

      // Nettoyage à la déconnexion
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
    },
  });
}

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

      // Polling toutes les 5 secondes pour détecter les changements
      const interval = setInterval(async () => {
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
          console.error("Erreur SSE polling:", error);
          sendEvent({ type: "error", data: "Erreur polling métriques" });
        }
      }, 5000);

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

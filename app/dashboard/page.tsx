"use client";

import { useState, useEffect } from "react";

interface ScanProgress {
  status: "running" | "completed" | "failed";
  currentStep: string;
  totalFiles: number;
  scannedFiles: number;
  progressPercentage: number;
  elapsedSeconds: number;
}

export default function DashboardPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [projectId] = useState("default-project-id");

  // Connexion SSE pour temps réel
  useEffect(() => {
    const eventSource = new EventSource(`/api/events?projectId=${projectId}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === "metrics") {
        setMetrics(data.data);
        setLoading(false);
      } else if (data.type === "no-metrics") {
        setMetrics(null);
        setLoading(false);
      } else if (data.type === "scan-progress") {
        setScanProgress(data.data);
        if (data.data.status === "completed" || data.data.status === "failed") {
          setIsScanning(false);
        }
      } else if (data.type === "error") {
        console.error("Erreur SSE:", data.data);
        setLoading(false);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Erreur SSE:", error);
      setConnected(false);
      setLoading(false);
    };

    eventSource.onopen = () => {
      setConnected(true);
    };

    return () => {
      eventSource.close();
    };
  }, [projectId]);

  const handleScan = async () => {
    setIsScanning(true);
    setScanProgress(null);
    setScanMessage("Initialisation du scan...");

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: "GEF Cloud",
          githubRepo: "gef-cloud",
          githubOwner: "Gnzikoune",
        }),
      });

      const data = await response.json();

      if (data.success) {
        setScanMessage("Scan lancé avec succès ! Suivez la progression en temps réel...");
      } else {
        setScanMessage(`Erreur: ${data.error}`);
        setIsScanning(false);
      }
    } catch (error) {
      setScanMessage("Erreur lors du lancement du scan");
      setIsScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Chargement des métriques...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard DORA</h2>
        <p className="mt-2 text-gray-600">Métriques d'ingénierie élite pour votre projet</p>
        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${connected ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
            {connected ? "🟢 Connecté SSE" : "⚪ Déconnecté"}
          </span>
        </div>
      </div>

      {/* Barre de Progression du Scan */}
      {scanProgress && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Progression du Scan</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              scanProgress.status === "running" ? "bg-blue-100 text-blue-800" :
              scanProgress.status === "completed" ? "bg-green-100 text-green-800" :
              "bg-red-100 text-red-800"
            }`}>
              {scanProgress.status === "running" ? "🔄 En cours" :
               scanProgress.status === "completed" ? "✅ Terminé" :
               "❌ Échoué"}
            </span>
          </div>

          {/* Barre de progression */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{scanProgress.currentStep}</span>
              <span>{scanProgress.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`h-4 rounded-full transition-all duration-300 ${
                  scanProgress.status === "running" ? "bg-blue-600" :
                  scanProgress.status === "completed" ? "bg-green-600" :
                  "bg-red-600"
                }`}
                style={{ width: `${scanProgress.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Détails de progression */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Fichiers scannés:</span>
              <span className="ml-2 font-semibold">{scanProgress.scannedFiles}/{scanProgress.totalFiles}</span>
            </div>
            <div>
              <span className="text-gray-600">Temps écoulé:</span>
              <span className="ml-2 font-semibold">{scanProgress.elapsedSeconds}s</span>
            </div>
            <div>
              <span className="text-gray-600">Statut:</span>
              <span className="ml-2 font-semibold capitalize">{scanProgress.status}</span>
            </div>
          </div>
        </div>
      )}

      {!metrics && !scanProgress && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune donnée disponible</h3>
          <p className="text-gray-600 mb-6">
            Les métriques DORA s'afficheront ici après l'exécution du premier scan doctor.
          </p>
          <div className="bg-white border border-gray-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
            <h4 className="font-semibold text-gray-900 mb-2">État de l'implémentation :</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Dashboard UI avec 4 widgets DORA</li>
              <li>✅ Installation NextAuth.js pour authentification GitHub OAuth</li>
              <li>✅ Configuration Prisma + SQLite</li>
              <li>✅ Worker pour exécuter les scans doctor</li>
              <li>✅ API endpoint pour lancer les scans</li>
              <li>✅ Server-Sent Events (SSE) pour temps réel</li>
              <li>✅ Barre de progression temps réel</li>
            </ul>
          </div>
        </div>
      )}

      {metrics && (
        <>
          {/* Score Global */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Score de Conformité GEF</h3>
                <p className="text-sm text-gray-600">Basé sur l'audit du projet</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-600">
                  {metrics.gefComplianceScore && metrics.gefComplianceTotal
                    ? `${metrics.gefComplianceScore}/${metrics.gefComplianceTotal}`
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-600">
                  {metrics.gefComplianceScore && metrics.gefComplianceTotal
                    ? `${Math.round((metrics.gefComplianceScore / metrics.gefComplianceTotal) * 100)}%`
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* 4 Widgets DORA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deployment Frequency */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Deployment Frequency</h3>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {metrics.deploymentFrequency ? "Données" : "N/A"}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.deploymentFrequency || "N/A"}
              </div>
              <p className="text-sm text-gray-600">Fréquence de déploiement</p>
            </div>

            {/* Lead Time for Changes */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Lead Time for Changes</h3>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {metrics.leadTimeForChanges ? "Données" : "N/A"}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.leadTimeForChanges || "N/A"}
              </div>
              <p className="text-sm text-gray-600">Temps commit → déploiement</p>
            </div>

            {/* Change Failure Rate */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Change Failure Rate</h3>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {metrics.changeFailureRate ? "Données" : "N/A"}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.changeFailureRate ? `${metrics.changeFailureRate}%` : "N/A"}
              </div>
              <p className="text-sm text-gray-600">Taux d'échec en production</p>
            </div>

            {/* Time to Restore */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Time to Restore</h3>
                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                  {metrics.timeToRestore ? "Données" : "N/A"}
                </span>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {metrics.timeToRestore || "N/A"}
              </div>
              <p className="text-sm text-gray-600">Temps de réparation incident</p>
            </div>
          </div>
        </>
      )}

      {/* Bouton Action */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Scanner le projet</h3>
            <p className="text-sm text-blue-700">Exécuter npx create-gef doctor pour mettre à jour les métriques</p>
            {scanMessage && (
              <p className="text-sm text-blue-600 mt-2">{scanMessage}</p>
            )}
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isScanning ? "Scan en cours..." : "Scanner maintenant"}
          </button>
        </div>
      </div>
    </div>
  );
}

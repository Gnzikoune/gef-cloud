"use client";

import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projectId] = useState("default-project-id");

  // Charger les métriques au chargement du composant
  useEffect(() => {
    loadMetrics();
    
    // Polling toutes les 5 secondes pour mettre à jour les métriques
    const interval = setInterval(loadMetrics, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const loadMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setMetrics(data.metrics);
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur chargement métriques:", error);
      setLoading(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
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
        setScanMessage("Scan lancé avec succès ! Mise à jour automatique dans quelques secondes...");
        // Recharger les métriques après un délai
        setTimeout(() => {
          loadMetrics();
          setScanMessage("");
        }, 5000);
      } else {
        setScanMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setScanMessage("Erreur lors du lancement du scan");
    } finally {
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

  if (!metrics) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard DORA</h2>
          <p className="mt-2 text-gray-600">Métriques d'ingénierie élite pour votre projet</p>
        </div>

        {/* Message Pas de Données */}
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
            </ul>
          </div>
        </div>

        {/* Bouton Action */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Scanner le projet</h3>
              <p className="text-sm text-blue-700">Exécuter npx create-gef doctor pour collecter les métriques</p>
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard DORA</h2>
        <p className="mt-2 text-gray-600">Métriques d'ingénierie élite pour votre projet</p>
      </div>

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

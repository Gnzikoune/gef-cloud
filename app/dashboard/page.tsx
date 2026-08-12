"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState("");

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
        setScanMessage("Scan lancé avec succès ! Vérifiez les métriques dans quelques minutes.");
      } else {
        setScanMessage(`Erreur: ${data.error}`);
      }
    } catch (error) {
      setScanMessage("Erreur lors du lancement du scan");
    } finally {
      setIsScanning(false);
    }
  };

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

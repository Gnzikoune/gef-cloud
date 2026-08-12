"use client";

import { useState, useEffect } from "react";

interface Scan {
  id: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  currentStep: string | null;
  progressPercentage: number | null;
}

interface ScanHistoryProps {
  projectId: string;
}

export default function ScanHistory({ projectId }: ScanHistoryProps) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchScans();
    }
  }, [projectId]);

  // Refresh scans every 10 seconds
  useEffect(() => {
    if (projectId) {
      const interval = setInterval(() => fetchScans(), 10000);
      return () => clearInterval(interval);
    }
  }, [projectId]);

  const fetchScans = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/scans?projectId=${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setScans(data);
      }
    } catch (error) {
      console.error("Error fetching scans:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
            ✅ Terminé
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
            ❌ Échoué
          </span>
        );
      case "running":
        return (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
            🔄 En cours
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
            ⏳ En attente
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historique des scans
        </h3>
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Historique des scans
      </h3>
      {scans.length === 0 ? (
        <div className="text-gray-600 text-center py-8">
          Aucun scan effectué
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {scans.map((scan) => (
            <div
              key={scan.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusBadge(scan.status)}
                  <span className="text-sm text-gray-600">
                    {formatDate(scan.startedAt)}
                  </span>
                </div>
                {scan.progressPercentage !== null && (
                  <span className="text-sm text-gray-600">
                    {scan.progressPercentage}%
                  </span>
                )}
              </div>
              {scan.currentStep && (
                <div className="text-sm text-gray-700 mb-1">
                  {scan.currentStep}
                </div>
              )}
              {scan.error && (
                <div className="text-sm text-red-600">
                  Erreur: {scan.error}
                </div>
              )}
              {scan.completedAt && (
                <div className="text-xs text-gray-500">
                  Durée:{" "}
                  {Math.round(
                    (new Date(scan.completedAt).getTime() -
                      new Date(scan.startedAt).getTime()) /
                      1000
                  )}{" "}
                  secondes
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

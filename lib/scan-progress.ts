// Stockage in-memory pour la progression des scans (MVP)
// À terme, utiliser Redis pour une architecture scalable

interface ScanProgress {
  projectId: string;
  status: "running" | "completed" | "failed";
  currentFile?: string;
  totalFiles: number;
  scannedFiles: number;
  currentStep: string;
  startTime: number;
}

const scanProgressStore = new Map<string, ScanProgress>();

export function setScanProgress(projectId: string, progress: ScanProgress) {
  scanProgressStore.set(projectId, progress);
}

export function getScanProgress(projectId: string): ScanProgress | undefined {
  return scanProgressStore.get(projectId);
}

export function deleteScanProgress(projectId: string) {
  scanProgressStore.delete(projectId);
}

export function updateScanProgress(
  projectId: string,
  updates: Partial<ScanProgress>
) {
  const current = scanProgressStore.get(projectId);
  if (current) {
    const updated = { ...current, ...updates };
    scanProgressStore.set(projectId, updated);
  }
}

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
  };
  private: boolean;
}

export default function RepositorySelector({
  onRepositorySelect,
}: {
  onRepositorySelect: (repo: Repository) => void;
}) {
  const { data: session } = useSession();
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  useEffect(() => {
    if (session) {
      fetchRepositories();
    }
  }, [session]);

  const fetchRepositories = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/github/repos");
      if (response.ok) {
        const data = await response.json();
        setRepos(data);
      }
    } catch (error) {
      console.error("Error fetching repos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (repo: Repository) => {
    setSelectedRepo(repo);
    onRepositorySelect(repo);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Sélectionner un repository
      </h3>
      {loading ? (
        <div className="text-gray-600">Chargement des repositories...</div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {repos.map((repo) => (
            <button
              key={repo.id}
              onClick={() => handleSelect(repo)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${
                selectedRepo?.id === repo.id
                  ? "bg-blue-50 border-blue-500"
                  : "bg-gray-50 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{repo.full_name}</div>
                  <div className="text-sm text-gray-600">
                    {repo.private ? "Privé" : "Public"}
                  </div>
                </div>
                {selectedRepo?.id === repo.id && (
                  <span className="text-blue-600">✓</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

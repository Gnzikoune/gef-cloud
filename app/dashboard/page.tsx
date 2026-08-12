export default function DashboardPage() {
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
          Les métriques DORA s'afficheront ici après la configuration de l'infrastructure
          (PostgreSQL, Redis, Worker) et l'exécution du premier scan doctor.
        </p>
        <div className="bg-white border border-gray-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
          <h4 className="font-semibold text-gray-900 mb-2">État de l'implémentation :</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>✅ Dashboard UI avec 4 widgets DORA</li>
            <li>✅ Installation NextAuth.js pour authentification GitHub OAuth</li>
            <li>⏳ Configuration PostgreSQL + Prisma (en cours)</li>
            <li>⏳ Configuration Redis pour le cache (en cours)</li>
            <li>⏳ Worker pour exécuter les scans doctor (en cours)</li>
          </ul>
        </div>
      </div>

      {/* Bouton Action */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Scanner le projet</h3>
            <p className="text-sm text-blue-700">Exécuter npx create-gef doctor pour collecter les métriques</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Scanner maintenant
          </button>
        </div>
      </div>
    </div>
  );
}

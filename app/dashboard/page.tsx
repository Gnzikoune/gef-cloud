export default function DashboardPage() {
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
            <div className="text-4xl font-bold text-green-600">76%</div>
            <div className="text-sm text-gray-600">13/17 critères</div>
          </div>
        </div>
      </div>

      {/* 4 Widgets DORA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deployment Frequency */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Deployment Frequency</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
              Elite
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">2.5/jour</div>
          <p className="text-sm text-gray-600">Fréquence de déploiement</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Benchmark Elite: {">"}1/jour</p>
        </div>

        {/* Lead Time for Changes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Lead Time for Changes</h3>
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
              Elite
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">45 min</div>
          <p className="text-sm text-gray-600">Temps commit → déploiement</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Benchmark Elite: {"<"}1 heure</p>
        </div>

        {/* Change Failure Rate */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Change Failure Rate</h3>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
              Medium
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">8.5%</div>
          <p className="text-sm text-gray-600">Taux d'échec en production</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Benchmark Elite: &lt;5%</p>
        </div>

        {/* Time to Restore */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Time to Restore</h3>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
              Medium
            </span>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">2.5 heures</div>
          <p className="text-sm text-gray-600">Temps de réparation incident</p>
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">Benchmark Elite: {"<"}1 heure</p>
        </div>
      </div>

      {/* Bouton Action */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">Scanner le projet</h3>
            <p className="text-sm text-blue-700">Exécuter npx create-gef doctor pour mettre à jour les métriques</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Scanner maintenant
          </button>
        </div>
      </div>
    </div>
  );
}

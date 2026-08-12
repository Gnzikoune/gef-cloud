"use client";

import { useSession, signIn } from "next-auth/react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    );
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-4xl w-full px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                GEF Cloud
              </h1>
              <p className="text-xl text-gray-600">
                Dashboard de métriques DORA pour ingénierie élite
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <img
                  src={session.user?.image || ""}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-700">
                  Bonjour, {session.user?.name}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Gouvernance d'ingénierie
                </h3>
                <p className="text-sm text-blue-700">
                  Audits automatisés avec Guardian Engineering Framework
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  Métriques DORA
                </h3>
                <p className="text-sm text-green-700">
                  Dashboard en temps réel pour vos indicateurs clés
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Scanner Projects
                </h3>
                <p className="text-sm text-purple-700">
                  Scan GitHub repositories avec create-gef doctor
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-orange-900 mb-2">
                  Temps Réel
                </h3>
                <p className="text-sm text-orange-700">
                  Mises à jour automatiques via Server-Sent Events
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/dashboard"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Accéder au Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl w-full px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              GEF Cloud
            </h1>
            <p className="text-xl text-gray-600">
              Dashboard de métriques DORA pour ingénierie élite
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Gouvernance d'ingénierie
              </h3>
              <p className="text-sm text-blue-700">
                Audits automatisés avec Guardian Engineering Framework
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Métriques DORA
              </h3>
              <p className="text-sm text-green-700">
                Dashboard en temps réel pour vos indicateurs clés
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Scanner Projects
              </h3>
              <p className="text-sm text-purple-700">
                Scan GitHub repositories avec create-gef doctor
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-2">
                Temps Réel
              </h3>
              <p className="text-sm text-orange-700">
                Mises à jour automatiques via Server-Sent Events
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => signIn("github")}
              className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Se connecter avec GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

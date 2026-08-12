# Project Configuration — GEF Cloud

## 📋 Informations Générales

- **Nom du projet** : GEF Cloud
- **Type** : SaaS de gouvernance d'ingénierie
- **Repository** : https://github.com/Gnzikoune/gef-cloud
- **Repository GEF original** : https://github.com/Gnzikoune/GEF

## 🎯 Objectif Métier

GEF Cloud est un SaaS de gouvernance d'ingénierie qui permet aux équipes IA-first de :
- Scanner leurs projets avec `npx create-gef doctor`
- Visualiser les métriques DORA (Deployment Frequency, Lead Time, Change Failure Rate, Time to Restore)
- Avoir un dashboard centralisé de conformité GEF
- Collecter des métriques de gouvernance multi-projets

## 🏗️ Architecture

### Stack Technique
- **Frontend** : Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Database** : Prisma v6 + SQLite (dev) / PostgreSQL (prod)
- **Authentification** : NextAuth.js avec GitHub OAuth
- **Worker** : TypeScript worker pour exécuter `npx create-gef doctor`

### Structure du Repository
```
gef-cloud/
├── app/                 # Next.js App Router
│   ├── dashboard/       # Dashboard DORA
│   └── api/            # API Routes
├── workers/            # Background workers
├── lib/               # Utilitaires partagés
├── prisma/            # Schéma et migrations
└── docs/              # Documentation Diátaxis
```

## 📊 Métriques DORA

Le dashboard affiche les 4 métriques DORA élite :
1. **Deployment Frequency** : Fréquence de déploiement
2. **Lead Time for Changes** : Temps commit → déploiement
3. **Change Failure Rate** : Taux d'échec en production
4. **Time to Restore** : Temps de réparation incident

## 🔧 Configuration Spécifique

### Variables d'Environnement
- `DATABASE_URL` : URL de connexion base de données
- `GITHUB_CLIENT_ID` : GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET` : GitHub OAuth Client Secret
- `NEXTAUTH_SECRET` : Secret NextAuth.js

### Hard Limits du Playbook
- **MAX_LINES** : 50 lignes par fonction
- **MAX_PARAMS** : 4 arguments par fonction
- **MAX_COMPLEXITY** : 10 chemins logiques
- **MAX_PAYLOAD** : 1 Mo pour requêtes API

## 🚀 Phase Actuelle

**Phase 1 MVP** : Dashboard DORA + intégration GEF doctor + scan worker

## 📝 Notes de Développement

- Ce projet utilise le package `create-gef` comme dépendance
- Le dashboard affiche "Aucune donnée disponible" jusqu'au premier scan
- Le worker exécute `npx create-gef doctor` dans le contexte du projet scanné
- PostgreSQL + Redis sont prévus pour les phases suivantes

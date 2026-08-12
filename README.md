# GEF Cloud — Dashboard de Métriques DORA

## 🎯 Qu'est-ce que GEF Cloud ?

GEF Cloud est un SaaS de gouvernance d'ingénierie qui permet aux équipes IA-first de :
- Scanner leurs projets avec `npx create-gef doctor`
- Visualiser les métriques DORA (Deployment Frequency, Lead Time, Change Failure Rate, Time to Restore)
- Avoir un dashboard centralisé de conformité GEF
- Collecter des métriques de gouvernance multi-projets

## 🚀 Démarrage Rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Lancer le serveur sur http://localhost:3000
```

## 📊 Dashboard DORA

Le dashboard affiche les 4 métriques DORA élite :
1. **Deployment Frequency** : Fréquence de déploiement
2. **Lead Time for Changes** : Temps commit → déploiement
3. **Change Failure Rate** : Taux d'échec en production
4. **Time to Restore** : Temps de réparation incident

## 🔧 Configuration

### Variables d'Environnement
- `DATABASE_URL` : URL de connexion base de données
- `GITHUB_CLIENT_ID` : GitHub OAuth Client ID
- `GITHUB_CLIENT_SECRET` : GitHub OAuth Client Secret
- `NEXTAUTH_SECRET` : Secret NextAuth.js

## 🏗️ Architecture

- **Frontend** : Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Database** : Prisma v6 + SQLite (dev) / PostgreSQL (prod)
- **Authentification** : NextAuth.js avec GitHub OAuth
- **Worker** : TypeScript worker pour exécuter `npx create-gef doctor`

## � Phase Actuelle

**Phase 1 MVP** : Dashboard DORA + intégration GEF doctor + scan worker

## 🔗 Liens

- **Repository GEF original** : https://github.com/Gnzikoune/GEF
- **Documentation GEF** : Voir le repository GEF pour le Engineering Playbook complet

## 📝 Licence

Ce projet fait partie de l'écosystème GEF et suit les mêmes principes de gouvernance d'ingénierie.

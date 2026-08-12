# AGENTS.md — Instructions pour les IA et Agents

## 🤖 Contexte

Ce fichier contient les instructions spécifiques pour les IA et agents travaillant sur GEF Cloud.

## 📋 Informations pour les IA

### Projet GEF Cloud
- **Type** : SaaS de gouvernance d'ingénierie
- **Objectif** : Dashboard de métriques DORA + intégration GEF doctor
- **Stack** : Next.js 16, React 19, TypeScript, Prisma v6, SQLite
- **Repository** : https://github.com/Gnzikoune/gef-cloud

### Comportement Attendu
1. **Respecter le Playbook GEF** : Voir `.cursorrules` et `.windsurfrules`
2. **Phase du projet** : R&D / Dev Contractuel
3. **Priorités** : Infrastructure stable → Dashboard fonctionnel → Tests

### Limites Techniques
- **MAX_LINES** : 50 lignes par fonction
- **MAX_PARAMS** : 4 arguments par fonction
- **MAX_COMPLEXITY** : 10 chemins logiques
- **MAX_PAYLOAD** : 1 Mo pour requêtes API

### Conventions de Commit
- Format : `type: description (#ticket)`
- Types : `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`
- Exemple : `feat: dashboard DORA avec 4 widgets (#1)`

## 🔧 Technologies Spécifiques

### Next.js 16
- App Router uniquement (pas de Pages Router)
- Turbopack activé
- Server Components par défaut

### Prisma v6
- SQLite pour développement
- PostgreSQL pour production (à venir)
- Schéma : Project, Metrics, Scan

### Tailwind CSS v3
- Utiliser les classes utilitaires Tailwind
- Pas de CSS personnalisé excessif

## 📊 Métriques DORA

Le dashboard doit afficher les 4 métriques DORA :
1. **Deployment Frequency** : Fréquence de déploiement
2. **Lead Time for Changes** : Temps commit → déploiement
3. **Change Failure Rate** : Taux d'échec en production
4. **Time to Restore** : Temps de réparation incident

## 🚨 Actions Interdites

- Push direct sur `main` ou `master`
- Commit sans Conventional Commits
- Bypass des hooks sans validation humaine
- Exposer des secrets dans le code

---

*Ces instructions complètent le Engineering Playbook du repository GEF.*

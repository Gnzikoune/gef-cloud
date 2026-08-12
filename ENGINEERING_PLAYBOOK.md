# Engineering Playbook — Adaptation GEF Cloud

> **NOTE** : Ceci est une version adaptée du Engineering Playbook GEF pour le projet GEF Cloud SaaS.
> Pour le Playbook complet, voir le repository GEF : https://github.com/Gnzikoune/GEF

## 📋 Objectif Spécifique GEF Cloud

GEF Cloud est un SaaS de gouvernance d'ingénierie, pas un générateur d'application.
Ce Playbook adapté se concentre sur les règles pertinentes pour un SaaS de dashboard et métriques.

---

## § 1. CLEAN CODE — HARD LIMITS ADAPTÉES

- **Fonctions / Méthodes** : 50 lignes max
- **Paramètres** : 4 arguments max
- **Complexité Cyclomatique** : 10 chemins logiques max
- **Nesting** : 3 niveaux max
- **Composants UI** : 150 lignes max
- **Fichiers** : 300 lignes max

### Conventions de Nommage
- **Fichiers / Dossiers** : `kebab-case`
- **Classes / Composants** : `PascalCase`
- **Variables / Fonctions** : `camelCase`
- **Constantes Globales** : `UPPER_SNAKE_CASE`

---

## § 2. ARCHITECTURE SaaS

- **Feature-Sliced Design** : Organiser par fonctionnalité métier
  - ✅ `/features/dashboard/`, `/features/auth/`, `/features/metrics/`
  - ❌ `/controllers`, `/models`, `/views`
- **SRP** : Une classe/fonction ne fait qu'une seule chose

---

## § 3. SÉCURITÉ SaaS

- **Zero Trust** : Validation stricte des entrées (Zod/Joi)
- **Fail-Safe Defaults** : Tout accès refusé par défaut
- **Protection SQLi** : Requêtes paramétrées OBLIGATOIRES (Prisma)
- **Protection XSS** : Encodage des données à la sortie
- **Secrets** : Toujours via `.env`. JAMAIS hardcodés.

### Limites SaaS
| Paramètre | Limite |
|-----------|--------|
| Access Token (JWT) | 15 minutes max |
| Refresh Token | 7 jours max (cookie `HttpOnly`) |
| Corps de requête API (JSON) | 1 Mo max |
| Upload d'image/fichier | 5 Mo max |
| Secrets | Toujours via `.env`. JAMAIS hardcodés. |

---

## § 4. STRATÉGIE GIT

- **Branche `main` = intouchable** : Pushs directs STRICTEMENT INTERDITS
- **Branches courtes** : `feat/xxx`, `fix/xxx`
- **Pull Requests obligatoires** : Tout code passe par une PR
- **Conventional Commits** : `type: description (#ticket)`

---

## § 5. TECHNOLOGIES GEF CLOUD

- **Frontend** : Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Database** : Prisma v6 + SQLite (dev) / PostgreSQL (prod)
- **Authentification** : NextAuth.js avec GitHub OAuth
- **Worker** : TypeScript worker pour exécuter `npx create-gef doctor`

---

## § 6. MÉTRIQUES DORA

Le dashboard affiche les 4 métriques DORA élite :
1. **Deployment Frequency** : Fréquence de déploiement
2. **Lead Time for Changes** : Temps commit → déploiement
3. **Change Failure Rate** : Taux d'échec en production
4. **Time to Restore** : Temps de réparation incident

---

*Ce Playbook est adapté spécifiquement pour GEF Cloud SaaS.*

# RESEARCH_LOG — Journal de Recherche et Résolution de Bugs

## 🐛 Bugs Résolus

### 2026-08-12 — Erreur Prisma v7 Incompatibilité SQLite
**Symptôme** : `PrismaClientInitializationError: PrismaClient was instantiated without any options. A driver adapter is required to connect to your database.`
**Cause Racine** : Prisma v7.9.1 nécessite des driver adapters et ne supporte pas SQLite nativement
**Résolution** : Downgrade vers Prisma v6.19.3 qui supporte SQLite nativement
**Commande** : `npm install prisma@6 @prisma/client@6`
**Leçon Apprise** : Toujours vérifier la compatibilité des versions majeures de Prisma avec SQLite

### 2026-08-12 — Erreur Parsing React avec Caractères Spéciaux
**Symptôme** : `Error: Unexpected token. Did you mean {'>'} or &gt;?` dans app/dashboard/page.tsx
**Cause Racine** : Caractères `<` et `>` dans le texte JSX causent des erreurs de parsing
**Résolution** : Utiliser des expressions JSX : `{"<"}` et `{">"}` 
**Leçon Apprise** : En JSX, les caractères spéciaux HTML doivent être dans des expressions JavaScript

### 2026-08-12 — Hook Commit Message Trop Strict
**Symptôme** : Hook rejette les messages même quand le format semble correct
**Cause Racine** : Hook regex attend un format très strict, multi-lignes rejetés
**Résolution** : Utiliser des messages courts : `type: description (#ticket)`
**Leçon Apprise** : Garder les messages de commit courts et simples pour les hooks GEF

### 2026-08-12 — Suppression Accidentelle Fichiers Gouvernance
**Symptôme** : Score doctor scan bas (0/17) après reset git
**Cause Racine** : Fichiers .cursorrules, .windsurfrules, etc. supprimés lors du reset
**Résolution** : Recréer les fichiers de gouvernance adaptés pour GEF Cloud SaaS
**Leçon Apprise** : Toujours vérifier les fichiers de gouvernance après des opérations git drastiques

## 🔍 Problèmes En Cours

### Score Doctor Scan Incomplet
**État** : 8/17 (47%)
**Critères Manquants** :
- ENGINEERING_PLAYBOOK.md (remplacé par PROJECT_CONFIG.md)
- docs/research/RESEARCH_LOG.md (créé mais peut-être pas détecté)
- .github/workflows/ (à créer)
- Linter détecté (à vérifier)

---

*Ce fichier documente tous les bugs résolus et les leçons apprises.*

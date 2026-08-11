# 🛡️ GUARDIAN ENGINEERING FRAMEWORK (GEF) — RÈGLES COMPLÈTES POUR L'IA
# Référence absolue : ENGINEERING_PLAYBOOK.md
# Ce fichier est lu nativement par Cursor, Windsurf, et GitHub Copilot.
# Toute IA opérant sur ce projet doit lire, intérioriser et respecter CHACUNE de ces règles.
# Il n'est PAS nécessaire de demander à l'utilisateur ce que l'IA est censée faire :
# ce fichier est la réponse à toutes ces questions.

---

## § 0. AVANT TOUTE ACTION — PROTOCOLE D'ENTRÉE

Avant d'écrire une seule ligne de code, l'IA DOIT :

0. **Relecture Obligatoire (Anti-Amnésie)** : Utiliser impérativement l'outil de lecture de fichier (`view_file` ou équivalent) pour lire et relire l'intégralité des fichiers suivants à CHAQUE interaction :
   - `ENGINEERING_PLAYBOOK.md` (ou `PROJECT_CONFIG.md`)
   - `CONTEXT.md` (mémoire externe du projet)
   - `RESEARCH_LOG.md` (si applicable pour des bugs récents)
   Cela permet de recharger en mémoire les Hard Limits, consignes de sécurité, et l'état actuel du projet, et ce **dès le TOUT PREMIER prompt de chaque interaction** et avant toute analyse ou action.

1. **Identifier la phase du projet** : (Idée → R&D → Dev Contractuel → Release → Maintenance).
   - Si R&D : les règles CI/CD sont souples, le code reste dans un dépôt `prototype` isolé.
   - Si Contractuel/Production : les règles de tests, sécurité et CI/CD sont NON-NÉGOCIABLES dès le premier commit.
2. **Confirmer l'intention métier** : Ne jamais deviner le "Pourquoi". Si l'objectif métier n'est pas explicite, DEMANDER avant de coder.
3. **Vérifier la branche Git** : Ne JAMAIS travailler sur `main` ou `master`. Créer une branche (`git checkout -b feat/xxx` ou `fix/xxx`) si ce n'est pas déjà fait.
4. **Vérification Systématique (Chain of Thought)** : Avant de proposer ou générer le moindre code, l'IA DOIT ouvrir un bloc XML `<gef_compliance_check>`. Dans ce bloc, elle affirme explicitement respecter les Hard Limits, les hooks et la doc (Ex: `<gef_compliance_check>Je respecte la limite de X lignes, j'ai bien mis à jour RESEARCH_LOG.md car c'est un fix, etc.</gef_compliance_check>`).

### CHECKPOINTS OBLIGATOIRES AVANT ACTIONS CRITIQUES

Avant d'exécuter les commandes suivantes, l'IA DOIT afficher un bloc `<gef_compliance_check>` spécifique :

**Commandes Git :**
- `git push` → Vérifier que la branche de destination n'est PAS main/master
- `git merge` → Vérifier que ce n'est pas un merge direct sur main/master
- `git commit` → Vérifier le message respecte Conventional Commits avec ID ticket

**Commandes GitHub :**
- `gh pr merge` → **INTERDIT À L'IA** : L'IA ne doit JAMAIS exécuter cette commande. Seul l'utilisateur humain peut merger des PRs. L'IA peut créer des PRs mais ne doit jamais les merger elle-même.
- `gh api` → Vérifier que l'opération n'est pas une modification de protection de branche

**Modifications de configuration :**
- Fichiers dans `.github/` → Vérifier l'impact sur CI/CD
- Fichiers dans `hooks/` → Vérifier que les règles ne sont pas contournées
- `.cursorrules` ou `.windsurfrules` → Synchroniser l'autre fichier immédiatement

---

## § 1. CRASH CLAUSE — ZÉRO CONTOURNEMENT SILENCIEUX

> C'est la règle la plus importante du framework. Elle prévaut sur toutes les autres.

- **Face à une erreur, un obstacle ou une ambiguïté** : ARRÊTER IMMÉDIATEMENT et signaler le problème à l'utilisateur avec précision.
- **Ne JAMAIS improviser une solution de contournement (workaround) silencieuse** pour atteindre l'objectif coûte que coûte.
- **Si une commande échoue** : diagnostiquer la cause racine, documenter, et attendre une validation humaine avant de continuer.
- **Si une consigne est ambiguë** : poser la question plutôt que d'interpréter.

---

## § 2. CLEAN CODE — HARD LIMITS ABSOLUS

Ces limites sont non-négociables. L'IA ne peut JAMAIS générer du code qui les viole.

- **Fonctions / Méthodes** : `{{MAX_LINES}}` lignes max.
- **Paramètres** : `{{MAX_PARAMS}}` arguments max. Au-delà, utiliser un objet de configuration.
- **Complexité Cyclomatique** : `{{MAX_COMPLEXITY}}` chemins logiques max par fonction.
- **Nesting / Profondeur** : 3 niveaux max. Utiliser les **Guard Clauses (Early Return)** pour réduire le nesting.
- **Composants UI** : 150 à 200 lignes max. Logique > 50 lignes → extraire en Custom Hook.
- **Fichiers** : 300 à 400 lignes max.
- **Règle de 3** : 1ère duplication = OK. 2ème = toléré. 3ème = refactorisation en abstraction OBLIGATOIRE.

### Conventions de Nommage
- **Fichiers / Dossiers** : `kebab-case` (ex: `user-profile.tsx`)
- **Classes / Composants** : `PascalCase` (ex: `UserProfile`)
- **Variables / Fonctions** : `camelCase` (ex: `getUserData`)
- **Constantes Globales** : `UPPER_SNAKE_CASE` (ex: `MAX_RETRY_COUNT`)
- **Règle absolue** : Zéro warning de lint ignoré sans commentaire explicatif.

---

## § 3. ARCHITECTURE — CLEAN ARCHITECTURE & SOLID

- **Feature-Sliced Design (obligatoire)** : Organiser les dossiers par fonctionnalité métier, PAS par couche technique.
  - ❌ Interdit : `/controllers`, `/models`, `/views`
  - ✅ Correct : `/features/auth/api.ts`, `/features/auth/components/`, `/features/billing/model.ts`
- **SRP (Single Responsibility Principle)** : Une classe/fonction ne fait qu'une seule chose.
- **DIP (Dependency Inversion)** : Le domaine dépend d'interfaces, jamais d'implémentations concrètes.

---

## § 4. GESTION DES ERREURS — RESILIENCE

- **Information Hiding** : Ne JAMAIS exposer de stack traces ou détails techniques à l'utilisateur final. Renvoyer une erreur générique avec un ID de log.
- **Typage des Erreurs** : Créer des classes d'exceptions typées (`DomainError`, `InfraError`, `ValidationError`).
- **Result Pattern** : Remplacer les blocs `try/catch` massifs par `Result<Success, Failure>` pour forcer la gestion explicite de chaque échec.

---

## § 5. SÉCURITÉ — OWASP HARD LIMITS

*"La complexité est l'ennemie de la sécurité."*

- **Zero Trust** : Ne jamais faire confiance aux entrées utilisateur. Validation stricte à toutes les frontières (ex: `Zod`, `Joi`).
- **Fail-Safe Defaults** : Tout accès est REFUSÉ par défaut. On accorde explicitement les permissions.
- **Protection SQLi** : Requêtes paramétrées OBLIGATOIRES. Aucune requête SQL dynamique non-paramétrée.
- **Protection XSS** : Encodage des données à la sortie.

### Limites Dures
| Paramètre | Limite |
|-----------|--------|
| Access Token (JWT) | 15 minutes max |
| Refresh Token | 7 jours max (cookie `HttpOnly`) |
| Corps de requête API (JSON) | `{{MAX_PAYLOAD}}` max |
| Upload d'image/fichier | 5 Mo max |
| Tentatives de connexion échouées | Blocage 15 min après 5 échecs |
| Limite globale API | 100 requêtes / minute / IP |
| Secrets | Toujours via `.env`. JAMAIS hardcodés. |

---

## § 6. STRATÉGIE GIT — GITHUB FLOW

- **Branche `main` = intouchable** : Pushes directs STRICTEMENT INTERDITS.
- **Branches courtes** : `feat/xxx`, `fix/xxx`, `docs/xxx`. Durée de vie max : quelques jours.
- **Une action = Un commit** : Ne jamais grouper la création d'un fichier et sa modification dans le même commit.
- **Pull Requests (PR) obligatoires** : Tout code passe par une PR. La CI doit être verte avant merge.
- **Revue de code** : Une approbation humaine est requise. L'IA prépare la PR mais NE MERGE JAMAIS elle-même.
- **Conventional Commits (strict)** :
  - Format : `type: description courte (#ticket-kanban)`
  - Types : `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `style:`, `test:`
  - Exemple : `feat: ajout de l'authentification OAuth (#42)`

---

## § 7. DOCUMENTATION — DIÁTAXIS & DOCS-AS-CODE

- **Commenter le POURQUOI** : Les commentaires expliquent l'intention, pas l'implémentation.
- **Structure Diátaxis** (dossier `docs/`) :
  - `docs/tutorials/` → Prise en main
  - `docs/how-to/` → Guides de tâches spécifiques
  - `docs/reference/` → API, DB, schémas
  - `docs/explanation/adr/` → Architecture Decision Records (ADR)
- **ADR obligatoire** : Toute décision architecturale majeure (changement de DB, framework, cloud...) nécessite un fichier ADR dans `docs/explanation/adr/ADR-XXX-titre.md`.
- **RESEARCH_LOG obligatoire** : Tout bug critique résolu doit être documenté dans `docs/research/RESEARCH_LOG.md` avec : Symptôme / Cause Racine / Résolution / Leçon apprise.
- **Modèle C4** : L'architecture est visualisée et versionnée via Mermaid.js (Contexte, Conteneurs, Composants).

---

## § 8. ASSURANCE QUALITÉ — TEST PYRAMID & SHIFT-LEFT

- **Shift-Left** : La réflexion sur les tests commence dès l'écriture des spécifications, avant le code.
- **BDD obligatoire** : Les tests d'intégration suivent la syntaxe `Given / When / Then`.
- **Pyramide des tests** :
  - 🟢 **80%** de Tests Unitaires (rapides, ciblent la logique métier, déterministes pour l'IA).
  - 🟡 **15%** de Tests d'Intégration (valident DB / API).
  - 🔴 **5%** de Tests E2E Playwright (lents, fragiles — écrits après implémentation stable).
- **TDD / SDD** : Écrire les Tests Unitaires/Intégration validant la Spec AVANT le code métier.

---

## § 9. MÉTHODOLOGIE PAS-À-PAS — PILOTAGE & AUTONOMIE

- **Cycle de travail** : `Propose → Explique → Implémente → Commite → Valide`. Jamais de larges blocs d'un coup.
- **Découpage en Issues** : Utiliser `gh issue create` pour transformer un grand chantier en sous-tâches traçables. **L'IA DOIT lire et utiliser le format défini dans `.github/ISSUE_TEMPLATE/` (s'il existe) et respecter le `CONTRIBUTING.md`.**
- **Création de PR** : Utiliser `gh pr create` avec la mention `Closes #XYZ` et utiliser impérativement le `.github/PULL_REQUEST_TEMPLATE.md`.
- **Zéro Scories** : Scripts de debug, fichiers temporaires et commentaires "commentés" sont supprimés AVANT tout push.
- **Séparation R&D** : Les expérimentations sans cahier des charges vivent dans un dépôt privé séparé. L'historique Git officiel reste propre.

---

## § 10. WORKFLOWS CONTEXTUELS — COMPORTEMENT SELON LA TÂCHE

Ces workflows remplacent le chargement manuel des anciens fichiers de prompts. L'IA DOIT les activer automatiquement dès qu'elle détecte le contexte.

### 🐛 Mode Bugfix (si l'utilisateur parle d'un bug, d'une erreur ou d'un crash)
1. **Reproduire** le bug de manière isolée. Ne rien modifier avant de comprendre la cause racine.
2. Évaluer l'impact sécurité en priorité absolue.
3. Corriger avec un commit `fix: ... (#ticket)`.
4. Écrire ou mettre à jour un test couvrant le scénario.
5. Documenter dans `RESEARCH_LOG.md` OBLIGATOIREMENT.

### 🚀 Mode Feature (Agentic SDD — Nouvelle fonctionnalité)
1. Créer un ticket `gh issue create` et une branche `feat/xxx`.
2. **[ARRÊT IA]** Rédiger `specs/spec.md` (Intent, Requirements, Acceptance Criteria) et `specs/plan.md` (Design, Tasks).
3. **Attendre OBLIGATOIREMENT la validation humaine** de la spec et du plan.
4. Écrire les Tests (Unitaires/Intégration) validant les critères d'acceptation (TDD).
5. Exécuter les tâches, avec micro-commits fréquents `feat: ... (#ticket)`.
6. Si nouveauté architecturale → créer un ADR.
7. Ouvrir une PR avec `gh pr create` et demander le merge à l'utilisateur.

### 🔍 Mode Code Review (si l'utilisateur demande une revue de code, checklist avant tout merge)
- [ ] Hard Limits respectées (lignes, paramètres, complexité, nesting) ?
- [ ] Feature-Sliced Design respecté ?
- [ ] SRP respecté (une seule responsabilité par classe/fonction) ?
- [ ] Entrées validées (Zod/Joi) ? Pas de SQL dynamique ? Pas de secrets hardcodés ?
- [ ] Tests unitaires couvrent la logique nouvelle/modifiée ?
- [ ] Conventional Commits avec ID ticket ?
- [ ] ADR créé si décision architecturale majeure ?
- [ ] Code commenté sur l'INTENTION (le pourquoi), pas le quoi ?
- **Si un point échoue → bloquer le merge et proposer le correctif.**

### 📐 Mode ADR (si l'utilisateur doit prendre une décision architecturale)
- Fichier : `docs/explanation/adr/ADR-XXX-titre_descriptif.md`
- Structure : Contexte / Options Considérées / Décision / Conséquences / Diagramme Mermaid (si applicable)
- Commit dédié : `docs(adr): création ADR-XXX — [titre] (#ticket)`
- ⚠️ Ne PAS consigner les ADR dans le RESEARCH_LOG (réservé aux bugs).

### 🏁 Mode Kickoff (si l'utilisateur démarre un nouveau projet)
1. Demander : "Ce projet est-il R&D ou Contractuel/Production ?"
2. Aider à remplir `PROJECT_CONFIG.md`.
3. Proposer la structure Feature-Sliced Design.
4. Créer `docs/` avec les 4 quadrants Diátaxis.
5. Préparer le workflow GitHub Actions (Lint, Tests, Sécurité) dès le premier jour.
6. Premier commit : `chore: initialisation du projet via GEF (structure, CI/CD, docs)`

### Fin d'une tâche (Avant de conclure — OBLIGATOIRE ET AUTOMATIQUE)
L'IA NE DOIT PAS attendre que l'utilisateur pose ces questions. Elle DOIT les vérifier et les exécuter de sa propre initiative avant de conclure sa réponse :

- [ ] **Tâches achevées** : Relire le fichier `task.md` (si existant). Toutes les cases sont-elles cochées ? Sinon, finir le travail ou signaler clairement ce qui reste.
- [ ] **Vérification Documentaire** : Le `README.md`, le `CHANGELOG.md` ou la doc Diátaxis ont-ils besoin d'être mis à jour suite à ces changements ?
- [ ] **Synchronisation** : Si `.cursorrules` a été modifié, synchroniser `.windsurfrules` immédiatement (`cp .cursorrules .windsurfrules`).
- [ ] **Commit propre** : Aucune scorie (fichier temporaire, `console.log` de debug) dans le commit final.
- [ ] **PR ouverte** : La branche est-elle pushée et la PR créée sur GitHub ?

---

*Ce fichier est la loi fondamentale du GEF. Il garantit un niveau d'ingénierie d'excellence sur tous les projets en imposant ces contraintes mécaniquement.*

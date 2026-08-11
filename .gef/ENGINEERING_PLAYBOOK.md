# Engineering Playbook — Règles de Travail et de Traçabilité pour l'IA

> **IMPORTANT :** En tant qu'IA, je m'engage à lire, comprendre et respecter scrupuleusement ces règles tout au long du développement du projet. Ce document est la référence absolue de notre façon de travailler ensemble, sur **tous les projets**, quels que soient le langage, la stack ou le domaine (SaaS, IA, jeu vidéo, mobile, backend...).
>
> Les spécificités techniques d'un projet donné (services cloud utilisés, base de données, conventions propres au client) ne figurent **jamais** ici : elles vivent dans un fichier `PROJECT_CONFIG.md` à la racine de chaque dépôt. Ce Playbook reste universel.

---

## 0. Cycle de Vie du Projet

Avant toute règle technique, l'IA doit savoir situer où en est le projet. Chaque phase a ses propres règles de traçabilité (voir §10 — Séparation R&D / Production).

```
0. Idée
   ↓
1. Étude / cadrage
   ↓
2. Cahier des charges (validé avec le client)
   ↓
3. Architecture
   ↓
4. Prototype (R&D — non contractuel)
   ↓
5. Développement (contractuel)
   ↓
6. Tests
   ↓
7. Release
   ↓
8. Déploiement
   ↓
9. Maintenance
```

L'IA doit systématiquement identifier dans quelle phase se situe la demande en cours avant d'agir, et appliquer les règles correspondantes.

---

## 0.5. Mises à jour du Playbook & Clause d'Antériorité

Ce Playbook évolue dans le temps. Pour éviter que l'IA ne détruise un projet stable en essayant d'appliquer agressivement de nouvelles règles sur du code ancien, la règle suivante s'applique de manière stricte :

> **Clause d'Antériorité (Fix Forward) :** L'IA doit appliquer les règles du Playbook sur tout le **nouveau** code produit. Elle ne doit **jamais** refactoriser proactivement du code existant uniquement pour le rendre conforme à une nouvelle règle du Playbook, sauf demande explicite de l'utilisateur. Si l'IA modifie un ancien fichier pour une autre raison (bugfix, feature), elle peut le mettre aux normes au passage (règle du Boy Scout) et toujours documenter cela.

---

## 1. Traçabilité Git Extrême (Hyper-Granularité)

- **Une action = Un commit.** Chaque modification, ajout de fonction, correction de bug, ou même ajout de documentation doit faire l'objet d'un commit distinct.
- **Jamais de commits groupés.** Ne jamais mélanger la création d'un fichier et sa modification ultérieure dans le même commit.
- **Convention de nommage stricte :** Utiliser les *Conventional Commits* pour chaque message :

  | Préfixe | Usage |
  |---------|-------|
  | `feat:` | Nouvelle fonctionnalité |
  | `fix:` | Correction de bug |
  | `docs:` | Documentation uniquement |
  | `chore:` | Maintenance (nettoyage, dépendances) |
  | `refactor:` | Réécriture de code sans changement de comportement |
  | `style:` | Mise en forme UI/CSS, pas de logique |
  | `perf:` | Amélioration de performance |
  | `test:` | Ajout ou modification de tests |
  | `release:` | Création d'un tag de version stable |

- **Messages détaillés :** Pour les commits complexes, inclure un "body" expliquant *pourquoi*, pas seulement *quoi*.
- **Aucune falsification d'historique.** Les dates de commit reflètent toujours la réalité. La chronologie officielle d'un projet contractuel ne commence qu'au dépôt "officiel" (voir §10) — jamais en réécrivant les dates d'un dépôt existant.

---

## 2. Documentation Exhaustive & Continue

- **Commentaires en ligne :** Chaque bloc de code non-trivial doit expliquer l'*intention*, pas la mécanique.
- **Docstrings obligatoires :** Toute fonction, classe ou module doit inclure une documentation (paramètres, retour, rôle dans le pipeline), dans le format idiomatique du langage utilisé.
- **RESEARCH_LOG.md — Règle Fondamentale :** Tout bug critique et toute erreur bloquante **doit** être documentée dans `RESEARCH_LOG.md`. L'IA doit systématiquement ajouter une nouvelle entrée numérotée après chaque résolution. Ne jamais "corriger en silence".
- **Décisions architecturales → ADR séparés.** Les choix technologiques structurants (changement de base de données, de framework, de service cloud, etc.) ne vont **pas** dans le RESEARCH_LOG mais dans un ADR dédié (voir §6).
- **Mise à jour du README — Règle Précise (pas systématique) :**
  Le `README.md` est la vitrine publique du projet. Il est mis à jour **uniquement lorsqu'une modification change** :
  - l'installation ;
  - les fonctionnalités visibles ;
  - l'architecture ;
  - les API publiques ;
  - les prérequis ;
  - les commandes d'utilisation.

  Une modification interne sans impact utilisateur/développeur (ex : renommage de variable interne) ne déclenche pas de mise à jour du README.
  **Ne jamais laisser le README en retard de plus d'une session de travail** lorsqu'une mise à jour est due.

---

## 3. Méthodologie Pas-à-Pas

- Ne jamais coder de larges blocs en une seule fois sans validation intermédiaire.
- Proposer la modification, l'expliquer, l'implémenter, puis la commiter immédiatement.
- Si une modification entraîne une régression ou un bug, la diagnostiquer et documenter la résolution avant de poursuivre.

---

## 4. Architecture & Code

- Maintenir le code propre, modulaire et auditable scientifiquement.
- **Aucune donnée hardcodée.** Les listes extensibles (configuration métier, valeurs susceptibles d'évoluer) doivent être stockées en base de données ou en configuration, jamais en constante codée en dur.
- Les choix d'infrastructure spécifiques (cloud provider, base de données, services tiers) sont documentés dans `PROJECT_CONFIG.md`, pas ici.

### Standards de code

| Élément | Limite indicative |
|---|---|
| Fonction | Max ~40 lignes |
| Composant UI | Max ~250 lignes |
| Fichier | Max ~500 lignes |

- Lint obligatoire avant tout commit.
- Formatteur automatique obligatoire (config partagée dans le dépôt).
- Zéro erreur de typage (TypeScript, mypy, etc. selon le langage).
- Zéro warning ignoré sans justification écrite.
- Couverture de tests minimale à définir par projet dans `PROJECT_CONFIG.md`.

---

## 5. Sécurité Maximale (Best Practices)

- **Gestion des Secrets :** Ne jamais coder en dur de clés API, mots de passe, ou tokens. Toujours utiliser les variables d'environnement via `.env` (voir `.env.example`).
- **Sanitisation :** Valider et nettoyer toutes les entrées utilisateur.
- **Principe du Moindre Privilège :** Toute route ou fonctionnalité sensible doit vérifier explicitement les droits d'accès requis.
- **Tokens/Sessions :** Durée de vie limitée, jamais stockés en clair côté serveur.

### Sécurité GitHub

- Secret scanning activé.
- Dependabot activé.
- CodeQL (ou équivalent d'analyse statique) activé.
- Branch protection sur `main`.
- Commits signés recommandés.
- 2FA obligatoire sur le compte.

---

## 6. Historique des Décisions (ADR) et Gestion des Erreurs

- **ADR (Architecture Decision Records) :** Tout changement d'architecture significatif doit faire l'objet d'un fichier dédié dans `docs/adr/`, au format :

  ```
  docs/adr/
      ADR-001-titre-de-la-decision.md
      ADR-002-...
  ```

  Chaque ADR contient : contexte, options envisagées, décision retenue, conséquences.

- **Bugs :** Chaque bug résolu = une nouvelle entrée dans `RESEARCH_LOG.md` avec : le problème rencontré, l'hypothèse, l'expérimentation, et la résolution.
- **Zéro fichier de test en production :** Les scripts de débogage temporaires (`debug_*`, `test_*` hors suite de tests officielle) doivent être supprimés dès que leur usage est terminé. Ils ne doivent jamais être commités sur la branche principale.

---

## 7. Revue de Code

Avant chaque merge vers `main` :

- ✅ Lint
- ✅ Build
- ✅ Tests
- ✅ Revue (auto-revue minimum si travail solo)
- ✅ Documentation à jour
- ✅ Changelog mis à jour si applicable

---

## 8. Gestion des Dépendances

Toute dépendance ajoutée doit être justifiée :

```
Dépendance ajoutée
   ↓
Justification (pourquoi celle-ci)
   ↓
Licence vérifiée (compatible avec le projet)
   ↓
Maintenance (projet actif ? dernière mise à jour récente ?)
   ↓
Alternatives étudiées (au moins une)
```

---

## 9. CI/CD

À chaque push sur une branche de fonctionnalité, puis à chaque merge sur `main` :

```
Push
 ↓
Build
 ↓
Lint
 ↓
Tests
 ↓
Analyse de sécurité
 ↓
Coverage
 ↓
Release automatique (si applicable, sur main uniquement)
```

Les workflows précis (GitHub Actions, etc.) sont définis par projet, mais la séquence de contrôle ci-dessus est non-négociable.

---

## 10. Séparation R&D / Production

Ceci répond à un problème récurrent : commencer à développer avant la validation officielle du cahier des charges avec le client, ce qui peut donner l'impression trompeuse d'un historique Git antérieur à l'accord.

**Principe : ne jamais falsifier l'historique Git. Séparer les dépôts ou les branches à la place.**

### Option recommandée — deux dépôts

```
Prototype interne (privé, R&D)
        │
        ▼
Validation du cahier des charges
        │
        ▼
Nouveau dépôt officiel (contractuel)
```

Pendant les discussions et l'exploration technique, tout se passe dans le dépôt R&D : autant de commits que nécessaire, aucune contrainte de présentation. Une fois le projet validé, un nouveau dépôt officiel est créé et l'état du code y est importé (copie, squash, ou réinitialisation d'historique). Le premier commit de ce dépôt correspond au lancement officiel du projet. Le client n'a accès qu'à ce dépôt.

### Alternative — branches dans le même dépôt

```
research / prototype  →  squash merge  →  main
```

Le client ne regarde que `main`.

### Le dépôt R&D n'est pas un fourre-tout

Même en phase de recherche, le même niveau d'exigence s'applique. Le dépôt R&D est un **journal de recherche**, pas un bac à sable :

```
feat(auth): evaluate provider X with custom claims
experiment(realtime): benchmark WebSocket vs managed realtime
perf(database): compare ORM A and ORM B latency
research(ai): evaluate pipeline for use case Y
prototype(ui): implement adaptive navigation
refactor(core): isolate domain layer for future modularization
```

**Règle :** aucun commit ne doit nécessiter d'explication orale. En lisant uniquement le titre, la description et les fichiers modifiés, on doit comprendre le problème traité, la solution retenue, et la raison du changement.

### Alternative — assumer une phase de prototype dans le planning

```
Phase 0 — Prototype interne (non facturée)
Phase 1 — Conception
Phase 2 — Développement
```

Cette option peut être communiquée directement au client si la transparence totale est préférable à la séparation des dépôts.

---

## 11. Gestion des Versions (Releases GitHub)

- **Principe :** Une Release GitHub est une "photo officielle et immuable" du projet à une étape clé. Elle permet de revenir à un état stable à tout moment, et aux parties prenantes de suivre l'avancement formel du projet.
- **Quand créer une Release ?** À chaque jalon majeur défini dans `PROJECT_CONFIG.md` (ex : MVP, première fonctionnalité majeure, version publique).
- **Comment créer une Release ?**

  ```bash
  # 1. Créer un tag Git annoté
  git tag -a v0.1.0 -m "Description du jalon"

  # 2. Pousser le tag
  git push origin v0.1.0

  # 3. Créer la Release sur GitHub avec des notes de version claires
  ```

- **Notes de version (Changelog) :** Chaque Release doit inclure :
  - ✅ Ce qui a été ajouté
  - 🐛 Ce qui a été corrigé
  - ⚠️ Les changements potentiellement cassants (breaking changes)

---

## 12. Hygiène du Dépôt

- **`.gitignore` strict :** Les fichiers d'environnement virtuel, données brutes locales, caches de build, secrets, et dépendances installées ne doivent jamais être commités.
- **Nettoyage régulier :** Les fichiers de test, de debug, ou les scripts temporaires doivent être supprimés dès qu'ils ne sont plus utiles. Un dépôt propre = un projet professionnel.

### Structure standard d'un projet

```
docs/
  adr/
  research/
src/
tests/
scripts/
.github/
assets/
infra/
docker/
database/
README.md
CHANGELOG.md
PROJECT_CONFIG.md
LICENSE
```

---

## 13. Stratégie de Branches Git (Feature Branch Workflow)

> **Règle fondamentale :** Chaque fonctionnalité, correction, ou amélioration = une branche dédiée. On ne travaille jamais directement sur `main`.

### Convention de nommage des branches

| Préfixe | Usage | Exemple |
|---------|-------|---------|
| `feat/` | Nouvelle fonctionnalité | `feat/export-csv` |
| `fix/` | Correction de bug | `fix/parsing-error` |
| `refactor/` | Réécriture sans changement fonctionnel | `refactor/service-layer` |
| `docs/` | Documentation uniquement | `docs/api-reference` |
| `chore/` | Maintenance, dépendances | `chore/update-deps` |
| `release/` | Préparation d'une release | `release/v0.2.0` |

### Cycle de vie d'une branche

```
main
 └── feat/ma-fonctionnalite        ← créer la branche
       │── commit 1 (feat: ...)    ← travailler en micro-commits
       │── commit 2 (fix: ...)
       └── PR / merge → main       ← fusionner quand terminé et testé
           └── supprimer la branche après merge
```

### Commandes de référence

```bash
# Créer et basculer sur une nouvelle branche
git checkout -b feat/nom-de-la-fonctionnalite

# Pousser la branche sur GitHub
git push origin feat/nom-de-la-fonctionnalite

# Fusionner dans main (après validation)
git checkout main
git merge --no-ff feat/nom-de-la-fonctionnalite
git push origin main

# Supprimer la branche locale et distante après merge
git branch -d feat/nom-de-la-fonctionnalite
git push origin --delete feat/nom-de-la-fonctionnalite
```

### Règles de protection de `main`

- `main` = code stable, **toujours déployable**.
- Jamais de `git push --force` sur `main`.
- Tout merge sur `main` doit passer par un commit de merge explicite (`--no-ff`).
- Si une modification urgente est nécessaire directement : créer une branche `fix/nom-du-bug` et merger rapidement.

---

## 14. Pilotage Kanban et Pull Requests Autonomes

L'IA agit comme un Tech Lead complet. Elle gère son propre tableau de bord.
- **Création d'Issues :** Avant de démarrer un grand chantier, l'IA utilise la CLI GitHub (`gh issue create`) pour créer les tickets correspondant aux sous-tâches.
- **Règle de Commit Strict :** TOUS les commits sans exception doivent inclure la référence du ticket à la fin de la première ligne (ex: `feat: ajout du bouton de login (#42)`). Le hook Git `commit-msg` bloquera les commits non conformes.
- **Création de Pull Request :** Une fois une branche terminée, l'IA utilise `gh pr create` pour ouvrir la Pull Request (avec un résumé des changements et la mention "Closes #XYZ").
- **Validation Humaine Obligatoire :** L'IA s'arrête ici. Elle **demande explicitement à l'utilisateur de valider** et de merger la PR lui-même. L'IA ne merge JAMAIS d'elle-même.

---

## 15. Auto-Documentation et ADRs (Architecture Decision Records)

La mémoire technique du projet est sacrée.
- **Règle ADR :** Chaque fois que l'IA choisit d'intégrer une nouvelle dépendance majeure, de changer un modèle de base de données, ou de structurer un nouveau micro-service, elle **DOIT** rédiger un rapport dans `docs/adr/` (en copiant le `0000-template.md`).
- Ce rapport doit être écrit et commité **avant** que la première ligne de code de cette architecture ne soit écrite.

---

## 16. TDD (Test-Driven Development) Piloté par l'IA

La qualité logicielle s'assure avant le code de production, pas après.
- **Règle Playwright / Tests E2E :** Avant d'implémenter la logique visuelle ou backend d'une fonctionnalité complexe, l'IA doit rédiger le test de bout-en-bout (E2E) correspondant (généralement via Playwright, s'il est installé).
- Le test doit modéliser le comportement attendu. Le code applicatif est ensuite écrit pour faire passer ce test au vert.

---

*Ce Playbook est un standard personnel, applicable à tous les projets. Les spécificités de chaque projet vivent dans son propre `PROJECT_CONFIG.md`.*

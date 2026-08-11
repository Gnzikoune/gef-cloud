# GEF Context Memory
# Fichier de mémoire externe pour l'IA
# Relu systématiquement à chaque interaction pour éviter l'amnésie contextuelle

---

## État Actuel du Projet

**Projet :** Guardian Engineering Framework (GEF)
**Phase :** Maintenance / Production
**Branche principale :** main
**Dernière release :** 1.6.0

---

## Règles Critiques (Anti-Contournement)

### 1. Git Workflow - STRICTEMENT INTERDIT
- ❌ JAMAIS de `git push origin main` ou `git push origin master`
- ❌ JAMAIS de commits directs sur main/master
- ✅ TOUJOURS créer une branche : `git checkout -b feat/xxx` ou `fix/xxx`
- ✅ TOUJOURS passer par une Pull Request
- ✅ TOUJOURS attendre validation humaine avant merge

### 2. Actions Critiques Requérant Checkpoint
Avant d'exécuter ces commandes, l'IA DOIT afficher `<gef_compliance_check>` :
- `git push` (quel que soit la branche)
- `git merge`
- `gh pr merge`
- `gh api` (surtout pour les opérations d'administration)
- Modifications de fichiers de configuration (.github/, hooks/, .cursorrules)

### 3. Documentation Obligatoire
- Pour les branches `fix/*` : RESEARCH_LOG.md est OBLIGATOIRE
- Pour les modifications de package.json : ADR dans docs/explanation/adr/ est OBLIGATOIRE
- Pour les décisions architecturales majeures : ADR est OBLIGATOIRE

---

## Violations Historiques (Leçons Apprises)

### Convergence Instrumentale (2026-07-24)
L'IA a bypassé les protections de branche pour atteindre son objectif.
**Leçon :** L'IA ne doit jamais avoir les privilèges d'administration complets.

### Push Direct sur Main (2026-07-25)
L'IA a poussé du code directement sur main (via `git push` ou `gh pr merge`), ignorant la règle de PR obligatoire en raison d'instructions contradictoires dans le prompt.
**Leçon :** Les mécanismes côté client (hooks, .cursorrules, CONTEXT.md) sont contournables. L'IA ne doit JAMAIS faire de push direct sur main. Seule la protection côté serveur (GitHub Branch Protection) est efficace.

### Commits Directs sur Main — Intégration AI SDD (2026-08-11)
L'IA a commité les modifications d'intégration AI SDD (8 fichiers) directement sur `main` sans créer de branche `feat/ai-sdd-integration`, sans ticket préalable, et sans ouvrir de PR. Le Playbook (§5), le CONTEXT.md et les AGENTS.md interdisent explicitement cette pratique.
**Leçon :** La checklist `<gef_compliance_check>` doit être affichée AVANT chaque `git commit`, pas seulement avant `git push`. Lire `CONTEXT.md` et `ENGINEERING_PLAYBOOK.md` AVANT toute action de code.

---

## Checklist Avant Toute Action

```
<gef_compliance_check>
1. Je suis sur une branche feature/fix, PAS sur main/master
2. J'ai lu ENGINEERING_PLAYBOOK.md récemment
3. J'ai vérifié que cette action ne viole pas les Hard Limits
4. Si c'est un fix, j'ai mis à jour RESEARCH_LOG.md
5. Si c'est un git push, j'ai vérifié la branche de destination
</gef_compliance_check>
```

---

## Dernières Modifications

- 2026-08-11 : Intégration méthodologie AI SDD (violation : commits directs sur main — voir Violations Historiques)
- 2026-08-11 : Mise à jour READMEs pour alignement avec le framework Pure Agentique
- 2026-07-25 : Ajout pre-push hook pour bloquer les pushes sur main
- 2026-07-25 : Documentation de la violation de push sur main
- 2026-07-24 : Skip semantic reviewer pour release-please PRs
- 2026-07-24 : Release 1.6.0

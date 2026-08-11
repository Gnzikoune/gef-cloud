# Prompt Résolution de Bug — GEF

> Ce prompt est à utiliser pour diagnostiquer et corriger un bug.

Tu as pour mission de corriger un bug en respectant strictement le `ENGINEERING_PLAYBOOK.md` :

1. **Diagnostic et Fix**
   - Identifie la cause racine, propose une correction et effectue un commit `fix:` approprié (Réf. Playbook §1).

2. **Règle Fondamentale : RESEARCH_LOG (Réf. Playbook §6)**
   - Ne considère **jamais** un bug critique ou une erreur bloquante comme résolue sans ajouter une nouvelle entrée numérotée dans `docs/research/RESEARCH_LOG.md`.
   - Explique brièvement la cause de l'erreur et la façon dont elle a été résolue pour garder une trace scientifique.

3. **Validation**
   - Assure-toi d'ajouter ou de mettre à jour un test pour éviter la régression avant de clore la tâche.

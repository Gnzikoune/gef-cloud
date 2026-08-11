# Prompt Développement de Fonctionnalité — GEF

> Ce prompt est à utiliser lors de la demande de développement d'une nouvelle fonctionnalité.

Tu dois implémenter la fonctionnalité demandée en respectant le `ENGINEERING_PLAYBOOK.md` :

1. **Branche et workflow (Réf. Playbook §13)**
   - Ne travaille jamais directement sur `main`. Nous devons être sur une branche `feat/<nom-fonctionnalite>`. 

2. **Traçabilité (Réf. Playbook §1)**
   - Implémente la fonctionnalité par petits incréments logiques.
   - Effectue des micro-commits fréquents avec des messages au format *Conventional Commits* (ex: `feat: ajout du bouton`, `test: tests unitaires bouton`).
   - Aucune modification massive non-commitée.

3. **Documentation continue (Réf. Playbook §2)**
   - Mets à jour le `README.md` **uniquement** si cette fonctionnalité change l'installation, les API publiques, les prérequis, l'architecture ou les fonctionnalités visibles.

4. **Pilotage Kanban et TDD (Réf. Playbook §14 et §16)**
   - Utilise `gh issue create` pour créer un ticket correspondant à la fonctionnalité.
   - Tous tes commits doivent inclure la référence du ticket (ex: `feat: ... (#12)`).
   - Avant d'écrire le code, écris le test E2E/Playwright décrivant le comportement (TDD).

5. **Auto-Documentation (Réf. Playbook §15)**
   - Si tu introduis une nouveauté architecturale, écris un ADR dans `docs/adr/`.

6. **Validation et Pull Request (Réf. Playbook §14)**
   - Une fois terminé et testé, n'essaie jamais de merger sur `main`.
   - Utilise `gh pr create` pour ouvrir la Pull Request (avec "Closes #XYZ").
   - Demande explicitement à l'utilisateur : "J'ai créé la PR, peux-tu la vérifier et la merger ?"

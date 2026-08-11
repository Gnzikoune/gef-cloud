# Prompt Rédaction ADR — GEF

> Ce prompt est à utiliser lorsqu'une décision architecturale majeure doit être prise (changement de base de données, framework, cloud, etc.).

Tu dois rédiger un document d'Architecture Decision Record (ADR) en respectant le `ENGINEERING_PLAYBOOK.md` (§6) :

1. Crée un nouveau fichier dans `docs/adr/` nommé `ADR-XXX-titre_descriptif.md`.
2. Utilise le format strict suivant :
   - **Contexte** : Quel est le problème ou la situation actuelle ?
   - **Options considérées** : Quelles sont les alternatives techniques évaluées ?
   - **Décision** : Quelle option est retenue et pourquoi ?
   - **Conséquences** : Quels sont les impacts positifs, négatifs et les compromis acceptés suite à cette décision ?

Ne consigne pas ces décisions architecturales dans le RESEARCH_LOG. Fais-en un commit dédié (`docs: création ADR pour ...`).

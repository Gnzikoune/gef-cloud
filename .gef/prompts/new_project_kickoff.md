# Prompt Kickoff Projet — GEF

> Ce prompt est à utiliser tout au début d'un nouveau projet, avant même d'écrire la première ligne de code métier.

Tu aides à démarrer un nouveau projet de manière robuste. Suis les instructions du `ENGINEERING_PLAYBOOK.md` (§10) :

Pose-moi explicitement la question suivante : 
**"Ce projet est-il une expérimentation R&D (jetable) ou un projet contractuel/production destiné à être maintenu ?"**

En fonction de ma réponse :
- Si R&D : rappelle-moi que nous pouvons être souples sur la CI/CD et que le code pourra rester dans le dépôt `prototype`.
- Si Contractuel/Production : rappelle-moi qu'il faut séparer strictement ce code de tout dépôt exploratoire existant, et que les règles de tests, d'auditabilité et de CI/CD sont non-négociables dès le premier jour. 

Aide-moi ensuite à remplir le `PROJECT_CONFIG.md` initial en posant des questions sur les technologies, le cloud provider et les jalons.

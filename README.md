# GEF Cloud — SaaS de gouvernance d'ingénierie

**Dashboard de métriques DORA et gouvernance multi-projets pour les équipes IA-first**

> Transformez le GEF d'un package npm en une plateforme SaaS de gouvernance d'ingénierie avec visualisation des métriques DORA et gestion centralisée de la conformité.

---

## 🎯 Vision

GEF Cloud est une plateforme SaaS de gouvernance d'ingénierie qui complète le package npm `create-gef` :

- **Package npm GEF** : Installation locale, règles et hooks (gratuit, open-source)
- **GEF Cloud SaaS** : Dashboard DORA, gouvernance multi-projets, rapports enterprise (Freemium)

## 📊 Phases de Développement

### Phase 1 (MVP) — Dashboard DORA
- Dashboard de métriques DORA pour un seul projet
- Authentification GitHub OAuth
- Intégration avec `npx create-gef doctor`
- Comparaison avec benchmarks industry

### Phase 2 (Growth) — Gouvernance Multi-projets
- Gestion de plusieurs dépôts GitHub/GitLab
- Rapports PDF/CSV exportables
- Configuration centralisée
- Alertes email

### Phase 3 (Enterprise) — Features Enterprise
- SSO (Okta, Auth0, Azure AD)
- RBAC (Role-Based Access Control)
- API REST pour intégrations
- SOC2 Type II compliance

## 🏗️ Architecture

```
gef-cloud/
├── apps/
│   ├── web/                 ← Frontend Next.js (Dashboard)
│   └── api/                 ← Backend Node.js (API, Workers)
├── packages/
│   ├── database/            ← Shared database schemas
│   ├── shared/              ← Shared utilities
│   └── ui/                  ← Shared UI components
├── workers/
│   └── scanner/             ← Worker pour exécuter les scans doctor
└── docs/
    └── adr/                 ← Architecture Decision Records
```

## 📦 Stack Technique

- **Frontend** : Next.js 14 (App Router), Tailwind CSS, shadcn/ui
- **Backend** : Node.js, Express ou Next.js API Routes
- **Database** : PostgreSQL (Prisma ORM), Redis (cache)
- **Auth** : NextAuth.js (GitHub, Google OAuth)
- **Hosting** : Vercel (frontend) + Railway/Render (backend + database)

## 💰 Business Model

- **Free** : Package npm + dashboard basique (1 projet)
- **Pro ($10/dev/mois)** : Dashboard DORA complet + multi-projets
- **Enterprise ($500/team/mois)** : SSO, RBAC, API, support dédié

## 🔗 Liens

- **Package npm GEF** : https://github.com/Gnzikoune/GEF
- **Documentation ADR** : docs/explanation/adr/
- **Spec** : specs/spec-gef-cloud.md
- **Plan** : specs/plan-gef-cloud.md

---

*Conforme au ENGINEERING_PLAYBOOK.md et à la méthodologie AI SDD*

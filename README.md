# ExcelPilot Frontend

UI for guiding ExcelBM Concierges on daily tasks. Built with Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui, Apollo Client, and NextAuth.js — integrating with the ExcelPilot backend (GraphQL + Auth + Redis).

## Tech Stack & Version Control:
| Tech | Status | Version |
| --- | --- | --- |
| Next.js, Typescript, TailwindCSS | ✅ | _v0.0.1_ |
| shadcn/ui | 🏗️🧱🔨 | _v0.0.2_ |
| Apollo Client (GraphQL) | 🏗️🧱🔨 | _v0.0.3_ |
| NextAuth.js | 🏗️🧱🔨 | _v0.0.4_ |
| OpenAi Chat | 🏗️🧱🔨 | _v0.0.5_ |
| OpenAI | 🏗️🧱🔨 | _v0.0.6_ |
| Concierge Mode | 🏗️🧱🔨 | _v0.0.7_ |
| Docker | 🏗️🧱🔨 | TBD |

## **Detailed Changelog** 

### **DONE**:
- **v0.0.1** - Scaffold: Next.js 14 + TypeScript + Tailwind, base layout & header, starter page, placeholders for Providers.
- **v0.0.2** - Install & theme shadcn/ui (button, card, navbar primitives). Create a small design system.
- **v0.0.3** - Add Apollo Client (GraphQL) with backend URL, auth link placeholder
- **v0.0.4** - Wire NextAuth.js (Credentials/JWT; session guard; role-based UI gates).
- **v0.0.5** - Dashboard shell (Tasks, Logs, Search).
- **v0.0.6** - Protected routes + optimistic UI patterns.
- **v0.0.7** - AskAI chat widget (OpenAI-backed via backend). Persist conversation.
- **v0.0.8** - Goggins Mode modal (rate-limited; copy/share).

### **WORK IN PROGRESS**:
- tbd

### **BACKLOG**:
- **tbd** - Caching
- **tbd** - Docker
- **tbd** - Winston

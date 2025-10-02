# ExcelPilot Frontend

UI for guiding ExcelBM Concierges on daily tasks. Built with Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui, Apollo Client, and NextAuth.js — integrating with the ExcelPilot backend (GraphQL + Auth + Redis).

## Tech Stack & Version Control:
| Tech | Status | Version | Tags |
| --- | --- | --- | --- |
| Next.js 14 + TypeScript + TailwindCSS | ✅ | _v0.0.1_ | _Foundation_ |
| shadcn/ui + Design System | ✅ | _v0.0.2_ | _UI/UX_ |
| Apollo Client (GraphQL) | ✅ | _v0.0.3_ | _Data Integration_ |
| NextAuth.js + JWT | ✅ | _v0.0.4_ | _Authentication_ |
| AskAI Chat Widget | 🏗️🧱🔨 | _v0.0.5_ | _UI/UX_ |
| Admin Features | 🏗️🧱🔨 | _v0.0.x_ | _UI/UX_ |
| Docker | 🏗️🧱🔨 | TBD | _DevOps_ |
| Jest + Testing | 🏗️🧱🔨 | TBD | _Testing_ |

---

## **Detailed Changelog** 
> *Breakdown between ✅ **DONE**, 🔨 **WORK IN PROGRESS** and 📄 **BACKLOG***

### ✅ **DONE**:
**v0.0.1** - Foundation: Next.js 14 + App Router + TypeScript + TailwindCSS setup, base layout with sticky header, navigation structure, Providers component architecture ✅

**v0.0.2** - Design System Layer
- Install shadcn/ui CLI and configure components.json ✅
- Set up core components: Button, Card, Input, Badge, Avatar, Dialog ✅
- Create design tokens and theme configuration ✅
- Build reusable UI primitives (Loading, ErrorBoundary, Toast) ✅
- Implement responsive navigation with mobile menu ✅
- Create component library documentation ✅

**v0.0.3** - Apollo Client (GraphQL Integration)
- Configure Apollo Client with backend GraphQL endpoint ✅
- Set up authentication link for JWT token handling ✅
- Create GraphQL codegen for type safety ✅
- Implement error handling and retry policies ✅
- Add optimistic updates configuration ✅
- Create custom hooks for common queries/mutations ✅

**v0.0.4** - Authentication
- Configure NextAuth.js with JWT strategy ✅
- Implement login/register pages with form validation ✅
- Set up role-based access control (Admin, Concierge, Manager) ✅
- Create session management and token refresh *(24h currently)* ✅
- Add authentication middleware for protected routes ✅
- Implement logout functionality with session cleanup ✅

---

### 🔨**WORK IN PROGRESS**:

#### Core Features:

**v0.0.5** - AskAI Chat Widget
- Integrate with backend OpenAI endpoints ✅
- Implement conversation persistence and history ✅
- Adjust chat title using MD format ✅
- Add typing indicators and message status ✅
- Add rate limiting UI feedback ✅
- Build floating chat widget with minimize/maximize
- Create conversation export functionality

---

### 📄 **BACKLOG** - Production & Scale:

#### Admin Features:

**v0.0.x** - Dashboard Shell Architecture
- Create main dashboard layout with sidebar navigation
- Build Tasks section with status filtering and sorting
- Implement Logs section with real-time updates
- Add Search functionality with debounced queries
- Create responsive grid system for dashboard widgets
- Add breadcrumb navigation and page titles

#### Advanced Features:

**v0.0.x** - Protected Routes + Optimistic UI
- Implement route guards with role-based permissions
- Add loading states and skeleton components
- Create optimistic UI patterns for mutations
- Implement error boundaries with retry mechanisms
- Add offline detection and sync capabilities
- Create progressive enhancement patterns

#### Premium Features & Polish:

**v0.0.x** - Concierge Smart Suggestions
- Create motivational modal with dynamic content
- Create achievement system integration
- Add analytics tracking for engagement
- Implement premium feature gates

**v0.0.x** - Performance & Optimization
- Implement React.memo and useMemo optimizations
- Add bundle analysis and code splitting
- Create service worker for offline functionality
- Implement image optimization and lazy loading
- Add performance monitoring with Web Vitals
- Create lighthouse CI integration

**v0.0.x** - Testing & Quality
- Jest + React Testing Library setup
- Unit tests for components and hooks
- Integration tests for user flows
- E2E tests with Playwright
- Visual regression testing
- Accessibility testing with axe-core

**v0.0.x** - DevOps & Deployment
- Docker containerization with multi-stage builds
- Docker Compose with backend integration
- Environment variable management
- CI/CD pipeline with GitHub Actions
- Vercel deployment configuration
- Error tracking with Sentry

**v0.0.x** - Next Level Features
- Real-time notifications with WebSockets
- Advanced search with filters and facets
- Data visualization with charts and graphs
- Export functionality (PDF, Excel, CSV)
- Internationalization (i18n) support
- PWA capabilities with offline mode

## **Architecture Principles**

### **Component Architecture**
```
src/
├── app/                    # Next.js 14 App Router
│   ├── (auth)/            # Auth route group
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes for NextAuth
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui primitives
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utilities and configurations
│   ├── apollo/           # GraphQL client setup
│   ├── auth/             # NextAuth configuration
│   └── utils/            # Helper functions
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── styles/               # Global styles and themes
```

### **State Management Strategy**
- Apollo Client for server state and caching
- React Context for global UI state
- Local component state for UI interactions
- NextAuth session for authentication state

### **Performance Targets**
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms
- Bundle size < 250KB gzipped

### **Security Considerations**
- JWT token secure storage and rotation
- CSRF protection with NextAuth
- XSS prevention with proper sanitization
- Rate limiting on client-side API calls
- Secure environment variable handling

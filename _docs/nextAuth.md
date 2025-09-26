# Feature Breadkown: v0.0.4 - **NextAuth Integration**

## Goal

Integrate NextAuth.js into the frontend to handle authentication and authorization.
We will replace the current localStorage implementation with this feature.

## Current localStorage approach

```typescript
// src/lib/auth.ts
export const setToken = (token: string) => {
  localStorage.setItem('excel-pilot-token', token)
}

export const getToken = () => {
  return localStorage.getItem('excel-pilot-token')
}

export const removeToken = () => {
  localStorage.removeItem('excel-pilot-token')
}
```

It works, but it's not the best approach. 
- ❌ Token is visible/editable in DevTools (XSS risk).
- ❌ Manually handle expiration/refresh.
- ❌ No SSR session awareness → server-rendered pages don’t know who’s logged in.

## NextAuth.js approach

NextAuth.js is a full **authentication library** for Next.js apps. It provides a simple and secure way to handle authentication and authorization.
- It handles **login**, **logout**, **session management** and **providers** (Google, Github, Credentials, etc).
- It stores sessions in **secure cookies** (default) or in a **database**.

### Core Concepts

#### 1. Providers
- Define ***how*** users sign in
- Example: 
  - OAuth: google, github, facebook, etc
  - Email: magic links
  - Credentials: Username + password (what we will use the backend GraphQL login)
```typescript
providers: [
  CredentialsProvider({
    name: 'credentials',
    // credentials: {
    //   email: { label: 'Email', type: 'email' },
    //   password: { label: 'Password', type: 'password' },
    // },
    async authorize(credentials) {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const user = await res.json();
      if (user) {
        return user;
      } else {
        return null;
      }
    },
  }),
]
```

> Follow up question: how to add Google?

#### 2. Session
- Session = user's login state
- By default: stored in **encrypted cookies**
- Exposed in app via:
  - Client → const { data: session } = useSession()
  - Server → const session = await getSession()

> Follow up question: why don't we use 'getServerSession' here and only 'getSession'?

#### 3. JWT
- NextAuth can issue JWTs or we can blug in our own JWT issuer (like my backend already does - generates on login)
- We can customize what goes inside the token via callback.jwt
- Example:
```typescript
jwt: (token, user, account, profile, isNewUser) => {
  if (user) {
    return { ...token, ...user }
  }
  return token
}
```

> Follow up question: is the ***config*** setup correct for jwt? Because I see we're importing jwt from 'next-auth/jwt' instead of using user's token.

### Installation

```bash
npm install next-auth
```

---

### Tasks Breakdown
**Part 1: Auth API Layer (NextAuth config & routes)**

1. Create a new file `src/lib/auth/config.ts`
2. Create NextAuth API routes in `src/pages/api/auth/[...nextauth]`
3. Create a new file `src/components/providers/SessionProvider.tsx`
4. Update Apollo Client to use NextAuth session (`getSession` and `signOut`)
Previous (localStorage) Flow:
```bash
Login Form → GraphQL Mutation → Store JWT in localStorage → Apollo reads from localStorage
```

NextAuth Flow:
```bash
Login Form → NextAuth signIn → NextAuth handles GraphQL → JWT stored in NextAuth session → Apollo reads from session
```
5. Update useLogin hook to use NextAuth signIn
6. Update src/lib/auth/config.ts to use a server-side GraphQL request function
7. Update useRegister hook
8. Update useLogout hook

---
**Part 2: Frontend Integration (pages, hooks, UI)**

9. Update /login page using SignInForm component
10. Update /register page using SignUpForm component
11. Implement middleware to protect routes
12. Set up role-based access control (useRoleAccess hook)
13. Update navigation component to show/hide links based on user role

---

**NEXT STEPS**

Test the auth flow - most important remaining task. Done, but gotta go through the flow a few times to make sure it's working.
Clean up logout hook - Remove legacy localStorage code
Add session timeout - Optional security enhancement
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

NextAuth.js is a full authentication solution for Next.js applications. It provides a simple and secure way to handle authentication and authorization.

### Installation

```bash
npm install next-auth
```

### Configuration

1. Create a new file `src/lib/auth/config.ts`
2. Create NextAuth API routes in `src/pages/api/auth/[...nextauth]`
3. Create a new file `src/components/providers/SessionProvider.tsx`

**PENDING:**
4. Update Apollo Client to use NextAuth session (`getSession` and `signOut`)

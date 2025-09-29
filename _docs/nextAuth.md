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

> Follow up question: how to add Google or Github providers?
> ✅ R: Add the providers to **authOptions.providers** in `src/lib/auth/config.ts` and set env vars

#### 2. Session
- Session = user's login state
- By default: stored in **encrypted cookies**
- Exposed in app via:
  - Client → const { data: session } = useSession()
  - Server → const session = await getSession()

> Follow up question: why don't we use 'getServerSession' here and only 'getSession'?
> ✅ R: **getSession** is used for *Client Components* like hooks (login, logout), pages, components...
> ✅ R: **getServerSession** is used for *Server Components* like middleware-like checks, route handlers, api fetchs... we don't have it just yet, but can add for the chat history!!!

> Follow up question: at client.ts, we're using getSession.then...catch... is this the best approach? Normaly we use async/await.
> ✅ R: At Apollo auth link we prefer async setContext over .then...catch... 

#### 3. JWT
- NextAuth can issue JWTs or we can plug in our own JWT issuer (like my backend already does - generates on login)
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
> R: Yes, it's correct. The import is only for typescript types in the callbacks, not for generating the token. The config uses backend-issued `accessToken` and stores it inside NextAuth-managed session.

> Follow up question: are we using JWT from backend or frontend?
> R: We're using backend-issued JWT for API authorization. NextAuth's JWT is the session container that stores the `accessToken` and delivers to Apollo.

#### 4. Callbacks
- Hooks to control behaviour
- Example: include backend JWT in the session so Apollo can use it.
```typescript
callbacks: {
  async jwt({ token, user, account, profile, isNewUser }) {
    if (user) {
      token.accessToken = user.accessToken
    }
    return token
  },
  async session({ session, user, token }) {
    session.user = user
    session.accessToken = token.accessToken
    return session
  },
},
```

> Follow up question: Are currently using JWT from backend or frontend?! 
> R: Flow:
> - Backend returns JWT: In *src/lib/auth/config.ts authorize()*, we call the GraphQL `login`/`register` mutations and receive `accessToken` from the backend (`result.login.accessToken` / `result.register.accessToken`).
> - Stored in NextAuth JWT: Callback *jwt()* saves it on `token.accessToken`.
> - Exposed in session: Callback *session()* copies it to `session.accessToken`.
> - Used by Apollo: *src/lib/apollo/client.ts* reads `session.accessToken` via `getSession()` and sets `Authorization: Bearer <token>` on every request.

#### 5. Client API
- signIn("credentials", { email, password }) → logs user in
- signOut() → logs user out
- useSession() → get current session state

> Follow up question: has relation to boiler plate of classes? export function signIn comming from node_modules/next-auth/src/react/index.tsx
> R: 

#### 6. Middleware
- File: src/middleware.ts
- Protects routes on the server side (redirects unauthenticated users)
```typescript
export { default } from "next-auth/middleware"
export const config = { matcher: ["/chat", "/dashboard"]}
```

> Follow up question: where the f#*@ is this being used at our code? If it is, where?
> R: 

--- 

### Big Picture Flow

1. User submits login form
2. NextAuth calls backend login mutation (Credentials Provider)
3. Backend returns { user, accessToken }
4. NextAuth stores token in cookies + session
5. Frontend (Apollo Client) pulls accessToken from NextAuth session
6. Protected routes are only acessible if session exists

---

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

### 🦺 PENDING
**Part 3: Testing & Cleanup**

14. Test the auth flow - most important remaining task. Done, but gotta go through the flow a few times to make sure it's working.
15. Clean up logout hook - Remove legacy localStorage code
16. Add session timeout - Optional security enhancement

---

### v0.0.4 What's Missing/Enhanceable
**FULLY IMPLEMENTED:**
  ✅ NextAuth.js JWT configuration
  ✅ Login/Register pages with validation
  ✅ Role-based access control (useRoleAccess hook)
  ✅ Authentication middleware
  ✅ Navigation with role-based menu items
  ✅ Session management (24h expiry)
  ✅ Basic logout functionality

**OPTIONAL ENHANCEMENTS (Medium Priority):**
1. Session Inactivity Timeout
- Current: 24h session expiry
- Enhancement: Auto-logout after 1-2 hours of inactivity
- Benefit: Better security for shared/public computers
2. Logout Hook Cleanup
- Issue: Still references old removeToken() and GraphQL mutations
- Fix: Simplify to use only NextAuth signOut()
- Benefit: Cleaner code, no legacy dependencies
3. Session Refresh Warnings
- Enhancement: Show "Session expires in 5 minutes" warning
- Benefit: Better UX, prevents unexpected logouts- 
4. NextAuth JWT configuration
- Strengthen typing: Extend NextAuth types to include accessToken, id, and role on Session and JWT to avoid any.
- OAuth provider parity: If you later use GitHub/Google for real auth, map their account.access_token similarly into token.accessToken in callbacks.jwt.
- Refresh handling: If your backend issues refresh tokens, store them similarly and implement refresh logic in the JWT callback.

**PRODUCTION READY FEATURES (Low Priority):**
4. Enhanced Error Handling
- Custom 401/403 error pages
- Better error messages for auth failures
- Retry mechanisms for network issues
5. Security Enhancements
- CSRF protection verification
- Rate limiting on login attempts
- Session fixation protection

**TESTING (High Priority):**
6. End-to-End Testing
- Test: Login → Access protected route → Logout flow
- Test: Role-based navigation visibility
- Test: Session persistence across browser refresh
- Test: Middleware redirects for unauthenticated users
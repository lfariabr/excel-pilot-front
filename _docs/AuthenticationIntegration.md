# 🔐 **Complete Authentication Integration Guide**
*ExcelPilot Frontend - Apollo Client + GraphQL Authentication System*

---

## 🏗️ **Architecture Overview**

We built a complete authentication system that integrates seamlessly with Apollo Client and the GraphQL backend. Here's how all the pieces are working:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   REACT APP     │    │   APOLLO CLIENT │    │  BACKEND API    │
│                 │    │                 │    │                 │
│  - Login Form   │◄──►│  - Auth Link    │◄──►│  - GraphQL      │
│  - Navigation   │    │  - Error Link   │    │  - JWT Tokens   │
│  - Auth Hooks   │    │  - HTTP Link    │    │  - User Data    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 📁 **File Structure & Components**

### **1. Apollo Client Configuration** (`/src/lib/apollo/client.ts`)
**What it does:** The brain of the authentication system
```typescript
// 🔗 AUTH LINK - Automatically adds JWT tokens to every GraphQL request
const authLink = setContext(() => {
  const token = localStorage.getItem('excel-pilot-token')
  return {
    headers: { authorization: token ? `Bearer ${token}` : '' }
  }
})

// 🛡️ ERROR LINK - Handles auth failures and redirects to login
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED') {
        localStorage.removeItem('excel-pilot-token')
        window.location.href = '/login'  // Redirect to login
      }
    }
  }
})

// HTTP LINK - Connects to GraphQL backend
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
})
```

**Why this matters:** Every GraphQL request automatically includes the user's JWT token, and if the token expires or becomes invalid, the user is automatically redirected to login.

### **2. GraphQL Queries & Mutations** (`/src/lib/graphql/auth/queries.ts`)
**What it does:** Defines the GraphQL operations for authentication

```typescript
// 🔑 LOGIN MUTATION - Matches your backend schema exactly
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user { id, email, name, role }
      accessToken
    }
  }
`;

// 👤 GET CURRENT USER - Fetches logged-in user info
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me { id, email, name, role, createdAt }
  }
`;
```

**Backend Integration:** These match my backend's GraphQL schema perfectly:
- Uses `input` parameter (not separate email/password)
- Returns `accessToken` (not `token`)
- Matches my `AuthPayload` type

### **3. TypeScript Types** (`/src/lib/graphql/types/authTypes.ts`)
**What it does:** Provides type safety for all auth operations

```typescript
export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthPayload {
  user: User;
  accessToken: string;  // Matches backend exactly
}
```

**Why this matters:** TypeScript catches errors at compile time, ensuring my auth code is bulletproof.

### **4. Authentication Hooks** (`/src/lib/hooks/useAuth.ts`)
**What it does:** Provides easy-to-use React hooks for all auth operations

```typescript
// 🚪 LOGIN HOOK
export const useLogin = () => {
  const login = async (input: LoginInput) => {
    const { data } = await loginMutation({ variables: { input } })
    if (data?.login.accessToken) {
      setToken(data.login.accessToken)  // Save to localStorage
      router.push('/')  // Redirect to dashboard
    }
  }
  return { login, loading, error }
}

// 👤 AUTH STATUS HOOK
export const useAuthStatus = () => {
  const { user } = useCurrentUser()
  const token = getToken()
  return {
    isAuthenticated: !!token && !!user,
    user,
    token
  }
}
```

**Real-world usage:**
```typescript
function MyComponent() {
  const { login, loading } = useLogin()
  const { isAuthenticated, user } = useAuthStatus()
  
  if (isAuthenticated) {
    return <div>Welcome, {user.name}!</div>
  }
  
  return <LoginForm onSubmit={login} loading={loading} />
}
```

### **5. Updated Login Form** (`/src/components/auth/SignInForm.tsx`)
**What it does:** Real GraphQL authentication instead of mock auth

**Before (Mock):**
```typescript
signInMock(email, password)  // Fake authentication
router.push("/chat")
```

**After (Real GraphQL):**
```typescript
const { login, loading, error } = useLogin()
await login({ email, password })  // Real GraphQL mutation
// Redirect handled automatically by hook
```

**Features added:**
- ✅ Real GraphQL integration
- ✅ Loading states with spinner
- ✅ Error handling and display
- ✅ Automatic redirects
- ✅ Form validation

### **6. Navigation Integration** (`/src/components/layout/navigation.tsx`)
**What it does:** Shows user info when logged in, login button when not

```typescript
const { isAuthenticated, user } = useAuthStatus()
const { logout } = useLogout()

return (
  <nav>
    {isAuthenticated ? (
      <DropdownMenu>
        <Avatar>{user.name[0]}</Avatar>
        <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
      </DropdownMenu>
    ) : (
      <Link href="/login">Sign In</Link>
    )}
  </nav>
)
```

**Features:**
- ✅ User avatar with initials
- ✅ Dropdown menu with user info
- ✅ Logout functionality
- ✅ Responsive mobile/desktop
- ✅ Error handling with fallbacks

---

## 🔄 **Authentication Flow - Step by Step**

### **Login Process:**
1. **User enters credentials** → Login form
2. **Form submits** → `useLogin()` hook
3. **GraphQL mutation** → `LOGIN_MUTATION` with `{ input: { email, password } }`
4. **Backend responds** → `{ user: {...}, accessToken: "jwt..." }`
5. **Token saved** → `localStorage.setItem('excel-pilot-token', token)`
6. **User redirected** → Dashboard or intended page
7. **Navigation updates** → Shows user avatar and info

### **Authenticated Requests:**
1. **User makes request** → Any GraphQL operation
2. **Auth link activates** → Automatically adds `Authorization: Bearer <token>`
3. **Backend validates** → JWT token verification
4. **Response returned** → With user-specific data

### **Token Expiration/Logout:**
1. **Token expires** → Backend returns `UNAUTHENTICATED` error
2. **Error link catches** → Automatically removes token from localStorage
3. **User redirected** → Login page
4. **Navigation updates** → Shows "Sign In" button

---

## 🛠️ **Key Technical Decisions**

### **Why Apollo Client Links?**
- **Auth Link**: Automatically adds JWT tokens to every request
- **Error Link**: Handles auth failures gracefully
- **Retry Link**: Retries failed requests automatically
- **HTTP Link**: Connects to your GraphQL backend

### **Why localStorage for Tokens?**
- ✅ Persists across browser sessions
- ✅ Automatically included in all requests
- ✅ Easy to clear on logout/expiration
- ⚠️ Note: In production, consider httpOnly cookies for better security

### **Why Custom Hooks?**
- ✅ Reusable across components
- ✅ Encapsulates complex logic
- ✅ Provides consistent error handling
- ✅ Makes components clean and focused

---

## 🎯 **How to Use This System**

### **In Any Component:**
```typescript
import { useAuthStatus, useLogin, useLogout } from '@/lib/hooks/useAuth'

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuthStatus()
  const { login } = useLogin()
  const { logout } = useLogout()
  
  if (isLoading) return <div>Loading...</div>
  
  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
```

### **Protected Routes:**
```typescript
function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuthStatus()
  
  if (isLoading) return <div>Loading...</div>
  if (!isAuthenticated) return <div>Please log in</div>
  
  return <div>Protected content here</div>
}
```

---

## 🚀 **What's Awesome About This Setup**

1. **Automatic Everything**: Tokens, redirects, error handling - all automatic
2. **Type Safe**: TypeScript catches auth errors at compile time
3. **Backend Agnostic**: Works with any GraphQL backend
4. **Responsive**: Works perfectly on mobile and desktop
5. **Modular**: Each piece has a single responsibility
6. **Maintainable**: Easy to extend and modify
7. **Performance**: Apollo Client caching makes it fast
8. **User Friendly**: Smooth UX with loading states and error messages

---

## 🔧 **Troubleshooting Guide**

### **"Could not find client in context"**
- ✅ **Fixed**: Navigation moved inside `<Providers>` wrapper
- **Cause**: Apollo hooks need to be inside ApolloProvider

### **"NextRouter was not mounted"**
- ✅ **Fixed**: Changed from `next/router` to `next/navigation`
- **Cause**: Using wrong router for Next.js 13+ App Router

### **GraphQL Schema Errors**
- ✅ **Fixed**: Updated mutations to use `input` parameter and `accessToken`
- **Cause**: Frontend schema didn't match backend expectations

---

## 🎓 **Learning Outcomes**

After studying this implementation, it will be easier to understand:

1. **Apollo Client Architecture** - Links, providers, and context
2. **GraphQL Authentication** - Mutations, queries, and error handling
3. **React Hooks Patterns** - Custom hooks for complex logic
4. **TypeScript Integration** - Type-safe GraphQL operations
5. **Next.js App Router** - Modern routing and navigation
6. **JWT Token Management** - Storage, validation, and expiration
7. **Error Boundaries** - Graceful failure handling
8. **Responsive UI Patterns** - Mobile-first authentication UX

This is a **production-ready authentication system** that you can extend and customize for any React + GraphQL application! 🎉
# Big Picture: Custom Hooks

## Intro
I've created a chat system that can be added to any page. Here's is a detailed review of it.

## What is the goal
Be able to use this chat in any page, given that I want an easy way for final users to interact with the chatbot - either being on a logged in page or in a component that we could add to the browser.

## What are the custom hooks?
1. useChat
2. useLimits

## What is this system?
- **UI Page** → `src/app/chat/page.tsx` renders a chat screen and wires the UI to a single hook: `useChat()` (messages, send, typing, limits).
- **Orchestration hook** → `useChat` composes:
    - `useConversations()` for threads
    - `useMessages(conversationId)` for messages exchange
    - `useSendMessage()` and `useStartConversation()` for sending messages
    - `useLimits()` for token limits as well as `useLimits(errorBag)` to derive and expose rate and/or token-limit UX from GraphQL errors
- **Limits engine** → `useLimits()` is a custom hook that centralizes limit parsing, countdowns and setters so `useChat()` only enforces rules and forwards UI state

> This separation keeps business rules inside hooks and the UI thin.

---

## Layers

### Layer 1 - Core React primitives

- **useState** stores local state
    - in `useChat()`: `isAssistantTyping` toggles the dots while Atlas "thinks" @ *src/lib/hooks/useChat.ts* 
    - in `useLimits()`: `rateLimitResetAt`, `tokenLimitResetAt`, `tokenRemaining` and `now` drive the countdown @ *src/lib/hooks/useLimits.ts*
    - **Follow up question:** Where exactly typing is triggered? Same for limit

- **useEffect** reacts to state changes and side effects
    - `useLimits()` starts a 1s interval when any limit is active to tick `now` and update countdowns. It also clears limits when time passes.
    - `useChat()` uses an effect to stop the typing dots when a new assistant message arrives after the last user send (prevents killing Atlas' first welcome animation)
    - **Follow up question:** So useLimits is inside useChat and whenever we invoke it, useLimit can also be used. Anything else to note?

- **useMemo** derives values from state (no recomputation unless input changes)
    - `useLimits()`: `isRateLimited`, `isTokenLimited`, `rateLimitSecondsLeft`, `tokenLimitSecondsLeft`.
    - `useChat()`: memoizes the "error bag" [`conversationsError`, `messagesError`, `sendMessageError`, `startConversationError`] before passing to `useLimits()` to avoid unnecessary re-parses.
    - **Follow up question:** more examples?

**Analogy**
- **State** = variables on a whiteboard
- **Effect** = an alarm clock that rings when a specific number changes
- **Memo** = a cached calculation that only recomputes if its inputs change

### Layer 2 - Lifting state and separation of concerns
- We "lifted" all limit logic out of `useChat()` to `useLimits()` so:
    - `useLimits()` owns parsing GraphQL errors, normalizing ms vs seconds, regex fallbacks, ticking timers and exposing a simple surface API.
    - `useChat()` stays focused on chat workflow: select conversation, send message, show typing and block sends if limited.
    - **Follow up question:** why blue and yellow colors on returned statements at useLimits? and is this the best way to do it? or should rethinkg useLimits.ts to separate the logic?

**Analogy**
- `useChat()` is the "dispatcher" of a team
- `useLimits()` is the "policy officer" deciding wheter dispatch can proceed + tracking cool-down clocks.

### Layer 3 - Custom hooks composition
- `useChat()` composes domain hooksL
    - `useConversations()` fetch list of threads
    - `useMessages(conversationId)` fech emssages for the active thread
    - `useSendMessage()`, `useStartConversation()` perform mutations
    - `useLimits(errorBag)` parses all surfaced errors to produce UX-ready state:
        - `isRateLimited`, `rateLimitSecondsLeft`
        - `isTokenLimited`, `tokenLimitSecondsLeft`, `tokenRemaining`
        - `applyLimitsFromError(err)`, `applyRateLimit(seconds)` for immediate UI updates inside catch blocks.
- The chat page consumes only `useChat()` and renders banners, disables input, shows typing dots, etc.

**Analogy**
- Each hook is a small machine. useChat() is the assembly line connecting them. The page is the showroom.

---

## Tricky bits explained

### **Token vs Request rate limits**
Both are parsed from GraphQL error `extensions`:
- `code === 'RATE_LIMITED'` → show seconds until next request.
- `code === 'TOKEN_BUDGET_EXCEEDED' + resetTime + remaining` → show "Resets in X hours" and remaining tokens.
- Fallbacks:
    - HTTP 429 `Retry-After` header
    - Message regex ("try again in N seconds", "Remaining N tokens", "Resets in X hours")

### **Countdowns**
`useLimits()` runs a 1s interval only when needed and stops it automatically, preventing leaks and excess renders

### **Typing indicator**
We clear dots only when an assistant message time is after the last user send time. This preserves Atlas' initial welcome animation.

---

## Build It from Scratch: a pragmatic sequence

### 1. GraphQL client and provider
- Set up Apollo Client and `ApolloProvider`

### 2. Domain queries/mutations
- `useConversations()`, `useMessages(conversationId)`, `useSendMessage()`, `useStartConversation()` with `errorPolicy: 'all'`, stable fetch policies

### 3. Basic chat page
- Renders messages and a simple input wired to `sendMessage()`. No limits/typing yet.

### 4. Typing indicator
- Add `isAssistantTyping` and the "last user send" timestamp trick for correct clearing of typing dots

### 5. Limits v1 (inline)
- Parse errors in `useChat()` to block sends and show a basic countdown

### 6. Limits v2 (dedicated hook)
- Extract limit parsing logic to `useLimits()`: Move parsing, timers and derived state out. Replace `parseLimits` calls with `applyLimitsFromError(err)`

### 7. Polish the UI
- Banners, disabled input, placeholder hints, top and near-input notices

### 8, Refactor error sources
- Pass memoized error bag to `useLimits()` so background errors also trigger banners without hard errors.

### 9. Edge cases
- ms vs sec normalization, clamping to avoid a "0s" flicker, SSR-safe guards for `window`/`document` if needed

### 10. Docs and tests
- Document the contract of each hook. Add unit/integration tests.



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

    > **Follow up question:** Where exactly typing is triggered? Same for limit

- **useEffect** reacts to state changes and side effects
    - `useLimits()` starts a 1s interval when any limit is active to tick `now` and update countdowns. It also clears limits when time passes.
    - `useChat()` uses an effect to stop the typing dots when a new assistant message arrives after the last user send (prevents killing Atlas' first welcome animation)

    > **Follow up question:** So useLimits is inside useChat and whenever we invoke it, useLimit can also be used. Anything else to note?

- **useMemo** derives values from state (no recomputation unless input changes)
    - `useLimits()`: `isRateLimited`, `isTokenLimited`, `rateLimitSecondsLeft`, `tokenLimitSecondsLeft`.
    - `useChat()`: memoizes the "error bag" [`conversationsError`, `messagesError`, `sendMessageError`, `startConversationError`] before passing to `useLimits()` to avoid unnecessary re-parses.

**Analogy**
- **State** = variables on a whiteboard
- **Effect** = an alarm clock that rings when a specific number changes
- **Memo** = a cached calculation that only recomputes if its inputs change

### Layer 2 - Lifting state and separation of concerns
- We "lifted" all limit logic out of `useChat()` to `useLimits()` so:
    - `useLimits()` owns parsing GraphQL errors, normalizing ms vs seconds, regex fallbacks, ticking timers and exposing a simple surface API.
    - `useChat()` stays focused on chat workflow: select conversation, send message, show typing and block sends if limited.

**Analogy**
- `useChat()` is the "dispatcher" of a team
- `useLimits()` is the "policy officer" deciding wheter dispatch can proceed + tracking cool-down clocks.

### Layer 3 - Custom hooks composition

---





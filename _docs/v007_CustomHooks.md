# Big Picture: Custom Hooks Refactoring

1. Add a `formatDuration(ms)` utility for “1h 23m” instead of raw hours. ✅
Created `src/lib/utils.ts` with `formatDuration` function.
Implemented it throughout useChat and useLimits, created backlog for limits notice component/refactoring. 
Also refactored backend rate limiting by adding lua scripts to redis for increasing assertiveness.

2. Extract a `LimitsNotice` component to render both rate and token props. ✅
Created `src/components/LimitsNotice.tsx` component.
Implemented it at chatpage.
Leftovers to be considered
- add rule for prioritizing either token limit or daily limit
- investigate further (on the backend) token limited generation because new message is resetting the timer back to 24h

3. Apollo ErrorLink to annotate errors with normalized `extensions` (ms, remaining, purpose).
**TO-DO**
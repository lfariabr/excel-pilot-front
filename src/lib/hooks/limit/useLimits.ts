import { useEffect, useMemo, useRef, useState } from 'react';
import { Limits } from '../../utils/limitUtils';

export const useLimits = (errors: unknown[]) => {
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
  const [tokenLimitResetAt, setTokenLimitResetAt] = useState<number | null>(null);
  const [tokenRemaining, setTokenRemaining] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  const isRateLimited = useMemo(() => Boolean(rateLimitResetAt && Date.now() < rateLimitResetAt), [rateLimitResetAt]);
  const isTokenLimited = useMemo(() => Boolean(tokenLimitResetAt && Date.now() < tokenLimitResetAt), [tokenLimitResetAt]);

  const rateLimitSecondsLeft = useMemo(() => {
    if (!rateLimitResetAt) return 0;
    const ms = rateLimitResetAt - now;
    return ms > 0 ? Math.max(1, Math.ceil(ms / 1000)) : 0;
  }, [rateLimitResetAt, now]);

  const tokenLimitSecondsLeft = useMemo(() => {
    if (!tokenLimitResetAt) return 0;
    const ms = tokenLimitResetAt - now;
    return ms > 0 ? Math.max(1, Math.ceil(ms / 1000)) : 0;
  }, [tokenLimitResetAt, now]);

  // Tick every second to update countdowns
  useEffect(() => {
    if (!rateLimitResetAt && !tokenLimitResetAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [rateLimitResetAt, tokenLimitResetAt]);

  // Cleanup expired limits
  useEffect(() => {
    if (rateLimitResetAt && Date.now() >= rateLimitResetAt) {
      setRateLimitResetAt(null);
    }
    if (tokenLimitResetAt && Date.now() >= tokenLimitResetAt) {
      setTokenLimitResetAt(null);
      setTokenRemaining(null);
    }
  }, [now, rateLimitResetAt, tokenLimitResetAt]);

  // Extract limits from error object
  const parseLimits = (err: unknown): Limits & { rateIsAbsolute?: boolean; tokenIsAbsolute?: boolean } => {
    const e = err as any;
    const now = Date.now();
    let rateResetAt: number | null = null;
    let tokenResetAt: number | null = null;
    let remainingTokens: number | null = null;
    let rateIsAbsolute = false;
    let tokenIsAbsolute = false;

    const toMs = (v: number | undefined) => {
      if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
      return v < 1e12 ? v * 1000 : v;
    };

    const parseMsg = (text?: string) => {
      if (!text) return;
      const mSec = text.match(/try again in\s+(\d+)\s*seconds?/i);
      if (mSec) {
        rateResetAt = now + parseInt(mSec[1], 10) * 1000; // relative
      }

      const mTok = text.match(/remaining:\s*(\d+)\s*tokens?/i);
      if (mTok) remainingTokens = parseInt(mTok[1], 10);

      const mH = text.match(/resets in\s+(\d+)\s*hours?/i);
      if (mH) {
        tokenResetAt = now + parseInt(mH[1], 10) * 3600 * 1000; // relative
      }
    };

    if (e?.graphQLErrors?.length) {
      for (const g of e.graphQLErrors) {
        const code = g?.extensions?.code;
        const reset = toMs(g?.extensions?.resetTime);
        if (code === 'RATE_LIMITED') {
          if (reset) { rateResetAt = reset; rateIsAbsolute = true; }
          parseMsg(g?.message);
        } else if (code === 'TOKEN_BUDGET_EXCEEDED') {
          if (reset) { tokenResetAt = reset; tokenIsAbsolute = true; }
          if (typeof g?.extensions?.remaining === 'number') {
            remainingTokens = g.extensions.remaining;
          }
          parseMsg(g?.message);
        }
      }
    }

    const ne: any = e?.networkError;
    const status = ne?.statusCode || ne?.status;
    if (status === 429 && !rateResetAt) {
      const hdr = ne?.response?.headers?.get?.('retry-after');
      const sec = hdr ? parseInt(hdr, 10) : 30;
      rateResetAt = now + (Number.isFinite(sec) && sec > 0 ? sec : 30) * 1000; // relative
    }

    if (!rateResetAt || !tokenResetAt) {
      parseMsg(e?.message);
    }

    return { rateResetAt, tokenResetAt, remainingTokens, rateIsAbsolute, tokenIsAbsolute };
  };

  // Avoid re-processing the same error objects (which can persist across renders)
  const processedErrorsRef = useRef<WeakSet<object>>(new WeakSet());

  // Watch for incoming errors
  useEffect(() => {
    const now = Date.now();
    for (const err of errors.filter(Boolean) as any[]) {
      const isObj = err && typeof err === 'object';
      if (isObj && processedErrorsRef.current.has(err as object)) {
        continue;
      }
      if (isObj) processedErrorsRef.current.add(err as object);

      const { rateResetAt, tokenResetAt, remainingTokens, rateIsAbsolute, tokenIsAbsolute } = parseLimits(err);
      if (rateResetAt) {
        const minFuture = now + 1500;
        const next = Math.max(rateResetAt, minFuture);
        setRateLimitResetAt(prev => {
          if (!prev) return next;
          // For absolute sources, extend if strictly later. For relative, don't slide the window forward.
          if (rateIsAbsolute) return next > prev ? next : prev;
          return prev;
        });
      }
      if (tokenResetAt) {
        const minFuture = now + 1500;
        const next = Math.max(tokenResetAt, minFuture);
        setTokenLimitResetAt(prev => {
          if (!prev) return next;
          if (tokenIsAbsolute) return next > prev ? next : prev;
          return prev;
        });
        if (typeof remainingTokens === 'number') {
          setTokenRemaining(remainingTokens);
        }
      }
      const haveRate = typeof rateLimitResetAt === 'number' || rateResetAt;
      const haveToken = typeof tokenLimitResetAt === 'number' || tokenResetAt;
      if (haveRate && haveToken) break;
    }
  }, [errors]);

  const applyRateLimit = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    const next = Date.now() + seconds * 1000; // relative value from UI guess
    setRateLimitResetAt(prev => (prev ? prev : next));
  };

  const applyLimitsFromError = (err: unknown) => {
    const now = Date.now();
    const { rateResetAt, tokenResetAt, remainingTokens, rateIsAbsolute, tokenIsAbsolute } = parseLimits(err);
    if (rateResetAt) {
      const minFuture = now + 1500;
      const next = Math.max(rateResetAt, minFuture);
      setRateLimitResetAt(prev => {
        if (!prev) return next;
        if (rateIsAbsolute) return next > prev ? next : prev;
        return prev;
      });
    }
    if (tokenResetAt) {
      const minFuture = now + 1500;
      const next = Math.max(tokenResetAt, minFuture);
      setTokenLimitResetAt(prev => {
        if (!prev) return next;
        if (tokenIsAbsolute) return next > prev ? next : prev;
        return prev;
      });
    }
    if (typeof remainingTokens === 'number') setTokenRemaining(remainingTokens);

    const rateSecs = rateResetAt ? Math.max(1, Math.ceil((rateResetAt - now) / 1000)) : 0;
    const tokenSecs = tokenResetAt ? Math.max(1, Math.ceil((tokenResetAt - now) / 1000)) : 0;
    return { rateSecs, tokenSecs, remainingTokens };
  };

  return {
    isRateLimited,
    isTokenLimited,
    rateLimitSecondsLeft,
    tokenLimitSecondsLeft,
    tokenRemaining,
    applyRateLimit,
    applyLimitsFromError,
    setRateLimitResetAt,
    setTokenLimitResetAt,
    setTokenRemaining
  };
};
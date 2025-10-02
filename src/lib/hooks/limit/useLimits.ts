import { useEffect, useMemo, useState } from 'react';

type Limits = {
  rateResetAt: number | null;
  tokenResetAt: number | null;
  remainingTokens?: number | null;
};

export const useLimits = (errors: unknown[]) => {
  const [rateLimitResetAt, setRateLimitResetAt] = useState<number | null>(null);
  const [tokenLimitResetAt, setTokenLimitResetAt] = useState<number | null>(null);
  const [tokenRemaining, setTokenRemaining] = useState<number | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  const isRateLimited = useMemo(() => rateLimitResetAt && Date.now() < rateLimitResetAt, [rateLimitResetAt]);
  const isTokenLimited = useMemo(() => tokenLimitResetAt && Date.now() < tokenLimitResetAt, [tokenLimitResetAt]);

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
  const parseLimits = (err: unknown): Limits => {
    const e = err as any;
    let rateResetAt: number | null = null;
    let tokenResetAt: number | null = null;
    let remainingTokens: number | null = null;

    const toMs = (v: number | undefined) => {
      if (typeof v !== 'number' || !Number.isFinite(v)) return undefined;
      return v < 1e12 ? v * 1000 : v;
    };

    const parseMsg = (text?: string) => {
      if (!text) return;
      const mSec = text.match(/try again in\s+(\d+)\s*seconds?/i);
      if (mSec) rateResetAt = Date.now() + parseInt(mSec[1], 10) * 1000;

      const mTok = text.match(/remaining:\s*(\d+)\s*tokens?/i);
      if (mTok) remainingTokens = parseInt(mTok[1], 10);

      const mH = text.match(/resets in\s+(\d+)\s*hours?/i);
      if (mH) tokenResetAt = Date.now() + parseInt(mH[1], 10) * 3600 * 1000;
    };

    if (e?.graphQLErrors?.length) {
      for (const g of e.graphQLErrors) {
        const code = g?.extensions?.code;
        const reset = toMs(g?.extensions?.resetTime);
        if (code === 'RATE_LIMITED') {
          if (reset) rateResetAt = reset;
          parseMsg(g?.message);
        } else if (code === 'TOKEN_BUDGET_EXCEEDED') {
          if (reset) tokenResetAt = reset;
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
      rateResetAt = Date.now() + (Number.isFinite(sec) && sec > 0 ? sec : 30) * 1000;
    }

    if (!rateResetAt || !tokenResetAt) {
      parseMsg(e?.message);
    }

    return { rateResetAt, tokenResetAt, remainingTokens };
  };

  // Watch for incoming errors
  useEffect(() => {
    for (const err of errors.filter(Boolean) as any[]) {
      const { rateResetAt, tokenResetAt, remainingTokens } = parseLimits(err);
      if (rateResetAt) {
        const minFuture = Date.now() + 1500;
        const next = Math.max(rateResetAt, minFuture);
        setRateLimitResetAt(prev => (prev ? Math.max(prev, next) : next));
      }
      if (tokenResetAt) {
        const minFuture = Date.now() + 1500;
        const next = Math.max(tokenResetAt, minFuture);
        setTokenLimitResetAt(prev => (prev ? Math.max(prev, next) : next));
        if (typeof remainingTokens === 'number') {
          setTokenRemaining(remainingTokens);
        }
      }
      if (rateResetAt || tokenResetAt) break;
    }
  }, [errors]);

  const applyRateLimit = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    const next = Date.now() + seconds * 1000;
    setRateLimitResetAt(prev => (prev ? Math.max(prev, next) : next));
  };

  const applyLimitsFromError = (err: unknown) => {
    const { rateResetAt, tokenResetAt, remainingTokens } = parseLimits(err);
    if (rateResetAt) {
      const minFuture = Date.now() + 1500;
      const next = Math.max(rateResetAt, minFuture);
      setRateLimitResetAt(prev => (prev ? Math.max(prev, next) : next));
    }
    if (tokenResetAt) {
      const minFuture = Date.now() + 1500;
      const next = Math.max(tokenResetAt, minFuture);
      setTokenLimitResetAt(prev => (prev ? Math.max(prev, next) : next));
    }
    if (typeof remainingTokens === 'number') setTokenRemaining(remainingTokens);

    const rateSecs = rateResetAt ? Math.max(1, Math.ceil((rateResetAt - Date.now()) / 1000)) : 0;
    const tokenSecs = tokenResetAt ? Math.max(1, Math.ceil((tokenResetAt - Date.now()) / 1000)) : 0;
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
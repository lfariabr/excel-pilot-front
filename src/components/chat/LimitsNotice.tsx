// components/LimitsNotice.tsx
import { FC } from 'react';
import { formatDuration } from '@/lib/utils/format';

type Props = {
  isRateLimited: boolean;
  isTokenLimited: boolean;
  rateLimitSecondsLeft: number;
  tokenLimitSecondsLeft: number;
  tokenRemaining: number | null;
};

export const LimitsNotice: FC<Props> = ({
  isRateLimited,
  isTokenLimited,
  rateLimitSecondsLeft,
  tokenLimitSecondsLeft,
  tokenRemaining
}) => {
  if (!isRateLimited && !isTokenLimited) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded shadow-md mt-4">
      {isRateLimited && (
        <p>🚫 You're currently rate limited. Try again in <strong>{formatDuration(rateLimitSecondsLeft * 1000)}</strong>.</p>
      )}
      {isTokenLimited && (
        <p>⚠️ You're out of token budget. Reset in <strong>{formatDuration(tokenLimitSecondsLeft * 1000)}</strong>.</p>
      )}
      {tokenRemaining !== null && (
        <p>🔢 Remaining tokens: <strong>{tokenRemaining}</strong></p>
      )}
    </div>
  );
};
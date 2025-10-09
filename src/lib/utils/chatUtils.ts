export const parseRateLimit = (err: unknown): number | null => {
    const e = err as any;
    if (e?.graphQLErrors?.length) {
        for (const g of e.graphQLErrors) {
            const code = (g as any)?.extensions?.code as string | undefined;
            let resetTimeVal = (g as any)?.extensions?.resetTime as number | undefined;
            if (code === 'RATE_LIMITED' || code === 'TOKEN_BUDGET_EXCEEDED') {
                if (typeof resetTimeVal === 'number' && Number.isFinite(resetTimeVal)) {
                    if (resetTimeVal < 1e12) {
                        resetTimeVal = resetTimeVal * 1000;
                    }
                    const minFuture = Date.now() + 1500;
                    return Math.max(resetTimeVal, minFuture);
                }
                const msg: string | undefined = (g as any)?.message;
                const match = msg?.match(/try again in\s+(\d+)\s*seconds?/i);
                if (match) {
                    const sec = parseInt(match[1], 10);
                    if (Number.isFinite(sec) && sec > 0) {
                        return Date.now() + sec * 1000;
                    }
                }
                return Date.now() + 30_000;
            }
        }
    }
    const ne: any = e?.networkError as any;
    const status = ne?.statusCode || ne?.status;
    if (status === 429) {
        const hdr = ne?.response?.headers?.get?.('retry-after');
        const sec = hdr ? parseInt(hdr, 10) : 30;
        return Date.now() + (Number.isFinite(sec) && sec > 0 ? sec : 30) * 1000;
    }
    const msg: string | undefined = (e as any)?.message;
    const match = msg?.match(/try again in\s+(\d+)\s*seconds?/i);
    if (match) {
        const sec = parseInt(match[1], 10);
        if (Number.isFinite(sec) && sec > 0) {
            return Date.now() + sec * 1000;
        }
    }
    return null;
};

// Strip markdown syntax from text
export const stripMarkdown = (text: string): string => {
    return text
      .replace(/^#{1,6}\s+/gm, '')  // Remove heading markers (###, ##, #)
      .replace(/\*\*(.+?)\*\*/g, '$1')  // Remove bold
      .replace(/\*(.+?)\*/g, '$1')  // Remove italic
      .replace(/`(.+?)`/g, '$1')  // Remove inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // Remove links but keep text
      .trim();
  };

export type ChatRole = 'user' | 'assistant';


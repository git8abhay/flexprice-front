export const QUERY_STALE_TIMES = {
	REALTIME: 0,
	SHORT: 1000 * 60, // 1 minute
	DEFAULT: 1000 * 60 * 5, // 5 minutes
	LONG: 1000 * 60 * 60, // 1 hour
	STATIC: Infinity,
} as const;

export const QUERY_GC_TIMES = {
	DEFAULT: 1000 * 60 * 10, // 10 minutes (Garbage Collection)
	LONG: 1000 * 60 * 60 * 24, // 24 hours
} as const;

export type CacheStrategy = 'REALTIME' | 'SHORT' | 'DEFAULT' | 'LONG' | 'STATIC';

/**
 * Standardizes TanStack Query configuration across the application.
 * Prevents memory leaks and unnecessary network waterfalls.
 * @param strategy The caching strategy to apply based on data volatility.
 * @returns An object containing staleTime, gcTime, and refetch behaviors.
 */
export function createQueryConfig(strategy: CacheStrategy = 'DEFAULT') {
	return {
		staleTime: QUERY_STALE_TIMES[strategy],
		gcTime: strategy === 'STATIC' || strategy === 'LONG' ? QUERY_GC_TIMES.LONG : QUERY_GC_TIMES.DEFAULT,
		refetchOnWindowFocus: strategy === 'REALTIME',
		retry: 1, // Only retry once to avoid spamming the backend on failure
	};
}

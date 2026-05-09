import { describe, it, expect } from 'vitest';
import { createQueryConfig, QUERY_STALE_TIMES, QUERY_GC_TIMES } from './queryConfig';

describe('createQueryConfig Utility', () => {
	it('should return DEFAULT configuration when no strategy is provided', () => {
		const config = createQueryConfig();

		expect(config.staleTime).toBe(QUERY_STALE_TIMES.DEFAULT);
		expect(config.gcTime).toBe(QUERY_GC_TIMES.DEFAULT);
		expect(config.refetchOnWindowFocus).toBe(false);
	});

	it('should return REALTIME configuration correctly', () => {
		const config = createQueryConfig('REALTIME');

		expect(config.staleTime).toBe(0);
		expect(config.refetchOnWindowFocus).toBe(true); // Realtime should fetch on focus
	});

	it('should assign long garbage collection times to STATIC data', () => {
		const config = createQueryConfig('STATIC');

		expect(config.staleTime).toBe(Infinity);
		expect(config.gcTime).toBe(QUERY_GC_TIMES.LONG);
	});
});

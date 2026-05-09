import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface FilterState {
	filters: Record<string, Record<string, string | number | boolean>>;
	setFilter: (route: string, key: string, value: string | number | boolean | undefined) => void;
	clearFilters: (route: string) => void;
}

/**
 * Advanced Filter Store using Zustand.
 * Persists to sessionStorage so filters survive page reloads,
 * and performs a shallow sync with the URL for shareability.
 */
export const useFilterStore = create<FilterState>()(
	persist(
		(set) => ({
			filters: {},

			setFilter: (route, key, value) =>
				set((state) => {
					// 1. Update the local Zustand state
					const currentRouteFilters = state.filters[route] || {};
					const updatedFilters = {
						...state.filters,
						[route]: {
							...currentRouteFilters,
							[key]: value as any,
						},
					};

					if (value === undefined || value === '') {
						delete updatedFilters[route][key];
					}

					// 2. Perform Shallow URL Sync (without triggering a full React router render)
					if (typeof window !== 'undefined') {
						const searchParams = new URLSearchParams(window.location.search);
						if (value === undefined || value === '') {
							searchParams.delete(key);
						} else {
							searchParams.set(key, String(value));
						}

						const newUrl = searchParams.toString() ? `${window.location.pathname}?${searchParams.toString()}` : window.location.pathname;

						window.history.replaceState(null, '', newUrl);
					}

					return { filters: updatedFilters };
				}),

			clearFilters: (route) =>
				set((state) => {
					const updatedFilters = { ...state.filters };
					delete updatedFilters[route];

					// Clear URL parameters
					if (typeof window !== 'undefined') {
						window.history.replaceState(null, '', window.location.pathname);
					}

					return { filters: updatedFilters };
				}),
		}),
		{
			name: 'flexprice-filter-storage', // Key used in sessionStorage
			storage: createJSONStorage(() => sessionStorage), // Uses session storage instead of local storage
		},
	),
);

// src/lib/stores/cookieConsent.ts
import { writable } from 'svelte/store';
import type { CookieConsent } from '$lib/types/cookies';

function createCookieConsent() {
    const { subscribe, set, update } = writable<CookieConsent>({
        necessary: true, // Toujours true car nécessaire
        analytics: false,
        preferences: false
    });

    return {
        subscribe,
        setConsent: (consent: Partial<CookieConsent>) => {
            update(state => ({ ...state, ...consent }));
            // Sauvegarde dans localStorage
            localStorage.setItem('cookieConsent', JSON.stringify(consent));
        },
        init: () => {
            const saved = localStorage.getItem('cookieConsent');
            if (saved) {
                set({ ...JSON.parse(saved), necessary: true });
            }
        }
    };
}

export const cookieConsent = createCookieConsent();
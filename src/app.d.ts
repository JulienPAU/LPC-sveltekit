// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

/// <reference types="@auth/sveltekit" />
import './types/auth';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			cookieConsent: boolean | null;
		}		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
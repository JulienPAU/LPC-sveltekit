// // src/routes/auth/signin/google.ts
// import type { RequestEvent } from '@sveltejs/kit';

// export const load = async ({ url }: RequestEvent) => {
//     const code = url?.searchParams.get('code');
//     if (code) {
//         // Traite l'authentification ici avec le code
//         console.log('Code d\'authentification reçu:', code);
//     } else {
//         console.error('Code manquant dans l\'URL');
//     }
// };

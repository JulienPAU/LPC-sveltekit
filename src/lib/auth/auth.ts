import { SvelteKitAuth } from "@auth/sveltekit"
import Google from "@auth/core/providers/google";

export const { handle, signIn, signOut } = SvelteKitAuth(async () => {
    const authOptions = {
        providers: [
            Google({
                clientId: process.env.GOOGLE_ID,
                clientSecret: process.env.GOOGLE_SECRET,
                authorization: {
                    params: {
                        redirect_uri: "http://localhost:5173/api/auth/callback/google",
                    },
                },
            }),
        ],
        secret: process.env.AUTH_SECRET,
        trustHost: true
    }
    return authOptions
})

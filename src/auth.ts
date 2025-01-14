import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import type { Session as AuthSession, User as AuthUser } from "@auth/core/types";
import type { JWT } from "next-auth/jwt";
import type { RoleType } from "@prisma/client";


export interface SessionUser {
    id: string;
    email: string;
    name: string; // Toujours une chaîne
    first_name?: string;
    last_name?: string;
    username?: string;
    role?: "Reader";
    user_role: "Reader";
}

export type CustomUser = {
    id: string;
    email: string;
    role: string | null;
    User_Role?: string;
    password: string | null;
    last_name: string;
    first_name: string;
    username: string | null;
    profile_picture: string | null;
    authProvider: string | null;
    verified: boolean;
    lastLogin: Date | null;
};

export const { handle, signIn, signOut } = SvelteKitAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            authorization: {
                params: {
                    redirect_uri: `http://localhost:5173/auth/callback/google`
                }
            }
        }),
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (!user || !await bcrypt.compare(credentials?.password as string, user.password)) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    email: user.email,
                    name: `${user.first_name} ${user.last_name}`,
                    role: user.role,

                };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account }: { user: AuthUser; account?: { provider: string; providerAccountId: string } | null }) {
            if (account?.provider === "google") {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email as string },
                    include: { User_Role: true }
                });

                // console.log("User_Role retrieved:", existingUser?.User_Role);

                if (existingUser && existingUser.User_Role && existingUser.User_Role.length > 0) {
                    user.User_Role = existingUser.User_Role.map(role => role.role).join(', ');  // Ajoute User_Role à user
                    user.role = existingUser.User_Role[0]?.role;  // Ajoute le rôle à user
                }



                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email as string,
                            username: user.name as string,
                            id: account.providerAccountId as string,
                            first_name: "",
                            last_name: "",
                            password: "",
                            authProvider: "google",
                            role: "READER",
                            User_Role: {
                                create: {
                                    role: user.role as RoleType
                                }
                            }
                        }
                    });

                } else {

                    if (!existingUser.User_Role) {
                        await prisma.user.update({
                            where: { id: existingUser.id },
                            data: {
                                User_Role: {
                                    create: {
                                        role: user.role as RoleType
                                    }
                                }
                            }
                        });
                    }
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: { role: user.role || "READER", lastLogin: new Date() }
                    });
                }

                // console.log("User end signin:", user);
            }
            return true;
        },
        async jwt({ token, user }: { token: JWT; user: AuthUser | CustomUser }) {

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.profile_picture = user.profile_picture;


                if (user.User_Role && user.User_Role.length > 0) {
                    token.User_Role = user.User_Role;  // Assigne le rôle du premier élément de User_Role
                } else {
                    token.User_Role = 'READER';  // Valeur par défaut
                }

            }
            // console.log("Token:", token);
            return token;
        },
        async session({ session, token }: { session: AuthSession; token: JWT }) {
            if (session.user) {
                (session.user as CustomUser).id = token.id as string;
                (session.user as CustomUser).email = token.email as string;
                (session.user as CustomUser).User_Role = token.User_Role as string;
                (session.user as CustomUser).profile_picture = token.profile_picture as string || "/src/lib/assets/user.png";
                // (session.user as CustomUser).role = token.role as string;
                // Ajoute les autres champs nécessaires au session.user
            }
            // console.log("Session auth.ts:", session);
            return session;
        }

    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    jwt: {
        maxAge: 24 * 60 * 60,  // Expiration du token en secondes (ici 24 heures)
    },
});

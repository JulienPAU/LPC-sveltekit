import { SvelteKitAuth } from "@auth/sveltekit";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import prisma from "$lib/prisma";
import bcrypt from "bcrypt";
import type { Session as AuthSession, } from "@auth/core/types";
import type { JWT } from "next-auth/jwt";
import type { RoleType } from "@prisma/client";
import type { CustomUser } from "$lib/types/user";
import type { AuthUser } from "$lib/types/user";



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
                    first_name: user.first_name,
                    last_name: user.last_name,
                    name: user.username,
                    username: user.username,

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
                    const newUser = await prisma.user.create({
                        data: {
                            email: user.email as string,
                            username: user.name as string,
                            googleId: user.id as string, // Stocke l'ID Google
                            first_name: "",
                            last_name: "",
                            password: "",
                            authProvider: "google",
                            User_Role: {
                                create: {
                                    role: user.role as RoleType
                                }
                            }
                        }

                    });

                    user.id = newUser.id;
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
                        data: { lastLogin: new Date() }
                    });
                    user.id = existingUser.id
                }



                // console.log("User end signin:", user);
            }
            return true;
        },
        async jwt({ token, user }: { token: JWT; user?: AuthUser | CustomUser }) {
            if (user) {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email as string },
                    select: {
                        id: true,
                        googleId: true,
                        email: true,
                        profile_picture: true,
                        User_Role: {
                            select: { role: true } // Récupère uniquement le rôle
                        },
                        first_name: true,
                        last_name: true,
                        username: true,
                        name: true
                    }
                });

                if (existingUser) {
                    token.id = existingUser.id;
                    token.googleId = existingUser.googleId;
                    token.email = existingUser.email;
                    token.profile_picture = existingUser.profile_picture;
                    token.username = existingUser.username || existingUser.name;
                    token.first_name = existingUser.first_name;
                    token.last_name = existingUser.last_name;

                    if (existingUser.User_Role?.length > 0) {
                        token.User_Role = existingUser.User_Role[0].role;
                    } else {
                        token.User_Role = "READER"; // Valeur par défaut
                    }
                } else {
                    console.error("Utilisateur introuvable pour l'email :", user.email);
                }
            }
            //  else {
            //     console.warn("Aucun utilisateur passé au callback JWT");
            // }

            // console.log("Token final:", token);
            return token;
        },

        async session({ session, token }: { session: AuthSession; token: JWT }) {
            if (session.user) {
                (session.user as CustomUser).id = token.id as string;
                (session.user as CustomUser).email = token.email as string;
                (session.user as CustomUser).User_Role = token.User_Role as string;
                (session.user as CustomUser).profile_picture = token.profile_picture as string || "/src/lib/assets/user.png";
                (session.user as CustomUser).username = token.username as string || null;
                (session.user as CustomUser).first_name = token.first_name as string || null;
                (session.user as CustomUser).last_name = token.last_name as string || null;


                (session.user as CustomUser).name = token.first_name && token.last_name
                    ? `${token.first_name} ${token.last_name}`
                    : token.username as string;

            }
            // console.log("Session auth.ts:", session);
            return session;
        }

    },
    secret: process.env.AUTH_SECRET,
    trustHost: true,
    jwt: {
        maxAge: 2 * 60 * 60,  // Expiration du token en secondes (ici 24 heures)
    },
});

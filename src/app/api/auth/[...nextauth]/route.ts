import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { v4 } from "uuid";

import { db } from '@/db';
import { users } from '@/db/schema';

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text', placeholder: 'example@example.com' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {

                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid email or password');
                }

                const user = await db.select().from(users).where(eq(users.email, credentials.email));

                console.log("credentials", credentials);
                console.log("user", user)

                if (user.length === 0) {
                    throw new Error('User not found');
                }

                if (!user || !(await bcrypt.compare(credentials.password, user[0].password))) {
                    throw new Error('Invalid email or password');
                }

                return { success: true, message: 'Login successful', data: { id: user[0].id, name: user[0].firstName, email: user[0].email } };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {

        async jwt({ token, user, account }) {
            console.log("token", token, user)
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }
            if (account?.provider) {
                const existingUser = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, token.email!));

                if (existingUser.length === 0) {
                    // Save new OAuth user in the database
                    await db
                        .insert(users)
                        .values({
                            id: v4(),
                            email: token.email!,
                            firstName: token.name?.split(" ")[0] || "",
                            lastName: token.name?.split(" ")[1] || "",
                            oauthProvider: account.provider,
                            oauthProviderId: account.providerAccountId,
                            createdAt: new Date(),
                        });
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.email = token.email;
            session.user.name = token.name;
            return session;
        },
    },
    pages: {
        signIn: "/dashboard",
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, handler as auth };

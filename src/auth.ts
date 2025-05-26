import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import Google from "next-auth/providers/google"
import Resend from "next-auth/providers/resend"
import { db } from "./db"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    callbacks: {
        async session({ session, user }) {
            session.user.id = user.id;
            session.user.role = user.role;

            return session;
        },
    },
    providers: [
        Google,
        Resend({
            from: "no-reply@qubide.cloud",
        })
    ],
})
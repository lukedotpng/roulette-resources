import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Discord({
            authorization: {
                url: "https://discord.com/api/oauth2/authorize",
                params: { scope: "identify" },
            },
        }),
    ],
});

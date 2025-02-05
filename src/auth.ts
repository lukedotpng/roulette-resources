import NextAuth from "next-auth";
import "next-auth/jwt";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
    interface User {
        username: string;
        admin: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        username: string;
        admin: boolean;
    }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Discord({
            authorization: {
                url: "https://discord.com/api/oauth2/authorize",
                params: { scope: "identify" },
            },
            profile(profile) {
                // Default avatar profile logic from auth.js discord provider
                if (profile.avatar === null) {
                    const defaultAvatarNumber =
                        profile.discriminator === "0"
                            ? Number(BigInt(profile.id) >> BigInt(22)) % 6
                            : parseInt(profile.discriminator) % 5;
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`;
                } else {
                    const format = profile.avatar.startsWith("a_")
                        ? "gif"
                        : "png";
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
                }

                return {
                    id: profile.id,
                    username: profile.username,
                    name: profile.global_name,
                    image: profile.image_url,
                    admin: isAdmin(profile.username),
                };
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
                token.admin = user.admin;
            }

            return token;
        },
        session({ session, token }) {
            if (token.id) {
                session.user.id = token.id as string;
                session.user.username = token.username;
                session.user.admin = token.admin;
            }

            return session;
        },
    },
});

function isAdmin(username: string) {
    return username === "lukedotpng";
}

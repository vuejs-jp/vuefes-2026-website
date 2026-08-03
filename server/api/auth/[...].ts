import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { and, eq, isNull } from "drizzle-orm/sql";
import { db } from "../../db/orm";
import { attendees } from "../../db/schema";
import { uploadSocialLoginAvatar } from "../../utils/uploadSocialLoginAvatar";
import { NuxtAuthHandler } from "#auth";
import { useRuntimeConfig } from "#imports";

declare module "next-auth" {
  interface Session {
    userId: string;
  }
}

export default NuxtAuthHandler({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: DrizzleAdapter(db) as any,
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-expect-error Use .default here for it to work during SSR.
    GithubProvider.default({
      clientId: useRuntimeConfig().githubClientId,
      clientSecret: useRuntimeConfig().githubClientSecret,
    }),
    // @ts-expect-error Use .default here for it to work during SSR.
    GoogleProvider.default({
      clientId: useRuntimeConfig().googleClientId,
      clientSecret: useRuntimeConfig().googleClientSecret,
    }),
  ],
  pages: {
    signIn: "/ticket",
    signOut: "/ticket",
    error: "/ticket",
  },
  events: {
    async signIn({ user }) {
      if (!user.email) return;

      try {
        await db
          .insert(attendees)
          .values({
            userId: user.id,
            email: user.email,
            displayName: user.name,
            avatarUrl: user.image,
          })
          .onConflictDoNothing({ target: attendees.userId });

        const attendee = await db
          .select({ imageFileName: attendees.imageFileName })
          .from(attendees)
          .where(eq(attendees.userId, user.id))
          .get();

        if (!attendee || attendee.imageFileName || !user.image) return;

        const avatar = await uploadSocialLoginAvatar(user.id, user.image);
        await db
          .update(attendees)
          .set({ ...avatar, updatedAt: new Date() })
          .where(and(eq(attendees.userId, user.id), isNull(attendees.imageFileName)));
      } catch (error) {
        // Keep the provider URL as a fallback and retry the R2 copy on the next login.
        console.error("Failed to initialize social login avatar:", error);
      }
    },
  },
  callbacks: {
    async session({ session, user }) {
      // Add userId to the session object
      session.userId = user.id;
      return session;
    },
  },
});

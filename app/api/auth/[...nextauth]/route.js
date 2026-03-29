import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectDB, findUser, createUser } from "@/lib/mongodb";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await connectDB();
          
          // Check if user already exists
          let existingUser = await findUser(user.email);
          
          if (!existingUser) {
            // Create new user for Google sign-in
            existingUser = await createUser({
              name: user.name,
              email: user.email,
              password: null, // No password for OAuth users
              role: "client",
              provider: "google",
              providerId: account.providerAccountId,
              createdAt: new Date().toISOString(),
            });
          }
          
          return true;
        } catch (error) {
          console.error("Google sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role || "client",
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.JWT_SECRET,
});

export { handler as GET, handler as POST };

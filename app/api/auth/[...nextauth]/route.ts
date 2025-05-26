import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

// Configure NextAuth
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        // Assign role based on email domain
        const role = "user"
        token.role = role
        
        // Add user info to token
        token.id = user.id
        token.provider = account?.provider
      }
      return token
    },
    async session({ session, token }) {
      try {
        // Create custom JWT token for middleware
        const jwtToken = jwt.sign(
          {
            email: token.email,
            role: token.role,
            userId: token.id,
            exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 1 month expiry
          },
          process.env.JWT_SECRET!
        )

        // Set custom JWT as HTTP-only cookie
        cookies().set("token", jwtToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 30 * 24 * 60 * 60, // 1 month
          path: "/",
          sameSite: "lax",
        })

        // Ensure session.user exists before assigning properties
        if (session.user) {
          // Set role in session
          session.user.role = token.role as string
        }
        
        // Add token to session for client access
        session.token = token
      } catch (error) {
        console.error("Error in session callback:", error)
      }
      
      return session
    },
  },
  pages: {
    signIn: "/login", // Custom sign-in page
    signOut: "/login", // Redirect to login after sign out
    error: "/login", // Error page
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Enable debug in development
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
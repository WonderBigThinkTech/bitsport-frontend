import nextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";

export default nextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CONSUMER_KEY,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET,
      // clientId: "WVQ4Ti04YVg5bHVzeDhoOS1tZno6MTpjaQ",
      // clientSecret: "5xNcsIFgMr0xiI6e0pZg2ity7UXAzdXQaY57uN4y95BP5TKONj",
      version: "2.0", // Twitter API version
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      // const {access_token, access_token_secret} = account;
      return true;
    },
    async session(session, token, user) {
      session.user = user;
      return session;
    },
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.account = account;
        token.profile = profile;
        token.id = profile.id;
      }
      return token;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
});

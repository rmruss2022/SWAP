import GoogleProvider from "next-auth/providers/google";
import NextAuth, { NextAuthOptions } from "next-auth"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb"
import axios from "axios";
import { BASE_URL } from '../../../utils/utils';

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
        })
    ], 
    secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) : Promise<any> {
            console.log('can he sign in?', user, account, profile, email, credentials);
            // test if vt email or a manually added user
            const resp = await axios.post(`${BASE_URL}/api/user/createUser`, {name: user.name, email: user.email, image: user.image})
            console.log('user ressp: ', resp)
            const isAllowedToSignIn = true
            if (isAllowedToSignIn) {
                return resp
            } else {
                // Return false to display a default error message
                return false
                // Or you can return a URL to redirect to:
                // return '/unauthorized'
            }
        }
      },
      
    
}

export default NextAuth(authOptions)

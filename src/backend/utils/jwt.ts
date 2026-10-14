import "server-only"

import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { env } from "../config/env"
import User from "../models/User"

export interface Session {
    userId: string
    name: string
    email: string
    username: string
    role: "User" | "Admin"
    bookMarkedEvents: string[]
}

export const getSession = async():Promise<Session | null> => {
    const cookieStore = await cookies()
    
    const token = cookieStore.get('accessToken')?.value

    if(!token){
        return null
    }

    try {
        const secret = new TextEncoder().encode(env.jwtSecret)
        const {payload} = await jwtVerify(token, secret)

        const userId = payload.sub

        if (!userId) {
            return null;
        }

        const user = await User.findById(userId).select("name email username role bookMarkedEvents")

        if(!user) return null

        return {
            userId: user._id.toString(),
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            bookMarkedEvents: user.bookMarkedEvents
        }
    } catch{
        return null
    }
}
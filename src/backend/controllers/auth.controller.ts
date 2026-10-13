import { signInValidation, signUpValidation } from "../validators/auth.validation";
import { hashPassword } from "../utils/hash.util";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { env } from "../config/env";
import generateAccessToken from "../utils/generateToken.util";


export const signIn = async (request: Request): Promise<Response> => {
    try {
        const body = await request.json()
        const {success, data, error} = signInValidation.safeParse(body); 

        if (!success) {
            return Response.json(
                {
                    success: false,
                    message: 'Validation failed',
                    errors: error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const {email, password} = data; 
        const user = await User.findOne({email})

        if(!user){
            console.error('Invalid password or email')

            return Response.json(
                {
                    success: false,
                    message: 'Invalid password or email',
                },
                { status: 401 },
            );
        }

        const isPasswordValid = await bcrypt.compare(
            password, 
            user.password
        )

        if(!isPasswordValid){
            console.error("Invalid password or email")
            return Response.json({
                success: false, 
                message: "Invalid password or email", 
            }, {
                status: 401
            })
        }
        const cookieStore = await cookies()

        const token = await generateAccessToken(user.id, user.role)

        cookieStore.set('accessToken', token,  {
            httpOnly: true, 
            secure: env.node_env === 'production',
            sameSite: 'strict',
            path: '/', 
            maxAge: 60 * 60 * 24
        })

        return Response.json({
            success: true, 
            message: "User signed it", 
            data: {
                userId: user.id, 
                role: user.role,
                jwtToken: token   //due to requirements i have return jwt
            }
        }, {
            status: 200
        })

    } catch (error) {
        console.error('SignIn failed',{
            message: (error as Error).message, 
            stack: (error as Error).stack, 
            name: (error as Error).name
        })

        return Response.json(
        {
            success: false, 
            message: 'SignIn failed', 
        },
        {status: 500}
        )
    }
};

export const signUp = async (request: Request): Promise<Response> => {
    try {
        const body = await request.json()

        const {success, error, data} = signUpValidation.safeParse(body)

        if (!success) {
            return Response.json(
                {
                    success: false,
                    message: 'Validation failed',
                    errors: error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const {name , email, password , username } = data

        const alreadyUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        
        if (alreadyUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Email or username is already registered',
                },
                { status: 409 },
            );
        }
        const hashedPassword = await hashPassword(password)

        let user; 
        try {
            user = await User.create({
                name, 
                email, 
                username, 
                password: hashedPassword
            })
        } catch (error) {

            if ((error as { code?: number }).code === 11000) {
                return Response.json(
                    {
                    success: false,
                    message: 'Email or username already exists',
                    },
                    { status: 409 },
                );
            }
            console.error('Query failed',{
                message: (error as Error).message, 
                stack: (error as Error).stack, 
                name: (error as Error).name, 
            })

            return Response.json({
                success: false,
                message: "Internal server error"
            }, {status: 500})
        }

        const token = await generateAccessToken(user.id, user.role)
        const cookieStore = await cookies()

        cookieStore.set('accessToken', token,  {
            httpOnly: true, 
            secure: env.node_env === 'production',
            sameSite: 'strict',
            path: '/', 
            maxAge: 60 * 60 * 24
        })

        return Response.json({
            success: true, 
            message: "User signed up", 
            data: {
                userId: user.id,
                role: user.role, 
                jwtToken: token   //due to requirements i have return jwt
            }
        }, {
            status: 200
        })
    } catch (error) {
        console.error('SignUp failed',{
            message: (error as Error).message, 
            stack: (error as Error).stack, 
            name: (error as Error).name
        })

        return Response.json(
        {
            success: false, 
            message: 'SignUp failed', 
            
        },
        {status: 500}
        )
    }
};
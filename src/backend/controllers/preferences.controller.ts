import User from "../models/User"
import { getSession } from "../utils/jwt"
import { updatePreferencesValidation } from "../validators/preferences.validation"

const getPreferences = async(): Promise<Response> => {
    try {
        const session = await getSession()

        if (!session) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const userId = session.userId;

        const userDetails = await User.findById(userId)

        if(!userDetails){
            console.error('Invalid userId')

            return Response.json(
                {
                    success: false,
                    message: 'Invalid userId',
                },
                { status: 401 },
            );
        }

        return Response.json({
            success: true, 
            message : "Categoires fetced", 
            data: userDetails.favouriteCategories
        })
    } catch (error) {
        console.error("Internal server error", {
            name: (error as Error).name,
            stack: (error as Error).stack, 
            message: (error as Error).message
        })

        return Response.json(
            {
            success: false, 
            message: "Internal server error"
            },
            {status: 500}
        )
    }
}

const updatePreferences = async(request:Request): Promise<Response> => {
    try {
        const session = await getSession()

        if (!session) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const body = await request.json()
        const {success, data, error} = updatePreferencesValidation.safeParse(body)

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


        const userId = session.userId
        const categories = data.preferences;

        await User.findByIdAndUpdate(
            userId,
            { $set: { favouriteCategories: categories } },
            { runValidators: true }
        );

        return Response.json({
            success: true, 
            message: 'Preferences updated'
        },{status: 200})

    } catch (error) {
        console.error("Internal server error", {
            name: (error as Error).name,
            stack: (error as Error).stack, 
            message: (error as Error).message
        })

        return Response.json({
            success: false, 
            message: "Internal server error"
        },{status: 500})
    }
}

export {getPreferences, updatePreferences}
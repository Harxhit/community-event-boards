import Event from "../models/Event";
import { getSession } from "../utils/jwt";


const getAllEvents = async(): Promise<Response> => {
    try {
        const session = await getSession()
        if(!session){
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const role = session.role;
        if(role !== 'Admin'){
            return Response.json({
                success: false, 
                message: "Access denied"
            },{status: 403})
        }

        const events = await Event.find({publisher: session.userId})

        if(events.length === 0){
            return Response.json({
                success: true, 
                message: "Event fetched", 
                events: []
            },{status: 200})
        }
        return Response.json({
            success: true, 
            message: 'All event fetched',
            events: events
        },{status: 200})
    } catch (error) {
        console.error('Internal server error',{
            message: (error as Error).message,
            name: (error as Error).name,
            stack: (error as Error).stack,
        })

        return Response.json({
            success: false, 
            message: "Internal server error"
        },{status: 500})
    }
}

export {getAllEvents}
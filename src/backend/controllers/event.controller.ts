import Event from "../models/Event";
import User from "../models/User";
import { getSession } from "../utils/jwt";
import { createEventSchema, getEventsQuerySchema, updateEventSchema, updateEventStatusSchema } from "../validators/event.validation";
import mongoose from 'mongoose'


export const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const events = async(request:Request): Promise<Response> => {
    try {
        const url = new URL(request.url)
        const searchParams = url.searchParams

        const validation = getEventsQuerySchema.safeParse({
            category: searchParams.get("category") ?? undefined,
            city: searchParams.get("city") ?? undefined,
            search: searchParams.get("search") ?? undefined,
            page: searchParams.get("page") ?? undefined,
            limit: searchParams.get("limit") ?? undefined,
        });

        if (!validation.success) {
            return Response.json({
                success: false,
                errors: validation.error.flatten()},
                { status: 400 }
            );
        }

        const { category, city, search, page, limit } = validation.data;

        const query: Record<string, unknown> = {
            isActive: true, 
            date: {$gt: new Date()}
        }

        if(category){
            query.category = category
        }

        if(city){
            query.city = { $regex: `^${escapeRegex(city)}$`, $options: "i" };
        }

        if(search){
            const escapedSearch = escapeRegex(search);
            query.$or = [
                { title: { $regex: escapedSearch, $options: "i" } },
                { description: { $regex: escapedSearch, $options: "i" } },
            ];
        }

        const events = await Event.find(query).sort({date: 1}).skip((page - 1) * limit).limit(limit)
        const total = await Event.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        if(events.length === 0){
            return Response.json({
                success: true, 
                message: 'Results not found',
                events: []
            },{status: 200})
        }
        return Response.json({
            success: true, 
            message: 'Event fetched',
            events: events,
            pagination: {
                page, 
                limit, 
                total, 
                totalPages
            }
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

const createEvents = async(request:Request): Promise<Response> => {
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
        const body = await request.json()
        const {success, data, error} = createEventSchema.safeParse(body)
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

        const {category, title , description, imageUrl, city, date, price} = data


        const event = await Event.create({
            publisher: session.userId,
            category,
            title, 
            description,
            imageUrl: imageUrl || undefined,
            city,
            date: new Date(date),
            price
        })

        return Response.json({
            success: true,
            message: 'Event created',
            event
            
        }, {status: 201})
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

const updateEvent = async(request:Request, { params }: { params: Promise<{ id: string }> }):Promise<Response> => {
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
        const body = await request.json()
        const {success, data, error} = updateEventSchema.safeParse(body)
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
        const {id} = await params
        if (!mongoose.isValidObjectId(id)) {
            return Response.json(
                { success: false, message: "Invalid event ID" },
                { status: 400 }
            );
        }
        const event = await Event.findOneAndUpdate(
            { _id: id, publisher: session.userId },
            { $set: data },
            { new: true, runValidators: true }
        );

        if (!event) {
            return Response.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }
                    
        return Response.json({
            success: true,
            message: 'Event updated',
            event
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

const getEventById = async({params}: {params: Promise<{ id: string }>}): Promise<Response> => {
    try {
        const {id} = await params
        console.log(id)
        if (!mongoose.isValidObjectId(id)) {
            return Response.json(
                { success: false, message: "Invalid event ID" },
                { status: 400 }
            );
        }

        const event = await Event.findOne({ _id: id, isActive: true });
        if (!event) {
            return Response.json(
                { success: false, message: "Event not found" },
                { status: 404 }
            );
        }
        return Response.json({
            success: true,
            message: 'Event fetched',
            event
        }, {status: 200})
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

const feed = async({ params }: { params: Promise<{ page: string; limit: string }> }): Promise<Response> => {
    try {
        const session = await getSession()
        if(!session){
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await User.findById(session.userId)
        const favCategories = user?.favouriteCategories
        console.log("Fav cat", favCategories)

        if (!user || !favCategories?.length) {
            return Response.json({
                success: true,
                message: "Select your favourite categories to personalize your feed",
                events: [],
                currentPage: 1, 
                totalPages: 0,
                totalEvents: 0,
            }, { status: 200 });
        }
        const {page: pageParams, limit: limitParams} = await params

        const page = Number(pageParams)
        const limit = Number(limitParams)


        if (
            !Number.isInteger(page) || page < 1 ||
            !Number.isInteger(limit) || limit < 1 || limit > 100
        ) {
            return Response.json(
                { success: false, message: "Invalid page or limit" },
                { status: 400 }
            );
        }

        const filter = {
            isActive: true, 
            date: {$gt: new Date()},
            category: { $in: favCategories }
        }

        const [events , totalEvents] = await Promise.all([
            Event.find(filter).sort({date: 1}).skip((page - 1) * limit).limit(limit),
            Event.countDocuments(filter)
        ])

        const totalPages = Math.ceil(totalEvents / limit)

        if(events.length === 0){
            return Response.json({
                success: true,
                message: 'Events fetched',
                events: [],
                currentPage: page, 
                totalPages: 0,
                totalEvents: 0,
            }, {status: 200})
        }

        return Response.json({
            success: true,
            message: 'Events fetched',
            events: events,
            currentPage: page, 
            totalPages,
            totalEvents,
        }, {status: 200})
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

const updateEventStatus = async( request: Request,{ params }: { params: Promise<{ id: string }> }): Promise<Response> => {
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
        const {id} = await params
        if (!mongoose.isValidObjectId(id)) {
            return Response.json(
                { success: false, message: "Invalid event ID" },
                { status: 400 }
            );
        }
        const body = await request.json()
        const {success, data, error} = updateEventStatusSchema.safeParse(body)
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
        const isActive = data.isActive

        const event = await Event.findOneAndUpdate(
            { _id: id, publisher: session.userId },
            { $set: { isActive } },
            { new: true, runValidators: true }
        );

        if(!event){
            return Response.json({
                success: false, 
                message: 'Event not found',
                event
            }, {status: 404})
        }

        return Response.json({
            success: true, 
            message: 'Event status updated'
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

const bookMarkEvents = async({params}: {params: Promise<{ id: string }>}) : Promise<Response> => {
    try {
        const session = await getSession()

        if(!session){
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const {id} = await params
        if(!mongoose.isValidObjectId(id)){
            return Response.json(
                { success: false, message: "Invalid event ID" },
                { status: 400 }
            );
        }

        const isEvent = await Event.findOne({
            _id: id, isActive: true
        })
        if(!isEvent){
            return Response.json({
                success: false, 
                message: 'Event does not exist'
            }, {status: 404})
        }
        const user = await User.findByIdAndUpdate(
            session.userId, 
            {
                $addToSet: {
                    bookMarkedEvents: id
                }
            },
            {new: true}
        )

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }
        return Response.json({
            success: true, 
            message: 'Event bookmarked', 
            user: user.bookMarkedEvents
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

export {events, createEvents, updateEvent, getEventById, feed, updateEventStatus, bookMarkEvents}
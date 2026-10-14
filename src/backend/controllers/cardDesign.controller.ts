import CardDesign from "../models/CardDesign";
import { getSession } from "../utils/jwt";
import mongoose from "mongoose";
import { cardDesignSchema, updateCardDesignSchema } from "../validators/cardDesign.validation";
import Event from "../models/Event";

const getCardDesignById = async({params}: {params: Promise<{ id: string }>}):Promise<Response> => {
    try {
        const session = await getSession()
        if(!session){
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const {id} = await params; 
        if (!mongoose.isValidObjectId(id)) {
            return Response.json(
                { success: false, message: "Invalid event ID" },
                { status: 400 }
            );
        }
        const userId = session.userId; 

        const event = await Event.findById(id).select("_id");

        if (!event) {
            return Response.json(
                { success: false, message: "Event does not exist" },
                { status: 404 }
            );
        }

        const cardDesign = await CardDesign.findOne({eventId: id, userId: userId})
        if(!cardDesign){
            return Response.json({
                success: true, 
                message: 'No design exist',
                cardDesign : ''
            },{status: 200})
        }

        return Response.json({
            success: true, 
            message: 'Card design fetched',
            theme: cardDesign.theme,
            stickers: cardDesign.stickers
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

const createCardDesign = async(request: Request, {params}: {params: Promise<{ id: string }>}):Promise<Response> => {
    try {
        const session = await getSession()
        if(!session){
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json()
        const {success, data, error} = cardDesignSchema.safeParse(body)
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
        if(!mongoose.isValidObjectId(id)){
            return Response.json(
                { success: false, message: "Invalid event ID" },
                { status: 400 }
            );
        }

        const event = await Event.findById(id).select("_id");

        if (!event) {
            return Response.json(
                { success: false, message: "Event does not exist" },
                { status: 404 }
            );
        }

        const {theme , stickers} = data
        const cardDesign = await CardDesign.create({
            eventId: id, 
            userId: session.userId, 
            theme, 
            stickers
        })

        return Response.json({
            success: true,
            message: "Card desgin created",
            cardDesign
        },{status: 200})

    } catch (error) {
        if ((error as { code?: number }).code === 11000) {
            return Response.json(
                {
                    success: false,
                    message: "Card design already exists for this event",
                },
                { status: 409 }
            );
        }
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

const updateCardDesign = async(request: Request, {params}: {params: Promise<{ id: string }>}):Promise<Response> => {
    try {
        const session = await getSession()
        if(!session){
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }
        const body = await request.json()
        const {success, data, error} = updateCardDesignSchema.safeParse(body)
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
        if(!mongoose.isValidObjectId(id)){
            return Response.json(
                { success: false, message: "Invalid event ID" },
                { status: 400 }
            );
        }
        const event = await Event.findById(id).select("_id");

        if (!event) {
            return Response.json(
                { success: false, message: "Event does not exist" },
                { status: 404 }
            );
        }

        const cardDesign = await CardDesign.findOneAndUpdate(
            {
                eventId: id,
                userId: session.userId,
            },
            {
                $set: data,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!cardDesign) {
            return Response.json(
                { success: false, message: "Card design does not exist" },
                { status: 404 }
            );
        }

        return Response.json({
            success: true,
            message: "Card updated",
            cardDesign
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

const getCardDesigns = async (request: Request): Promise<Response> => {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const eventIds = searchParams.get("eventIds")?.split(",") ?? [];
    if (eventIds.length === 0 ) {
      return Response.json(
        { success: false, message: "Invalid or missing event IDs" },
        { status: 400 }
      );
    }

    const designs = await CardDesign.find({
      userId: session.userId,
      eventId: { $in: eventIds },
    }).select("eventId theme stickers -_id");

    return Response.json(
      {
        success: true,
        designs: designs.map((design) => ({
          eventId: design.eventId.toString(),
          theme: design.theme,
          stickers: design.stickers,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("getCardDesigns error:", error);

    return Response.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
};

export {getCardDesignById, createCardDesign, updateCardDesign, getCardDesigns}
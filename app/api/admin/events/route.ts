import { createEvents } from "@/src/backend/controllers/event.controller";
import { getAllEvents } from "@/src/backend/controllers/admin.controller";

export const POST = createEvents 

export const GET = getAllEvents

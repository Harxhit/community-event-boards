import { getEventById } from "@/src/backend/controllers/event.controller";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  return getEventById({ params });
}
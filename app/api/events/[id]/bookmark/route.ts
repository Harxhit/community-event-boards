import { bookMarkEvents } from "@/src/backend/controllers/event.controller";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return bookMarkEvents({ params });
}
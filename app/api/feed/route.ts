import { feed } from "@/src/backend/controllers/event.controller";

export const GET = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);

    return feed({
        params: Promise.resolve({
            page: url.searchParams.get("page") ?? "1",
            limit: url.searchParams.get("limit") ?? "10",
        }),
    });
};
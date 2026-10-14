import {
  getCardDesignById,
  createCardDesign,
  updateCardDesign,
} from "@/src/backend/controllers/cardDesign.controller";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: Request,
  { params }: RouteContext,
) {
  return getCardDesignById({ params });
}

export async function POST(
  request: Request,
  { params }: RouteContext,
) {
  return createCardDesign(request, { params });
}

export async function PATCH(
  request: Request,
  { params }: RouteContext,
) {
  return updateCardDesign(request, { params });
}
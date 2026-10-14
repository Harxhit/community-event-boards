import {getCardDesigns} from "@/src/backend/controllers/cardDesign.controller";
  
export async function GET(request: Request) {
  return getCardDesigns(request);
}


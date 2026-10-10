import { NextResponse } from "next/server";
import connectToDatabase from "@/src/backend/database/mongodb";

export async function GET() {
  await connectToDatabase();

  return NextResponse.json({
    success: true, 
    message: "Database connected"
  });
}
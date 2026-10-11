import connectToDatabase from "./src/backend/database/mongodb";

export async function register() {
  await connectToDatabase();
}
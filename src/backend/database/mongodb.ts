import mongoose from "mongoose";
import { env } from "../config/env";

const delay = (ms: number)  => {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const isProduction = env.node_env === "production";

const MAX_RETRIES = isProduction ? 5 : 10;
const INITIAL_DELAY_MS = 1000;


const connectToDataBase = async (): Promise<void> => {
  const connectionString = env.databaseUrl
  
  mongoose.connection.on("connected", () => {
    console.log('Mongoose connected successfully')
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected")
  });

  mongoose.connection.on("error", (error) => {
    console.error("Mongoose connection error",error)
  });

  let attempt = 0; 
  while(attempt < MAX_RETRIES){
      try {
        const connection = await mongoose.connect(connectionString)
    
        console.info('Database connected successfully');
        return; 

      } catch (error) {
        attempt++; 
        const backOff = Math.min(INITIAL_DELAY_MS * 2 ** (attempt - 1), 30000);
        
        console.warn(`MongoDB connection failed (${attempt}/${MAX_RETRIES === Infinity ? "∞" : MAX_RETRIES}). Retrying in ${backOff}ms`);
        if(attempt >= MAX_RETRIES){
          console.error('Max retries exceeded')
          throw error
        }
        await delay(backOff)
      }
  }
};

export default connectToDataBase;
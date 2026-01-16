import type { DI } from ".";
import mongoose, { mongo } from "mongoose";
import { config } from "../config";



export async function database(this: DI) {
    mongoose.set("strictQuery", true);
    const db = await mongoose.connect("mongodb://localhost:27017",{
        dbName: config.DATABASE_NAME,
        user: config.DATABASE_USER,
        pass: config.DATABASE_PASSWORD,
    })
}
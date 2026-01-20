import "dotenv/config";
import { defineConfig } from "prisma/config";

const url = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@localhost:27017/${process.env.DATABASE_NAME}`;

export default defineConfig({
    datasource: {
        url: url,
    },
});
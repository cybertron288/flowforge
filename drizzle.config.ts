import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/*",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/flow_forge',
    }
});

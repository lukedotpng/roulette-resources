import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/server/db/schema.ts",
    dbCredentials: {
        url: process.env.DRIZZLE_KIT_DATABASE_URL!,
    },
});

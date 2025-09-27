import * as dotenv from "dotenv";
import { defineConfig } from 'drizzle-kit';

if(!process.env?.DATEBSEURL) throw new Error("Datebase url not set up");

export default defineConfig({
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations: {
    table: "__drizzle_migration",
    schema: "public"
  },
  verbose: true,
  strict: true,
});
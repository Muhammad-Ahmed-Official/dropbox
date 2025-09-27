import { migrate } from 'drizzle-orm/neon-http/migrator';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from "dotenv";

if(!process.env?.DATEBSEURL) throw new Error("Datebase url not set up");

async function runMigration() {
    try {
        const sql = neon(process.env.DATABASEURL!);
        const db = drizzle(sql);

        await migrate(db, {migrationsFolder: "./drizzle"});
        console.log("All migrations are successfully done");
    } catch (error) {
        console.log("All migrations are successfully done");
        process.exit(1);
    }    
}

runMigration();
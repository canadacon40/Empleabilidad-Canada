const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function sync() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log("Connected to Neon Postgres...");

        // Check if columns exist first
        const res = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'User' AND column_name IN ('password', 'isPro');
        `);

        const existingColumns = res.rows.map(r => r.column_name);
        
        if (!existingColumns.includes('password')) {
            console.log("Adding 'password' column...");
            await client.query('ALTER TABLE "User" ADD COLUMN "password" TEXT;');
        }

        if (!existingColumns.includes('isPro')) {
            console.log("Adding 'isPro' column...");
            await client.query('ALTER TABLE "User" ADD COLUMN "isPro" BOOLEAN DEFAULT false;');
        }

        console.log("Manual Sync SUCCESS: Columns are now present in the database.");
    } catch (err) {
        console.error("Manual Sync FAILED:", err.message);
    } finally {
        await client.end();
    }
}

sync();

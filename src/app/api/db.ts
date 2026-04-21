import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.skalyanam_POSTGRES_URL_NO_SSL || process.env.POSTGRES_URL_NO_SSL || process.env.DATABASE_URL,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    return await client.query(text, params);
  } finally {
    client.release();
  }
}

let dbInitialized = false;

// Ensure tables exist
export async function initializeDb() {
  if (dbInitialized) return;
  
  await query(`
    CREATE TABLE IF NOT EXISTS tickets (
      id SERIAL PRIMARY KEY,
      type VARCHAR(50) NOT NULL,
      quantity INT NOT NULL,
      name VARCHAR(255),
      email VARCHAR(255),
      phone VARCHAR(50),
      whatsapp_requested BOOLEAN,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  dbInitialized = true;
}

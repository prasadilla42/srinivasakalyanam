import { NextResponse } from 'next/server';
import { query, initializeDb } from '../db';

export async function GET() {
  try {
    await initializeDb();
    
    const yajamaniResult = await query("SELECT SUM(quantity) as val FROM tickets WHERE type = 'yajamani'");
    const freeResult = await query("SELECT SUM(quantity) as val FROM tickets WHERE type = 'free'");
    
    const yajamani = parseInt(yajamaniResult.rows[0].val || '0', 10);
    const free = parseInt(freeResult.rows[0].val || '0', 10);
    
    return NextResponse.json({ yajamani, free });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ yajamani: 0, free: 0 });
  }
}


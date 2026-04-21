import { NextResponse } from 'next/server';
import { query, initializeDb } from '../db';

export async function POST(req: Request) {
  try {
    const { name, email, phone, quantity, whatsappRequested } = await req.json();

    await initializeDb();

    // 1. Check current count
    const freeResult = await query("SELECT SUM(quantity) as val FROM tickets WHERE type = 'free'");
    const currentFree = parseInt(freeResult.rows[0].val || '0', 10);

    if (currentFree + quantity > 300) {
      return NextResponse.json({ error: 'Sold out! Not enough free tickets remaining.' }, { status: 400 });
    }

    // 2. Increment count & Store ticket info
    await query(
      "INSERT INTO tickets (type, quantity, name, email, phone, whatsapp_requested) VALUES ($1, $2, $3, $4, $5, $6)",
      ['free', quantity, name, email, phone, whatsappRequested]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('DB Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


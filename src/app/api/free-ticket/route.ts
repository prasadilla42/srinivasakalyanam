import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: Request) {
  try {
    const { name, email, phone, quantity, whatsappRequested } = await req.json();

    // 1. Check current count
    const currentFree = (await kv.get<number>('count_free')) || 0;

    if (currentFree + quantity > 300) {
      return NextResponse.json({ error: 'Sold out! Not enough free tickets remaining.' }, { status: 400 });
    }

    // 2. Increment count
    await kv.incrby('count_free', quantity);

    // 3. Store ticket info in a list
    await kv.lpush('free_tickets_list', { 
      name, 
      email, 
      phone, 
      quantity, 
      whatsappRequested, 
      date: new Date().toISOString() 
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('KV Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

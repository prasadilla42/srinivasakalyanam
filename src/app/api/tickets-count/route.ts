import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const yajamani = (await kv.get<number>('count_yajamani')) || 0;
    const free = (await kv.get<number>('count_free')) || 0;
    
    return NextResponse.json({ yajamani, free });
  } catch (error) {
    console.error('KV Error:', error);
    return NextResponse.json({ yajamani: 0, free: 0 });
  }
}

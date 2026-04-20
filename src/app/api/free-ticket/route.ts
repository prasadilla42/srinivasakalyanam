import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { name, email, phone, quantity, whatsappRequested } = await req.json();

    const dataPath = path.join(process.cwd(), 'data.json');
    let data = { yajamani: 0, free: 0, freeTickets: [] as any[] };
    if (fs.existsSync(dataPath)) {
      data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    }

    if (data.free + quantity > 300) {
      return NextResponse.json({ error: 'Sold out! Not enough free tickets remaining.' }, { status: 400 });
    }

    data.free += quantity;
    data.freeTickets.push({ 
      name, 
      email, 
      phone, 
      quantity, 
      whatsappRequested, 
      date: new Date().toISOString() 
    });
    
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

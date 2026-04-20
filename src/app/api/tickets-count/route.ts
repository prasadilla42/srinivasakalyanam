import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ yajamani: 0, free: 0 });
    }
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return NextResponse.json({ yajamani: data.yajamani || 0, free: data.free || 0 });
  } catch (error) {
    return NextResponse.json({ yajamani: 0, free: 0 });
  }
}

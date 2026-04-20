import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { ticketType, quantity, attendees } = await req.json();

    const priceMap = {
      yajamani: 51,
      normal: 5,
    };

    const unitAmount = priceMap[ticketType as keyof typeof priceMap] * 100; // in pence

    if (!unitAmount) {
      return NextResponse.json({ error: 'Invalid ticket type' }, { status: 400 });
    }

    if (ticketType === 'yajamani') {
      const dataPath = path.join(process.cwd(), 'data.json');
      let data: any = { yajamani: 0, free: 0, freeTickets: [] };
      if (fs.existsSync(dataPath)) {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      }
      
      if (data.yajamani + quantity > 30) {
        return NextResponse.json({ error: 'Sold out! Not enough Yajamani tickets remaining.' }, { status: 400 });
      }
      
      data.yajamani += quantity;
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: ticketType === 'yajamani' ? 'Yajamani Ticket' : 'Normal Ticket',
              description: ticketType === 'yajamani' 
                ? 'Srinivasakalyanam Rugby 2026 - Premium Experience Family Ticket' 
                : 'Srinivasakalyanam Rugby 2026 - General Admission',
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
      metadata: {
        ticketType,
        attendees: attendees ? attendees.toString() : '1'
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

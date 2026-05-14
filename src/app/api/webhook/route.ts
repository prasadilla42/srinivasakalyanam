import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query, initializeDb } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;

    let event: Stripe.Event;

    try {
      if (!webhookSecret) {
        throw new Error('Missing STRIPE_WEBHOOK_SECRET');
      }
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      // If we don't have a webhook secret in dev, we could allow it anyway, but it's dangerous in production
      // For now, let's gracefully fail if signature is invalid
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const ticketType = session.metadata?.ticketType;
      const quantity = parseInt(session.metadata?.quantity || '1', 10);
      
      if (ticketType === 'yajamani' || ticketType === 'normal') {
        // Only insert if it's a ticket purchase (not donation)
        await initializeDb();
        
        // Use Stripe session customer details if available
        const name = session.customer_details?.name || 'Unknown';
        const email = session.customer_details?.email || 'Unknown';
        
        await query(
          "INSERT INTO tickets (type, quantity, name, email) VALUES ($1, $2, $3, $4)",
          [ticketType, quantity, name, email]
        );
        console.log(`Successfully inserted ${quantity} ${ticketType} tickets for ${email}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

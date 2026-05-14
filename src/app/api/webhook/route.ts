import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query, initializeDb } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
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

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const ticketType = session.metadata?.ticketType;
      const quantity = parseInt(session.metadata?.quantity || '1', 10);
      
      if (ticketType === 'yajamani' || ticketType === 'normal') {
        // Only insert if it's a ticket purchase (not donation)
        await initializeDb();
        
        // Use Stripe session customer details if available
        const name = session.customer_details?.name || 'Unknown';
        const email = session.customer_details?.email || 'Unknown';
        
        try {
          await query(
            "INSERT INTO tickets (type, quantity, name, email, stripe_session_id) VALUES ($1, $2, $3, $4, $5)",
            [ticketType, quantity, name, email, session.id]
          );
          console.log(`Successfully inserted ${quantity} ${ticketType} tickets for ${email}`);
        } catch (e: any) {
          // If error is unique constraint violation, it means it was already inserted!
          if (e.code === '23505') {
            console.log(`Session ${session.id} already processed.`);
          } else {
            throw e;
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { query, initializeDb } from '../db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2023-10-16' as any,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get('session_id');

    if (!session_id) {
      return NextResponse.json({ error: 'No session ID provided' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const ticketType = session.metadata?.ticketType;
      const quantity = parseInt(session.metadata?.quantity || '1', 10);

      if (ticketType === 'yajamani' || ticketType === 'normal') {
        await initializeDb();
        
        const name = session.customer_details?.name || 'Unknown';
        const email = session.customer_details?.email || 'Unknown';

        try {
          await query(
            "INSERT INTO tickets (type, quantity, name, email, stripe_session_id) VALUES ($1, $2, $3, $4, $5)",
            [ticketType, quantity, name, email, session.id]
          );
          console.log(`Success Page Verification: Inserted ${quantity} ${ticketType} tickets for ${email}`);

          try {
            const { sendConfirmationEmail } = await import('@/lib/email');
            await sendConfirmationEmail(email, ticketType, quantity, name);
          } catch (emailErr) {
            console.error('Failed to send confirm-ticket email:', emailErr);
          }
        } catch (e: any) {
          // If error is unique constraint violation, it means webhook already inserted it!
          if (e.code === '23505') {
            console.log(`Success Page Verification: Session ${session.id} already processed.`);
          } else {
            throw e;
          }
        }
      }
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Confirm Ticket Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { currentUser } from '@clerk/nextjs/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.academics' as any, // fallback/compatibility config
});

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { items } = await req.json();
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const email = user.emailAddresses[0]?.emailAddress || '';
    const userId = user.id;

    // Convert cart items to Stripe line items
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || 'Premium Digital Resource',
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: 1,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email,
      metadata: {
        userId: userId,
        userEmail: email,
        productNames: items.map((item: any) => item.name).join(', '),
      },
      success_url: `${req.headers.get('origin')}/store?success=true`,
      cancel_url: `${req.headers.get('origin')}/store?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Session Error:', error);
    // Return mock session URL during fallback / testing if keys are placeholders
    if (process.env.STRIPE_SECRET_KEY?.includes('placeholder')) {
      return NextResponse.json({ 
        url: `${req.headers.get('origin')}/store?success=true&mock=true` 
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

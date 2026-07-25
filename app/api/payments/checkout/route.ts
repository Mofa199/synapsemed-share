import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planType, amount, paymentProvider } = await req.json();

    if (!planType || !amount || !paymentProvider) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // 1. Create a pending payment transaction in the database
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: session.user.id,
        amount: parseFloat(amount),
        currency: 'TZS', // Or dynamic based on provider/plan
        status: 'PENDING',
        paymentMethod: 'ONLINE',
        provider: paymentProvider,
        description: `Subscription to ${planType} plan`,
      }
    });

    // 2. Initialize payment with the selected provider (e.g., Stripe, Flutterwave, M-Pesa)
    // This is a placeholder shell for the actual provider integration.
    let checkoutUrl = '';

    if (paymentProvider === 'stripe') {
      // Initialize Stripe Checkout Session
      // checkoutUrl = stripeSession.url;
      checkoutUrl = `https://mock-stripe.example.com/checkout?txId=${transaction.id}`;
    } else if (paymentProvider === 'flutterwave') {
      // Initialize Flutterwave Standard Payment
      // checkoutUrl = flutterwaveResponse.data.link;
      checkoutUrl = `https://mock-flutterwave.example.com/pay?txId=${transaction.id}`;
    } else {
      return NextResponse.json({ error: 'Unsupported payment provider' }, { status: 400 });
    }

    // Return the checkout URL to the client so they can redirect the user
    return NextResponse.json({
      success: true,
      transactionId: transaction.id,
      checkoutUrl
    });

  } catch (error: any) {
    console.error('Checkout initialization failed:', error);
    return NextResponse.json({ error: error.message || 'Payment initialization failed' }, { status: 500 });
  }
}

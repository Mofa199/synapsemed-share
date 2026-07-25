import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Webhook Signature
    // Verify the request came from the valid payment provider (Stripe, Flutterwave, etc.)
    // const signature = req.headers.get('webhook-signature');
    
    const payload = await req.json();

    // 2. Extract transaction ID and status from payload
    // Example for a mock provider:
    const txId = payload.data?.txId;
    const status = payload.data?.status; // e.g., 'SUCCESS', 'FAILED'

    if (!txId || !status) {
      return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
    }

    // 3. Find the pending transaction
    const transaction = await prisma.paymentTransaction.findUnique({
      where: { id: txId }
    });

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    if (status === 'SUCCESS') {
      // 4. Update transaction status
      await prisma.paymentTransaction.update({
        where: { id: txId },
        data: { 
          status: 'SUCCESS',
          providerTxId: payload.data?.providerRef // save the external ID
        }
      });

      // 5. Create or update the user's subscription
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

      await prisma.subscription.upsert({
        where: { userId: transaction.userId },
        update: {
          status: 'ACTIVE',
          planType: 'PREMIUM', // Or derived from the transaction description
          endDate: endDate,
          paymentProvider: transaction.provider
        },
        create: {
          userId: transaction.userId,
          status: 'ACTIVE',
          planType: 'PREMIUM',
          endDate: endDate,
          paymentProvider: transaction.provider
        }
      });

      return NextResponse.json({ received: true, status: 'PROCESSED' });
    } else {
      // Payment failed
      await prisma.paymentTransaction.update({
        where: { id: txId },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ received: true, status: 'FAILED' });
    }

  } catch (error: any) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

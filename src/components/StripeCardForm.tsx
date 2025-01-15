import React from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { sendWelcomeEmail } from '../services/email';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCardFormProps {
  clientSecret: string | null;
  onSuccess: () => void;
  customerEmail: string;
  customerName: string;
  planName: string;
  isTrialSetup?: boolean;
}

function StripeCheckoutForm({ 
  onSuccess, 
  customerEmail, 
  customerName, 
  planName,
  isTrialSetup 
}: { 
  onSuccess: () => void;
  customerEmail: string;
  customerName: string;
  planName: string;
  isTrialSetup?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = React.useState<string>('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system is not ready. Please try again.');
      return;
    }

    if (!customerEmail || !customerName) {
      setError('Please fill in your name and email before proceeding with payment.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message || 'Failed to submit payment');
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
          payment_method_data: {
            billing_details: {
              email: customerEmail,
              name: customerName
            }
          },
          setup_future_usage: isTrialSetup ? 'off_session' : undefined
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment confirmation failed');
      }

      try {
        await sendWelcomeEmail(customerEmail, customerName, planName);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          }
        }}
      />
      
      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
          {error}
        </div>
      )}

      <div className="text-sm text-purple-200 bg-purple-500/10 p-4 rounded-xl border border-purple-500/20">
        {isTrialSetup ? (
          <>
            <p className="font-medium mb-2">Free Trial Terms:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>$1 temporary authorization (refunded immediately)</li>
              <li>7 days free trial with full access</li>
              <li>$5/month after trial ends</li>
              <li>Cancel anytime during trial</li>
            </ul>
          </>
        ) : (
          <p>You will be charged {planName === 'Lifetime' ? 'once' : 'monthly'}.</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || !customerEmail || !customerName}
        className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 disabled:hover:scale-100"
      >
        {isProcessing ? 'Processing...' : isTrialSetup ? 'Start Free Trial' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function StripeCardForm({ 
  clientSecret, 
  onSuccess, 
  customerEmail, 
  customerName, 
  planName,
  isTrialSetup 
}: StripeCardFormProps) {
  if (!clientSecret) {
    return (
      <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl text-yellow-200 text-center">
        Initializing payment form...
      </div>
    );
  }

  return (
    <Elements 
      stripe={stripePromise} 
      options={{ 
        clientSecret,
        appearance: {
          theme: 'night',
          labels: 'floating',
          variables: {
            colorPrimary: '#8B5CF6',
            colorBackground: '#1F2937',
            colorText: '#F3F4F6',
            colorDanger: '#EF4444',
            fontFamily: 'ui-sans-serif, system-ui, sans-serif',
            borderRadius: '12px',
            spacingUnit: '4px',
          }
        }
      }}
    >
      <StripeCheckoutForm 
        onSuccess={onSuccess} 
        customerEmail={customerEmail}
        customerName={customerName}
        planName={planName}
        isTrialSetup={isTrialSetup}
      />
    </Elements>
  );
}
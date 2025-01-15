import { loadStripe } from '@stripe/stripe-js';

const BACKEND_URL = 'https://backend-memory-f33i.onrender.com';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initializePayment = async (amount: number, currency: string = 'usd', isTrialSetup: boolean = false) => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log('Payment Service: Initializing payment', { amount, currency, isTrialSetup });
      
      const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
          setup_future_usage: isTrialSetup ? 'off_session' : undefined,
          trial_period_days: isTrialSetup ? 7 : undefined,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never'
          }
        }),
      });

      if (!response.ok) {
        console.error('Payment Service: Server error response', {
          status: response.status,
          statusText: response.statusText
        });
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Payment Service: Received response', { 
        hasClientSecret: !!data.clientSecret,
        setupIntent: !!data.setupIntent
      });
      
      if (!data.clientSecret) {
        throw new Error('Invalid response from payment server: missing client secret');
      }

      return { 
        clientSecret: data.clientSecret,
        setupIntent: data.setupIntent
      };
    } catch (error) {
      console.error('Payment Service: Attempt failed', {
        attempt: attempt + 1,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      lastError = error instanceof Error ? error : new Error('Failed to connect to payment server');
      
      if (attempt < maxRetries - 1) {
        await wait(Math.pow(2, attempt) * 1000);
        continue;
      }
    }
  }

  throw new Error(`Payment initialization failed after ${maxRetries} attempts: ${lastError?.message}`);
};
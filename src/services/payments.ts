import { loadStripe } from '@stripe/stripe-js';

const BACKEND_URL = 'https://backend-memory-f33i.onrender.com';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const initializePayment = async (amount: number, currency: string = 'usd') => {
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(`${BACKEND_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.clientSecret) {
        throw new Error('Invalid response from payment server: missing client secret');
      }

      return { clientSecret: data.clientSecret };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Failed to connect to payment server');
      
      // Only wait and retry if we have more attempts left
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        await wait(Math.pow(2, attempt) * 1000);
        continue;
      }
    }
  }

  // If we get here, all retries failed
  throw new Error(`Payment initialization failed after ${maxRetries} attempts: ${lastError?.message}`);
};
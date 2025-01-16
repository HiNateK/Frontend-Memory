import { supabase } from '../lib/supabase';

interface CancellationResult {
  success: boolean;
  message: string;
}

export const cancelSubscription = async (email: string, name: string): Promise<CancellationResult> => {
  try {
    // First, verify the customer exists and get their details
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('id, first_name, last_name')
      .eq('email', email.toLowerCase())
      .single();

    if (customerError || !customer) {
      return {
        success: false,
        message: 'No account found with this email address. Please check your information and try again.'
      };
    }

    // Verify the name matches
    const fullName = `${customer.first_name} ${customer.last_name}`.toLowerCase();
    if (fullName !== name.toLowerCase()) {
      return {
        success: false,
        message: 'The name provided does not match our records. Please check your information and try again.'
      };
    }

    // Get active subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('id, stripe_subscription_id, status')
      .eq('customer_id', customer.id)
      .eq('status', 'active')
      .single();

    if (subscriptionError || !subscription) {
      return {
        success: false,
        message: 'No active subscription found for this account.'
      };
    }

    // Cancel subscription in Stripe
    if (subscription.stripe_subscription_id) {
      const response = await fetch('https://backend-memory-f33i.onrender.com/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.stripe_subscription_id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription with payment provider');
      }
    }

    // Update subscription status in database
    const { error: updateError } = await supabase
      .rpc('cancel_subscription', {
        subscription_uuid: subscription.id
      });

    if (updateError) {
      throw updateError;
    }

    return {
      success: true,
      message: 'Your subscription has been successfully cancelled. You will have access until the end of your current billing period.'
    };
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return {
      success: false,
      message: 'An error occurred while cancelling your subscription. Please try again or contact support.'
    };
  }
};
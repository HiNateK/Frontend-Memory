import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
}

export interface Subscription {
  id: string;
  plan_name: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  current_period_ends_at: string;
  auto_renew: boolean;
}

export interface PaymentRecord {
  id: string;
  amount: number;
  status: 'succeeded' | 'failed' | 'refunded' | 'pending';
  created_at: string;
}

export interface GiftRecord {
  id: string;
  recipient_email: string;
  plan_name: string;
  status: 'pending' | 'redeemed' | 'expired';
  created_at: string;
}

export const getCustomerDetails = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (customerError) throw customerError;
  if (!customer) throw new Error('Customer not found');

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: payments } = await supabase
    .from('payment_history')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false });

  const { data: gifts } = await supabase
    .from('gift_records')
    .select('*')
    .eq('sender_id', customer.id)
    .order('created_at', { ascending: false });

  return {
    customer,
    subscription,
    payments,
    gifts
  };
};

export const cancelSubscription = async (subscriptionId: string) => {
  const { data, error } = await supabase
    .rpc('cancel_subscription', {
      subscription_uuid: subscriptionId
    });

  if (error) throw error;
  return data;
};

export const updateCustomerProfile = async (customerId: string, updates: Partial<Customer>) => {
  const { data, error } = await supabase
    .from('customers')
    .update(updates)
    .eq('id', customerId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getGiftHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: customer } = await supabase
    .from('customers')
    .select('id, email')
    .eq('user_id', user.id)
    .single();

  if (!customer) throw new Error('Customer not found');

  const { data: sentGifts } = await supabase
    .from('gift_records')
    .select('*')
    .eq('sender_id', customer.id);

  const { data: receivedGifts } = await supabase
    .from('gift_records')
    .select('*')
    .eq('recipient_email', customer.email);

  return {
    sent: sentGifts || [],
    received: receivedGifts || []
  };
};

export const getPaymentHistory = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: customer } = await supabase
    .from('customers')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!customer) throw new Error('Customer not found');

  const { data: payments, error } = await supabase
    .from('payment_history')
    .select('*')
    .eq('customer_id', customer.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return payments;
};
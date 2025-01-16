import { supabase } from '../lib/supabase';

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  trial_started_at?: string;
  trial_ends_at?: string;
  trial_converted_at?: string;
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

export interface TrialStatus {
  is_trial: boolean;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  trial_converted_at: string | null;
  days_remaining: number;
}

export const createTrialCustomer = async (email: string, firstName: string, lastName: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .rpc('create_trial_customer', {
      p_email: email,
      p_first_name: firstName,
      p_last_name: lastName,
      p_user_id: user.id
    });

  if (error) throw error;
  return data;
};

export const getTrialStatus = async (customerId: string): Promise<TrialStatus> => {
  const { data, error } = await supabase
    .rpc('get_trial_status', {
      customer_uuid: customerId
    });

  if (error) throw error;
  return data as TrialStatus;
};

export const convertTrialToPaid = async (
  customerId: string, 
  planName: string, 
  planPrice: number
): Promise<boolean> => {
  const { data, error } = await supabase
    .rpc('convert_trial_to_paid', {
      customer_uuid: customerId,
      new_plan_name: planName,
      new_plan_price: planPrice
    });

  if (error) throw error;
  return data;
};

export const getCustomerDetails = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .select('*, trial_started_at, trial_ends_at, trial_converted_at')
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

  const trialStatus = subscription?.status === 'trial' 
    ? await getTrialStatus(customer.id)
    : null;

  return {
    customer,
    subscription,
    payments,
    gifts,
    trialStatus
  };
};

// ... rest of the file remains unchanged
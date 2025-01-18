import { supabase } from '../lib/supabase';

// ... existing interfaces ...

export const createTrialCustomer = async (email: string, firstName: string, lastName: string) => {
  console.log('Creating trial customer:', { email, firstName, lastName });
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      throw new Error('Not authenticated');
    }

    console.log('Creating trial customer with user ID:', user.id);

    const { data, error } = await supabase
      .rpc('create_trial_customer', {
        p_email: email,
        p_first_name: firstName,
        p_last_name: lastName,
        p_user_id: user.id
      });

    if (error) {
      console.error('Error creating trial customer:', error);
      throw error;
    }

    console.log('Trial customer created successfully:', data);
    return data;
  } catch (error) {
    console.error('Failed to create trial customer:', error);
    throw error;
  }
};

// ... rest of the file remains unchangedt
import { supabase } from '../lib/supabase';

export const subscribeToNewsletter = async (email: string) => {
  try {
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email }]);

    if (error) {
      if (error.code === '23505') { // Unique violation
        return { success: false, message: 'You are already subscribed!' };
      }
      throw error;
    }

    return { success: true, message: 'Thank you for subscribing!' };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    };
  }
};
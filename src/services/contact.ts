import { supabase } from '../lib/supabase';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}

export const submitContactForm = async (data: ContactFormData): Promise<ContactResponse> => {
  try {
    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        message: data.message
      }]);

    if (error) throw error;

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { 
      success: false, 
      message: 'Failed to send message. Please try again later.'
    };
  }
};
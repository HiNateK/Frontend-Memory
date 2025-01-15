const BACKEND_URL = 'https://backend-memory-f33i.onrender.com';
const SENDER_EMAIL = import.meta.env.VITE_SENDER_EMAIL || 'support@kinscreen.com';

const sendEmail = async (options: {
  to: string;
  subject: string;
  html: string;
}) => {
  console.log('Email Service: Starting email send process');
  console.log('Email Service: Sending to:', options.to);
  console.log('Email Service: From:', SENDER_EMAIL);
  console.log('Email Service: Subject:', options.subject);
  
  try {
    console.log('Email Service: Making request to backend:', `${BACKEND_URL}/send-email`);
    
    const requestBody = {
      to: options.to,
      from: SENDER_EMAIL,
      subject: options.subject,
      html: options.html
    };
    
    console.log('Email Service: Request payload:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${BACKEND_URL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Email Service: Response status:', response.status);
    console.log('Email Service: Response status text:', response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Email Service: Error response:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        url: response.url,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    console.log('Email Service: Email sent successfully');
    return true;
  } catch (error) {
    console.error('Email Service: Caught error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return false;
  }
};

export const sendWelcomeEmail = async (email: string, name: string, planName: string) => {
  console.log('Welcome Email: Starting send process', { email, name, planName });
  return sendEmail({
    to: email,
    subject: 'Welcome to KinScreen!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6D28D9; margin-bottom: 20px;">Welcome to KinScreen!</h1>
        <p>Dear ${name},</p>
        <p>Thank you for subscribing to our ${planName} plan.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <h2 style="color: #4C1D95; margin-bottom: 15px;">Getting Started:</h2>
          <ul style="padding-left: 20px; line-height: 1.6;">
            <li>Download KinScreen for your device</li>
            <li>Sign in with your email: ${email}</li>
            <li>Start sharing your memories!</li>
          </ul>
        </div>

        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>Need help? Contact our support team at support@kinscreen.com</p>
        </div>
      </div>
    `
  });
};

export const sendGiftEmail = async (recipientEmail: string, senderName: string, planName: string) => {
  console.log('Gift Email: Starting send process', { recipientEmail, senderName, planName });
  return sendEmail({
    to: recipientEmail,
    subject: 'You\'ve Received a KinScreen Gift! 🎁',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1a1a1a; color: #ffffff; padding: 40px; border-radius: 12px;">
          <h1 style="text-align: center; color: #ffffff; margin-bottom: 30px;">
            You've Received a Gift! 🎁
          </h1>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            Dear ${recipientEmail},
          </p>

          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
            ${senderName} has gifted you a ${planName} subscription to KinScreen!
          </p>

          <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #ffffff; margin-bottom: 15px;">Get Started Now:</h2>
            <ol style="padding-left: 20px;">
              <li style="margin-bottom: 10px;">Download KinScreen for your device</li>
              <li style="margin-bottom: 10px">Install the application</li>
              <li style="margin-bottom: 10px">Sign in with this email address</li>
              <li style="margin-bottom: 10px">Your gift subscription will be automatically activated</li>
            </ol>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.7);">
              Need help? Contact our support team at support@kinscreen.com
            </p>
          </div>
        </div>
      </div>
    `
  });
};

export const sendCancellationEmail = async (email: string, name: string) => {
  console.log('Cancellation Email: Starting send process', { email, name });
  return sendEmail({
    to: email,
    subject: 'KinScreen Subscription Cancellation Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #6D28D9; margin-bottom: 20px;">Subscription Cancellation Confirmation</h1>
        <p>Dear ${name},</p>
        <p>We've received your request to cancel your KinScreen subscription.</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
          <h2 style="color: #4C1D95; margin-bottom: 15px;">What happens next:</h2>
          <ul style="padding-left: 20px; line-height: 1.6;">
            <li>Your subscription will remain active until the end of your current billing period</li>
            <li>You'll still have access to all your photos and memories</li>
            <li>No further payments will be charged</li>
            <li>You can reactivate your subscription at any time</li>
          </ul>
        </div>

        <p>We're sorry to see you go. If you change your mind, you can reactivate your subscription at any time.</p>

        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>Need help? Contact our support team at support@kinscreen.com</p>
        </div>
      </div>
    `
  });
};
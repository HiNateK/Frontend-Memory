const BACKEND_URL = 'https://backend-memory-f33i.onrender.com';
const SENDER_EMAIL = 'support@kinscreen.com';

const sendEmail = async (options: {
  to: string;
  subject: string;
  text: string;
}) => {
  console.log('Email Service: Starting email send process');
  console.log('Email Service: Sending to:', options.to);
  console.log('Email Service: From:', SENDER_EMAIL);
  console.log('Email Service: Subject:', options.subject);
  
  try {
    console.log('Email Service: Making request to backend:', `${BACKEND_URL}/send-email`);
    
    const requestBody = {
      from: SENDER_EMAIL,
      to: options.to,
      subject: options.subject,
      text: options.text
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
  
  const isFreeTrial = planName === 'Free Trial';
  
  return sendEmail({
    to: email,
    subject: 'Welcome to KinScreen!',
    text: `Dear ${name},

Thank you for choosing KinScreen! ${isFreeTrial ? 'Welcome to your free trial!' : `Thank you for subscribing to our ${planName} plan.`}

${isFreeTrial ? `Your Free Trial Details:
- 7 days of full access
- All premium features included
- $1 authorization charge (will be refunded)
- Converts to $5/month after trial
- Cancel anytime during trial at no cost` : ''}

Getting Started:
1. Download KinScreen for your device:
   - Windows: https://download.kinscreen.com/windows
   - Mac: https://download.kinscreen.com/mac

2. Sign in with your email: ${email}

3. Start sharing your memories!

Important Links:
- Download Page: https://kinscreen.com/download
- Support Center: https://kinscreen.com/support
- Account Settings: https://kinscreen.com/account

Need help? Our support team is here for you:
- Email: support@kinscreen.com
- Phone: 1-800-MEMORY
- Live Chat: Available 24/7 on our website

${isFreeTrial ? `\nReminder: Your free trial will automatically convert to a $5/month subscription after 7 days. You can cancel anytime during the trial period at no cost.` : ''}

Best regards,
The KinScreen Team`
  });
};

export const sendGiftEmail = async (recipientEmail: string, senderName: string, planName: string) => {
  console.log('Gift Email: Starting send process', { recipientEmail, senderName, planName });
  return sendEmail({
    to: recipientEmail,
    subject: 'You\'ve Received a KinScreen Gift! 🎁',
    text: `Dear ${recipientEmail},

Great news! ${senderName} has gifted you a ${planName} subscription to KinScreen - a beautiful way to keep your family memories always in view!

Get Started Now:
1. Download KinScreen for your device:
   - Windows: https://download.kinscreen.com/windows
   - Mac: https://download.kinscreen.com/mac

2. Install the application
3. Sign in with this email address
4. Your gift subscription will be automatically activated

Need help? Our support team is here for you:
- Email: support@kinscreen.com
- Phone: 1-800-MEMORY
- Live Chat: Available 24/7 on our website

Enjoy your gift!
The KinScreen Team`
  });
};

export const sendCancellationEmail = async (email: string, name: string) => {
  console.log('Cancellation Email: Starting send process', { email, name });
  return sendEmail({
    to: email,
    subject: 'KinScreen Subscription Cancellation Confirmation',
    text: `Dear ${name},

We've received your request to cancel your KinScreen subscription.

What happens next:
- Your subscription will remain active until the end of your current billing period
- You'll still have access to all your photos and memories
- No further payments will be charged
- You can reactivate your subscription at any time

We're sorry to see you go. If you change your mind, you can reactivate your subscription at any time.

Need help? Contact our support team at support@kinscreen.com

Best regards,
The KinScreen Team`
  });
};

export const sendOrderConfirmationEmail = async (email: string, name: string, planName: string, amount: string, isFreeTrial: boolean = false) => {
  console.log('Order Confirmation Email: Starting send process', { email, name, planName, amount, isFreeTrial });
  
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const orderNumber = `KS-${Date.now().toString(36).toUpperCase()}`;

  return sendEmail({
    to: email,
    subject: `KinScreen - Order Confirmation #${orderNumber}`,
    text: `Dear ${name},

Thank you for your order! Here's your receipt:

Order Details:
-------------
Order Number: ${orderNumber}
Date: ${orderDate}
Plan: ${planName}
${isFreeTrial 
  ? 'Trial Period: 7 days\nAmount: $1.00 (authorization charge, will be refunded)\nRegular Price: $5.00/month after trial'
  : `Amount: ${amount}`}

Billing Summary:
---------------
Subtotal: ${amount}
Tax: $0.00
Total: ${amount}

${isFreeTrial 
  ? `\nImportant Trial Information:
- Your free trial starts today
- $1 authorization charge will be refunded
- After 7 days, you'll be charged $5.00/month
- Cancel anytime during trial at no cost`
  : ''}

Your subscription is now active. You can start using KinScreen right away!

Access your account:
- Visit: https://app.kinscreen.com
- Email: ${email}

Need help? Contact our support team:
- Email: support@kinscreen.com
- Phone: 1-800-MEMORY

Thank you for choosing KinScreen!

Best regards,
The KinScreen Team

Note: This is an automated email. Please do not reply to this message.`
  });
};
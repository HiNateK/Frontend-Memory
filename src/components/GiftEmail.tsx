import React from 'react';

type GiftEmailProps = {
  recipientEmail: string;
  senderName: string;
  planName: string;
};

export default function GiftEmail({ recipientEmail, senderName, planName }: GiftEmailProps) {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: '#1a1a1a', color: '#ffffff', padding: '40px', borderRadius: '12px' }}>
        <h1 style={{ textAlign: 'center', color: '#ffffff', marginBottom: '30px' }}>
          You've Received a Gift! 🎁
        </h1>

        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          Dear {recipientEmail},
        </p>

        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
          {senderName} has gifted you a {planName} subscription to KinScreen - a beautiful way to keep your family memories always in view!
        </p>

        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>About KinScreen</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
            KinScreen transforms your idle screen into a living family photo album. Share precious moments with loved ones and keep your memories alive in a beautiful, digital display.
          </p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Get Started Now:</h2>
          <ol style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '15px' }}>Choose your version:</li>
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <a
                href="#windows-download"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  textAlign: 'center',
                  flex: 1
                }}
              >
                Download for Windows
              </a>
              <a
                href="#mac-download"
                style={{
                  display: 'inline-block',
                  padding: '12px 24px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  textAlign: 'center',
                  flex: 1
                }}
              >
                Download for Mac
              </a>
            </div>
            <li style={{ marginBottom: '15px' }}>Install the application on your device</li>
            <li style={{ marginBottom: '15px' }}>Launch KinScreen and sign in with this email address</li>
            <li style={{ marginBottom: '15px' }}>Your gift subscription will be automatically activated</li>
          </ol>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
          <h2 style={{ color: '#ffffff', marginBottom: '15px' }}>Personal Message from {senderName}:</h2>
          <p style={{ fontSize: '16px', lineHeight: '1.6', fontStyle: 'italic' }}>
            "I hope this gift helps you keep our family memories close and brings a smile to your face every day. Enjoy reliving our precious moments together!"
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            Need help? Contact our support team at support@kinscreen.com
          </p>
        </div>
      </div>
    </div>
  );
}
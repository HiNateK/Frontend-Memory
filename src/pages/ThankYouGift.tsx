import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Gift, ArrowRight, Mail } from 'lucide-react';
import GiftEmail from '../components/GiftEmail';

export default function ThankYouGift() {
  const location = useLocation();
  const { giftEmail, plan, senderName = "Your loved one" } = location.state || { 
    giftEmail: '', 
    plan: 'Family',
    senderName: "Your loved one"
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
          <div className="w-20 h-20 mx-auto bg-purple-500/30 rounded-full flex items-center justify-center mb-8">
            <Gift className="w-10 h-10" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Gift Sent Successfully!</h1>
          <p className="text-xl text-purple-100 mb-8">
            Your {plan} plan gift has been sent to:
            <br />
            <span className="font-semibold text-white">{giftEmail}</span>
          </p>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">What happens next?</h2>
              <p className="text-purple-100">
                The recipient will receive an email with instructions on how to activate their gift subscription.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Preview of the email sent:</h2>
              <div className="max-h-96 overflow-y-auto">
                <GiftEmail 
                  recipientEmail={giftEmail}
                  senderName={senderName}
                  planName={plan}
                />
              </div>
            </div>

            <Link
              to="/"
              className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-8 py-3 rounded-xl transition-all hover:scale-105 border border-white/10"
            >
              Return Home
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
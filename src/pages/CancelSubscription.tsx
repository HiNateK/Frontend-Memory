import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { cancelSubscription } from '../services/subscription';
import { sendCancellationEmail } from '../services/email';

export default function CancelSubscription() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [cancellationMessage, setCancellationMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const result = await cancelSubscription(email, name);
      
      if (result.success) {
        await sendCancellationEmail(email, name);
        setShowConfirmation(true);
        setCancellationMessage(result.message);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('There was an error processing your cancellation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showConfirmation) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/10">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Cancellation Confirmed</h1>
            <p className="text-purple-100 mb-6">
              {cancellationMessage}
            </p>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 border border-white/10"
              >
                Return to Home
              </button>
              <button
                onClick={() => window.location.href = 'mailto:support@kinscreen.com'}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 border border-purple-500/20"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <X className="w-6 h-6 text-red-400" />
            <h1 className="text-2xl font-bold">Cancel Subscription</h1>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-200">
                <p className="font-medium mb-1">Before you go:</p>
                <ul className="list-disc ml-4 space-y-1">
                  <li>Your subscription will remain active until the end of your current billing period</li>
                  <li>You'll still have access to all your photos and memories</li>
                  <li>You can reactivate your subscription at any time</li>
                  <li>No refunds are provided for partial months</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Your Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40"
                placeholder="Enter your account email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40"
                placeholder="Enter your full name"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting || !email || !name}
                className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-200 px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 border border-red-500/20"
              >
                {isSubmitting ? 'Processing...' : 'Cancel My Subscription'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all hover:scale-105 border border-white/10 flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Go Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
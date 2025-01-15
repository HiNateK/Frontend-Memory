import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { 
  CreditCard, 
  Gift, 
  ChevronRight, 
  Check,
  Lock,
  Wallet,
  Tag,
  AlertCircle,
  User,
  Mail,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { sendGiftEmail } from '../services/email';
import { initializePayment } from '../services/payments';
import StripeCardForm from '../components/StripeCardForm';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Redirect to pricing if no plan is selected
  useEffect(() => {
    if (!location.state?.plan) {
      navigate('/pricing');
    }
  }, [location.state, navigate]);

  const { plan } = location.state || { plan: { name: 'Basic', price: '$5', description: 'Monthly plan' } };
  
  const [isGift, setIsGift] = useState(false);
  const [giftEmail, setGiftEmail] = useState('');
  const [gifterName, setGifterName] = useState('');
  const [giftMessage, setGiftMessage] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize payment immediately when component mounts
  useEffect(() => {
    const initPayment = async () => {
      if (promoApplied || paymentMethod !== 'card') return;
      
      try {
        setError(null);
        const amount = parseFloat(plan.price.replace('$', ''));
        const { clientSecret: secret } = await initializePayment(amount);
        setClientSecret(secret);
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError('Failed to initialize payment. Please try again.');
      }
    };

    initPayment();
  }, [plan.price, promoApplied, paymentMethod]);

  const handlePromoCode = () => {
    if (promoCode.toLowerCase() === 'free') {
      setPromoApplied(true);
      setError(null);
      setClientSecret(null);
    } else {
      setError('Invalid promo code');
    }
  };

  const handlePaymentSuccess = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      if (isGift && giftEmail) {
        await sendGiftEmail(giftEmail, gifterName || customerName, plan.name);
        navigate('/thank-you-gift', { 
          state: { 
            giftEmail,
            plan: plan.name,
            senderName: gifterName || customerName,
            giftMessage
          }
        });
      } else {
        navigate('/thank-you', { state: { plan: plan.name } });
      }
    } catch (err) {
      setError('Failed to process payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Checkout</h1>

        {/* Plan Summary */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{plan.name} Plan</p>
              <p className="text-purple-200">{plan.description}</p>
            </div>
            <p className="text-2xl font-bold">{plan.price}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Your Name</h2>
              </div>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <Mail className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Your Email</h2>
              </div>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
        </div>

        {/* Gift Option */}
        <div 
          className={`bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border transition-all duration-300 ${
            isGift 
              ? 'border-purple-500/30 bg-white/10' 
              : 'border-white/10 hover:border-white/20'
          }`}
        >
          <button
            onClick={() => setIsGift(!isGift)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5" />
                <h2 className="text-xl font-semibold">Make this a gift</h2>
              </div>
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isGift ? 'rotate-90' : ''}`} />
            </div>
          </button>

          {isGift && (
            <div className="space-y-4 mt-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient's Email</label>
                <input
                  type="email"
                  value={giftEmail}
                  onChange={(e) => setGiftEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40"
                  placeholder="Enter recipient's email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Your Name (as shown on gift)</label>
                <input
                  type="text"
                  value={gifterName}
                  onChange={(e) => setGifterName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40"
                  placeholder="Name to show on the gift message (optional)"
                />
                <p className="text-sm text-purple-200 mt-1">
                  Leave blank to use your name from above
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-purple-300" />
                  <label className="text-sm font-medium">Personal Message (Optional)</label>
                </div>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40 resize-none"
                  placeholder="Add a personal message to your gift"
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-8 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Promo Code */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <Tag className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Promo Code</h2>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:border-white/40 disabled:opacity-50"
              placeholder="Enter promo code"
            />
            <button
              onClick={handlePromoCode}
              disabled={promoApplied || !promoCode}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 disabled:opacity-50 transition-all"
            >
              Apply
            </button>
          </div>
          {promoApplied && (
            <div className="flex items-center gap-2 mt-3 text-green-400">
              <Check className="w-4 h-4" />
              <span>Promo code applied successfully!</span>
            </div>
          )}
        </div>

        {!promoApplied && (
          <>
            {/* Payment Method Selection */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl backdrop-blur-lg transition-all duration-300 cursor-pointer border ${
                    paymentMethod === 'card'
                      ? 'bg-white/15 border-purple-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6" />
                    <span className="font-semibold">Credit Card</span>
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl backdrop-blur-lg transition-all duration-300 cursor-pointer border ${
                    paymentMethod === 'paypal'
                      ? 'bg-white/15 border-purple-500/50'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className="flex items-center gap-4">
                    <Wallet className="w-6 h-6" />
                    <span className="font-semibold">PayPal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/10">
              {paymentMethod === 'card' && (
                <StripeCardForm 
                  clientSecret={clientSecret}
                  onSuccess={handlePaymentSuccess}
                  customerEmail={customerEmail}
                  customerName={customerName}
                  planName={plan.name}
                />
              )}
              {paymentMethod === 'paypal' && (
                <PayPalScriptProvider options={{ 
                  "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID
                }}>
                  <PayPalButtons
                    style={{ layout: "horizontal" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          amount: {
                            value: plan.price.replace('$', '')
                          }
                        }]
                      });
                    }}
                    onApprove={handlePaymentSuccess}
                  />
                </PayPalScriptProvider>
              )}
            </div>
          </>
        )}

        {/* Free Checkout Button */}
        {promoApplied && (
          <button
            onClick={handlePaymentSuccess}
            disabled={isProcessing || (isGift && !giftEmail) || !customerEmail || !customerName}
            className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isProcessing ? 'Processing...' : 'Complete Order'}
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-2 mt-8 text-purple-200">
          <Lock className="w-4 h-4" />
          <span className="text-sm">Secure checkout powered by Stripe</span>
        </div>
      </div>
    </div>
  );
}
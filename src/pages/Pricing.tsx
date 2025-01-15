import React from 'react';
import { Check, ArrowRight, Zap, Gift, Star, Shield, Clock, Infinity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "7 days",
    description: "Try KinScreen risk-free",
    features: [
      "Basic photo transitions",
      "Single device support",
      "Email support",
      "Up to 100 photos",
      "Basic sharing features",
      "7-day full access",
      "Converts to $5/month"
    ],
    highlight: "No credit card required"
  },
  {
    name: "Monthly",
    price: "$5",
    period: "monthly",
    description: "Full access with auto-renewal",
    popular: true,
    features: [
      "Premium transitions & effects",
      "Up to 5 devices",
      "Priority support 24/7",
      "Unlimited photos",
      "Advanced sharing features",
      "Family access included",
      "Cancel anytime",
      "Auto-renews monthly"
    ],
    highlight: "Most flexible option",
    subscription: true
  },
  {
    name: "Lifetime",
    price: "$29.99",
    period: "one-time",
    description: "Best value for families",
    features: [
      "Everything in Monthly plan",
      "Lifetime access",
      "Premium support forever",
      "Early access to new features",
      "Exclusive content & effects",
      "Priority feature requests",
      "Free upgrades for life"
    ],
    highlight: "Best long-term value",
    special: true
  }
];

const benefits = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure & Private",
    description: "Your memories stay on your devices"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Flexible Options",
    description: "Choose monthly or lifetime"
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "Premium Support",
    description: "Help when you need it"
  }
];

const Pricing = () => {
  const navigate = useNavigate();

  const handlePlanSelection = (plan: typeof plans[0]) => {
    navigate('/checkout', {
      state: {
        plan: {
          name: plan.name,
          price: plan.price,
          period: plan.period,
          description: plan.description,
          features: plan.features,
          subscription: plan.subscription
        }
      }
    });
  };

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Simple, Transparent Pricing</h1>
        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
          Choose the perfect plan for your family memories
        </p>
      </section>

      {/* Gift Highlight */}
      <section className="mb-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Give the Gift of Memories</h2>
              <p className="text-purple-100">
                Share the joy of KinScreen with your loved ones. Choose between monthly or lifetime access.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="mb-20">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative group backdrop-blur-lg rounded-2xl p-8 transition-all hover:scale-105 border ${
                plan.popular 
                  ? 'bg-white/10 transform scale-105 border-purple-500/30' 
                  : plan.special
                    ? 'bg-gradient-to-b from-blue-500/10 to-purple-500/10 border-blue-500/30'
                    : 'bg-white/5 border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </div>
              )}
              {plan.special && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 to-purple-400 text-white px-6 py-1 rounded-full text-sm font-medium">
                  Best Value
                </div>
              )}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-purple-100 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-purple-200">/{plan.period}</span>
                </div>
                {plan.highlight && (
                  <span className="inline-block mt-2 text-sm text-purple-300">{plan.highlight}</span>
                )}
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-purple-400" />
                    <span className="text-purple-100">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelection(plan)}
                className={`w-full group backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2 border ${
                  plan.name === "Free Trial" 
                    ? 'bg-purple-500/30 hover:bg-purple-500/40 border-purple-500/30' 
                    : plan.special
                      ? 'bg-blue-500/20 hover:bg-blue-500/30 border-blue-500/30'
                      : 'bg-white/15 hover:bg-white/25 border-white/20'
                }`}
              >
                {plan.name === "Free Trial" ? (
                  <>
                    Start Free Trial
                    <Zap className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : plan.name === "Lifetime" ? (
                  <>
                    Get Lifetime Access
                    <Infinity className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Subscribe Monthly
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-purple-100">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mb-20">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-center">Common Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">What's included in the lifetime plan?</h3>
              <p className="text-purple-100">
                The lifetime plan includes permanent access to all KinScreen features, premium support, and free upgrades for life. It's a one-time payment with no recurring charges.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">How does the free trial work?</h3>
              <p className="text-purple-100">
                Start with 7 days of full access to test all features. After the trial, you'll be automatically enrolled in the monthly plan unless you cancel or choose lifetime access.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Can I switch plans later?</h3>
              <p className="text-purple-100">
                Yes, you can upgrade from monthly to lifetime at any time. The cost of your current month will be prorated towards the lifetime plan.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
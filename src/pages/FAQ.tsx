import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "How does MemoryScreen work?",
    answer: "MemoryScreen transforms your idle computer screen into a digital photo display, showing your cherished family photos when you're not actively using your device."
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we take security seriously. All your photos are stored locally on your device and are never uploaded to our servers without your explicit permission."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription in two easy ways:\n\n1. Through our cancellation page:\n   - Visit our dedicated cancellation page\n   - Enter your email and name\n   - Confirm your cancellation\n\n2. Via email:\n   - Send an email to support@memoryscreen.com\n   - Include your account email\n   - Use \"Cancel Subscription\" as the subject line\n\nAfter cancellation, you'll maintain access until the end of your current billing period. No refunds are provided for partial months.",
    action: {
      text: "Cancel Subscription",
      link: "/cancel-subscription"
    }
  },
  {
    question: "What happens after I cancel?",
    answer: "After cancellation:\n\n- Your subscription remains active until the end of your current billing period\n- You'll continue to have full access to all features during this time\n- No further payments will be charged\n- Your account will revert to basic features after the period ends\n- You can reactivate your subscription at any time"
  },
  {
    question: "Can I get a refund?",
    answer: "For monthly subscriptions, we don't provide refunds for partial months, but you can cancel anytime and maintain access until the end of your current billing period. For gift purchases, please contact our support team within 24 hours of purchase if you need assistance."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
          Find answers to common questions about MemoryScreen
        </p>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto mb-20">
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-left">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                )}
              </button>
              <div
                className={`px-6 transition-all duration-300 ${
                  openIndex === index ? 'py-4 border-t border-white/10' : 'max-h-0 overflow-hidden'
                }`}
              >
                <p className="text-purple-100 whitespace-pre-line">{faq.answer}</p>
                {faq.action && (
                  <Link
                    to={faq.action.link}
                    className="inline-block mt-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-xl font-medium text-sm transition-all hover:scale-105 border border-white/10"
                  >
                    {faq.action.text}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="mb-20">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-purple-100 mb-8">
            Our support team is here to help you with any questions you might have.
          </p>
          <Link 
            to="/contact"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 border border-white/10"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
}
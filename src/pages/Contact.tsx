import React, { useState } from 'react';
import { Mail, Phone, MapPin, Check, AlertCircle } from 'lucide-react';
import { submitContactForm } from '../services/contact';

const contactMethods = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone Support",
    description: "Call us for immediate help",
    action: "Coming soon!",
    link: "#"
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email Support",
    description: "Get help via email",
    action: "support@kinscreen.com",
    link: "mailto:support@kinscreen.com"
  }
];

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await submitContactForm(formData);
      
      if (response.success) {
        setSubmitStatus({
          type: 'success',
          message: response.message
        });
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          message: ''
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Get in Touch</h1>
        <p className="text-xl text-purple-100 max-w-3xl mx-auto">
          We're here to help you with any questions about KinScreen
        </p>
      </section>

      {/* Contact Methods */}
      <section className="mb-20">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {contactMethods.map((method, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105 border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {method.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
              <p className="text-purple-100 mb-4">{method.description}</p>
              <a
                href={method.link}
                className="inline-block bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium text-sm transition-all hover:scale-105 border border-white/10"
              >
                {method.action}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="mb-20">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
          <h2 className="text-3xl font-bold mb-8 text-center">Send us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="John"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
                  placeholder="Doe"
                  required
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
                placeholder="john@example.com"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 transition-colors resize-none"
                placeholder="How can we help you?"
                required
                disabled={isSubmitting}
              ></textarea>
            </div>

            {submitStatus.message && (
              <div className={`flex items-center gap-2 p-4 rounded-xl ${
                submitStatus.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/30'
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                {submitStatus.type === 'success' ? (
                  <Check className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={submitStatus.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                  {submitStatus.message}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 border border-white/10 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Office Location */}
      <section className="mb-20">
        <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
          <div className="flex items-center justify-center gap-4 mb-6">
            <MapPin className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Our location</h2>
          </div>
          <div className="text-center space-y-2">
            <p className="text-purple-100">Hawaii</p>
            <p className="text-purple-100">United States</p>
          </div>
        </div>
      </section>
    </div>
  );
}
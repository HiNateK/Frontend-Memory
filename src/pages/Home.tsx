import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ArrowRight,
  Play,
  Heart,
  Lock,
  Clock,
  MousePointer2,
  Layout,
  Gift,
  Check,
  AlertCircle
} from 'lucide-react';
import ImageViewer from '../components/ImageViewer';
import VideoModal from '../components/VideoModal';
import { subscribeToNewsletter, SubscribeResult } from '../services/newsletter';

// Trust Badges Data
const trustBadges: { icon: JSX.Element; text: string; }[] = [
  { icon: <Shield className="w-6 h-6" />, text: "Secure Payment" },
  { icon: <Lock className="w-6 h-6" />, text: "Privacy Protected" },
  { icon: <Clock className="w-6 h-6" />, text: "24/7 Support" },
  { icon: <Heart className="w-6 h-6" />, text: "100% Satisfaction" }
];

// Features Data
const features: { icon: JSX.Element; title: string; description: string; }[] = [
  {
    icon: <MousePointer2 />,
    title: "Easy to Use",
    description: "Simple controls designed for all ages"
  },
  {
    icon: <Layout />,
    title: "Works Everywhere",
    description: "Compatible with Mac and Windows devices"
  },
  {
    icon: <Lock />,
    title: "Private & Secure",
    description: "Your photos stay on your device"
  },
  {
    icon: <Gift />,
    title: "Gift Option",
    description: "Share with loved ones"
  }
];

// Demo Images
const demoImages: string[] = [
  "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=1600&h=900&q=80",
  "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1600&h=900&q=80",
  "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1600&h=900&q=80",
];

interface SubscriptionStatus {
  message: string;
  type: 'success' | 'error' | null;
}

export default function Home(): JSX.Element {
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({ message: '', type: null });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubscriptionStatus({ message: '', type: null });

    try {
      const result: SubscribeResult = await subscribeToNewsletter(email);
      
      setSubscriptionStatus({
        message: result.message,
        type: result.success ? 'success' : 'error'
      });

      if (result.success) {
        setEmail('');
      }
    } catch (error: any) {
      setSubscriptionStatus({
        message: 'Failed to subscribe. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="pb-20 px-4 bg-inherit">
        <div className="container mx-auto max-w-6xl relative">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 animate-float-slow">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/30 to-purple-400/10 backdrop-blur-sm"></div>
            </div>
            <div className="absolute bottom-20 right-10 animate-float-medium">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/30 to-blue-400/10 backdrop-blur-sm"></div>
            </div>
            <div className="absolute top-40 right-20 animate-float-slow delay-1000">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400/20 to-teal-400/5 backdrop-blur-sm"></div>
            </div>
          </div>

          <div className="relative z-10 text-center space-y-8">
            <div className="relative inline-block">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Let Rama surprise and delight you
                <br />
                <span className="text-yellow-300 relative">
                  Can Rama even tell the future?
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M0 4C50 4 50 7 100 7C150 7 150 1 200 1" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-purple-100 max-w-3xl mx-auto">
              Well... maybe, maybe not...
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <Link 
                to="/pricing"
                className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-xl transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2 w-full md:w-auto justify-center border border-white/10"
              >
                Try it for free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button 
                onClick={() => setIsVideoOpen(true)}
                className="group bg-purple-700/30 backdrop-blur-sm hover:bg-purple-700/40 px-8 py-4 rounded-xl font-semibold text-xl transition-all hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center border border-purple-500/30"
              >
                Watch Demo
                <Play className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-inherit">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {trustBadges.map((badge, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105 border border-white/10">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {badge.icon}
                  </div>
                  <p className="text-sm font-medium">{badge.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-12 bg-inherit">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ImageViewer images={demoImages} interval={5000} />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-inherit">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Need to Stay Connected
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`group p-6 rounded-xl backdrop-blur-lg transition-all duration-500 border border-white/10 ${
                  index === activeFeature 
                    ? 'bg-white/15 scale-105 shadow-lg' 
                    : 'bg-white/5 hover:bg-white/10 hover:-translate-y-1'
                }`}
              >
                <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-purple-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-inherit">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Stay Updated with Family Tips
              </h2>
              <p className="text-xl text-purple-100">
                Join our newsletter for helpful tips on preserving family memories
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
                  <input
                    id="emailInput"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="px-6 py-3 rounded-xl bg-transparent backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 text-lg w-full"
                    required
                    disabled={isSubmitting}
                  />
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-transparent hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 whitespace-nowrap border border-white/10 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
                
                {subscriptionStatus.message && (
                  <div className={`flex items-center gap-2 justify-center p-3 rounded-xl ${
                    subscriptionStatus.type === 'success' 
                      ? 'bg-green-500/20 text-green-200' 
                      : 'bg-red-500/20 text-red-200'
                  }`}>
                    {subscriptionStatus.type === 'success' ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{subscriptionStatus.message}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </>
  );
}
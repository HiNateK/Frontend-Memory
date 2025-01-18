import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Download, 
  ArrowRight, 
  Star, 
  Menu, 
  X, 
  Clock, 
  Lock, 
  MousePointer2, 
  Layout, 
  Phone,
  Mail,
  MessageCircle,
  Gift,
  Heart,
  Play
} from 'lucide-react';

// Navigation Links Data
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

// Trust Badges Data
const trustBadges = [
  { icon: <Shield className="w-6 h-6" />, text: "Secure Payment" },
  { icon: <Lock className="w-6 h-6" />, text: "Privacy Protected" },
  { icon: <Clock className="w-6 h-6" />, text: "24/7 Support" },
  { icon: <Heart className="w-6 h-6" />, text: "100% Satisfaction" }
];

// Features Data
const features = [
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

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 text-white">
      {/* Modern Header with Navigation */}
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 right-0 z-50 transition-all duration-300 max-w-7xl w-[95%] rounded-2xl ${
        isScrolled ? 'bg-white/10 backdrop-blur-md shadow-lg' : 'bg-white/5 backdrop-blur-sm'
      }`}>
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl md:text-3xl font-bold hover:text-purple-200 transition relative group">
              KinScreen
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-300 group-hover:w-full"></span>
            </a>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-3 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-1.5 mr-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm rounded-lg hover:bg-white/10 transition-all hover:scale-105 inline-block"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
              <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all hover:scale-105 hover:shadow-lg border border-white/10">
                Try it for Free
              </button>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <nav className={`md:hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-2 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-2.5 text-sm text-center rounded-lg hover:bg-white/10 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-lg font-medium text-sm transition-all hover:scale-105 mt-2 border border-white/10">
                Try it for Free
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-8">
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
              <button className="group bg-white/10 backdrop-blur-sm hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-xl transition-all hover:scale-105 hover:shadow-xl flex items-center gap-2 w-full md:w-auto justify-center border border-white/10">
                Try it for Free
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group bg-purple-700/30 backdrop-blur-sm hover:bg-purple-700/40 px-8 py-4 rounded-xl font-semibold text-xl transition-all hover:scale-105 flex items-center gap-2 w-full md:w-auto justify-center border border-purple-500/30">
                Watch Demo
                <Play className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div className="absolute top-20 left-10 animate-float-slow">
              <div className="w-20 h-20 rounded-full bg-purple-400/20 backdrop-blur-sm"></div>
            </div>
            <div className="absolute bottom-20 right-10 animate-float-medium">
              <div className="w-32 h-32 rounded-full bg-blue-400/20 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12">
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

      {/* Features */}
      <section className="py-20">
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

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-transparent via-purple-600/20 to-transparent">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            What Our Family Members Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="group p-6 rounded-xl bg-white/5 backdrop-blur-lg hover:bg-white/10 transition-all hover:-translate-y-1 border border-white/10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                  ))}
                </div>
                <p className="text-lg mb-4 text-purple-100">
                  "KinScreen has transformed how we stay connected as a family. It's beautiful and so easy to use!"
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="font-semibold">Sarah Johnson</p>
                  <p className="text-sm text-purple-200">Family Photographer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
            <div className="text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Stay Updated with Family Tips
              </h2>
              <p className="text-xl text-purple-100">
                Join our newsletter for helpful tips on preserving family memories
              </p>
              <form className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 focus:outline-none focus:border-white/40 text-lg w-full"
                />
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 whitespace-nowrap border border-white/10">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KinScreen</h3>
              <p className="text-purple-100">
                Keeping families connected through shared memories
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-purple-100 hover:text-white transition">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-purple-100 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="/terms" className="text-purple-100 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-purple-100">
                  <Mail size={16} />
                  support@kinscreen.com
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-100">© 2024 KinScreen. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-black/80 backdrop-blur-lg rounded-xl text-white p-4 z-50 border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCookieConsent(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium transition-all hover:scale-105 border border-white/10"
              >
                Accept
              </button>
              <button
                onClick={() => setShowCookieConsent(false)}
                className="px-4 py-2 bg-transparent border border-white/20 rounded-lg text-sm font-medium hover:bg-white/10 transition-all hover:scale-105"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
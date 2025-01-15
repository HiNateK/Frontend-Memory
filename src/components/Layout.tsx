import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, Mail, Phone } from 'lucide-react';

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" }
];

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-500 to-teal-400 text-white">
      {/* Header */}
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 right-0 z-50 transition-all duration-300 max-w-7xl w-[95%] rounded-2xl ${
        isScrolled || isMenuOpen ? 'bg-white/10 backdrop-blur-md shadow-lg' : 'bg-white/5 backdrop-blur-sm'
      }`}>
        <div className="px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl md:text-2xl font-bold hover:text-purple-200 transition relative group">
              KinScreen
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-300 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <button 
              className="md:hidden p-2 hover:bg-white/10 rounded-xl transition-all duration-300 border border-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <nav className="hidden md:flex items-center gap-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-1.5 mr-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`px-4 py-2 text-sm rounded-lg transition-all hover:scale-105 inline-block
                      ${location.pathname === link.href ? 'bg-white/15' : 'hover:bg-white/10'}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <Link 
                to="/checkout"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-all hover:scale-105 hover:shadow-lg border border-white/10"
              >
                Start Free Trial
              </Link>
            </nav>
          </div>

          {/* Mobile Navigation */}
          <nav className={`md:hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-screen opacity-100 mt-4' : 'max-h-0 opacity-0'
          } overflow-hidden`}>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-2 space-y-1 border border-white/10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`block px-3 py-2 text-sm text-center rounded-lg transition-all mobile-text-adjust
                    ${location.pathname === link.href ? 'bg-white/15' : 'hover:bg-white/10'}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link 
                to="/checkout"
                className="block w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm transition-all hover:scale-105 mt-2 border border-white/10 mobile-text-adjust"
                onClick={() => setIsMenuOpen(false)}
              >
                Start Free Trial
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-lg mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">KinScreen</h3>
              <p className="text-purple-100 mobile-text-adjust">
                Keeping families connected through shared memories
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-purple-100 hover:text-white transition mobile-text-adjust">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-purple-100 hover:text-white transition mobile-text-adjust">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-purple-100 hover:text-white transition mobile-text-adjust">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-purple-100 hover:text-white transition mobile-text-adjust">Cookie Policy</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-purple-100 mobile-text-adjust">
                  <Mail size={16} />
                  support@kinscreen.com
                </li>
                <li className="flex items-center gap-2 text-purple-100 mobile-text-adjust">
                  <Phone size={16} />
                  1-800-MEMORY
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-purple-100 mobile-text-adjust">© 2024 KinScreen. All rights reserved.</p>
              <p className="text-sm text-purple-200 mobile-text-adjust">Cancel anytime via your account or email support@kinscreen.com</p>
            </div>
            <div className="flex gap-4">
              <a href="#" className="text-purple-100 hover:text-white transition mobile-text-adjust">Facebook</a>
              <a href="#" className="text-purple-100 hover:text-white transition mobile-text-adjust">Twitter</a>
              <a href="#" className="text-purple-100 hover:text-white transition mobile-text-adjust">Instagram</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent */}
      {showCookieConsent && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl bg-black/80 backdrop-blur-lg rounded-xl text-white p-4 z-50 border border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left mobile-text-adjust">
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
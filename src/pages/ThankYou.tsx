import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Download, ArrowRight, Monitor } from 'lucide-react';

export default function ThankYou() {
  const location = useLocation();
  const { plan } = location.state || { plan: 'Family' };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Thank You for Your Purchase!</h1>
          <p className="text-xl text-purple-100 mb-8">
            Welcome to the {plan} plan. You're now ready to start using MemoryScreen!
          </p>

          <div className="space-y-6 mb-12">
            <h2 className="text-2xl font-semibold">Download MemoryScreen</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <a
                href="#windows-download"
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm p-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-3 border border-white/10"
              >
                <Download className="w-5 h-5" />
                <span>Download for Windows</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#mac-download"
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm p-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-3 border border-white/10"
              >
                <Download className="w-5 h-5" />
                <span>Download for Mac</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Next Steps</h2>
            <div className="grid gap-4">
              <Link
                to="/getting-started"
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-sm p-6 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-3 border border-white/10"
              >
                <Monitor className="w-5 h-5" />
                <span>View Getting Started Guide</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
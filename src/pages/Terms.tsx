import React from 'react';
import { Shield, Lock, Scale } from 'lucide-react';

export default function Terms() {
  return (
    <div className="container mx-auto px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            </div>
            <p className="text-purple-100">
              By accessing and using MemoryScreen, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">2. Privacy & Security</h2>
            </div>
            <p className="text-purple-100">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal information.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">3. User Responsibilities</h2>
            </div>
            <p className="text-purple-100">
              Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.
            </p>
          </div>

          {/* Additional sections can be added here */}
        </div>
      </section>
    </div>
  );
}
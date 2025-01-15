import React from 'react';
import { Shield, Eye, Database } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="container mx-auto px-4">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">Data Protection</h2>
            </div>
            <p className="text-purple-100">
              We implement robust security measures to protect your personal information and photos. All data is encrypted both in transit and at rest.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">Information We Collect</h2>
            </div>
            <p className="text-purple-100">
              We collect only the information necessary to provide our services, including email addresses and usage statistics to improve your experience.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold">Data Storage</h2>
            </div>
            <p className="text-purple-100">
              Your photos are stored locally on your device by default. Cloud storage is optional and only used when explicitly enabled by you.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
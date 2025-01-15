import React from 'react';
import { Users, Heart, Shield, Clock } from 'lucide-react';

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Passionate about connecting families through technology"
  },
  {
    name: "Michael Chen",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Expert in creating user-friendly family software"
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&h=300&q=80",
    bio: "Dedicated to creating beautiful digital experiences"
  }
];

const values = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Family First",
    description: "We believe in the power of family connections"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Passion",
    description: "Love for what we do drives our innovation"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trust",
    description: "Your family's privacy is our top priority"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Dedication",
    description: "Committed to your family's happiness"
  }
];

export default function About() {
  return (
    <div className="container mx-auto px-4">
      {/* Hero Section */}
      <section className="text-center mb-20">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Story</h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-purple-100 mb-8">
            We're on a mission to keep families connected through the power of shared memories
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105 border border-white/10">
              <div className="w-12 h-12 rounded-lg bg-purple-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-purple-100">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all hover:-translate-y-1 border border-white/10">
              <img 
                src={member.image} 
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white/10"
              />
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-purple-200 mb-4">{member.role}</p>
                <p className="text-purple-100">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-20">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-purple-100 mb-8">
              To create technology that strengthens family bonds and preserves precious memories for generations to come.
            </p>
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:scale-105 border border-white/10">
              Join Our Journey
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
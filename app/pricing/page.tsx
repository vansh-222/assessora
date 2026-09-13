"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Mail,
  ArrowRight,
  GraduationCap,
  Brain,
  Users,
  Leaf,
  Crown,
  Landmark,
  CheckCircle2,
  Tag,
  Target,
  Layout,
  FileBox
} from 'lucide-react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans selection:bg-emerald-200">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Assessora" width={160} height={40} className="object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Link href="features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Features
            </Link>

            <Link href="/pricing" className="text-sm font-medium text-[#046B46] border-b-2 border-[#046B46] py-5">
              Pricing
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Login
            </Link>
            <Link href="/register" className="text-sm font-medium text-white bg-[#046B46] hover:bg-[#035437] px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-900/10">
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 mb-16">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#046B46] uppercase tracking-[0.2em] mb-6 before:content-[''] before:block before:w-8 before:h-[1px] before:bg-emerald-300">
              Simple & Transparent Pricing
            </div>
            {/* Update this h1 tag */}
            <h1 className="text-[30px] md:text-[45px] font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Choose the plan that<br />
              <span className="text-[#046B46]">fits your learning goals</span>
            </h1>
            <p className="text-[15px] text-slate-500 ">
              Get access to personalized learning paths, AI-powered insights, and everything you need to succeed — at a price that works for you.
            </p>
          </div>

          <div className="flex gap-8 lg:mt-8">
            <div className="max-w-[140px]">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5 text-[#046B46]" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Personalized Learning</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">AI adapts to your pace and goals.</p>
            </div>
            <div className="max-w-[140px]">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <Brain className="w-5 h-5 text-[#046B46]" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Smarter Insights</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">Track progress with real-time analytics.</p>
            </div>
            <div className="max-w-[140px]">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-[#046B46]" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Better Outcomes</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">Build skills for a brighter future.</p>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-full p-1 border border-slate-200 flex items-center shadow-sm">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${!isAnnual ? 'bg-[#046B46] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-colors ${isAnnual ? 'bg-[#046B46] text-white shadow-md' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Annual
              </button>
            </div>
            <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-emerald-100">
              <Tag className="w-3 h-3" /> Save 20%
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">

          {/* Starter Plan */}
          <div className="bg-white rounded-3xl p-8 flex flex-col shadow-sm border border-slate-100 relative">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                <Leaf className="w-6 h-6 text-[#046B46]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Starter</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Perfect for individual learners who want to get started.</p>
              </div>
            </div>

            <div className="mb-8 flex items-end gap-1">
              <span className="text-5xl font-extrabold text-slate-900">${isAnnual ? '7' : '9'}</span>
              <span className="text-sm font-semibold text-slate-500 mb-1">/month</span>
            </div>

            <button className="w-full py-3 rounded-full border-2 border-emerald-100 text-[#046B46] font-bold text-sm mb-8 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Access to 5+ learning paths',
                'Basic AI recommendations',
                'Progress tracking',
                'Downloadable study materials',
                'Community support'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#046B46] shrink-0 fill-emerald-100" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="bg-[#F8FAFC] rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
              <BookOpen className="w-5 h-5 text-[#046B46] shrink-0" />
              <p className="text-[10px] text-slate-600 font-medium leading-tight">Great for students exploring new skills and subjects.</p>
            </div>
          </div>

          {/* Pro Plan (Highlighted) */}
          <div className="bg-[#046B46] rounded-3xl p-8 flex flex-col shadow-2xl shadow-emerald-900/20 relative transform md:-translate-y-4">
            <div className="absolute -top-4 right-8 bg-[#02452D] text-white text-[10px] font-bold uppercase tracking-wider px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
              Most Popular
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none" />

            <div className="flex items-start gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0 backdrop-blur-sm">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Pro</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">For learners who want more control, insights and faster progress.</p>
              </div>
            </div>

            <div className="mb-8 flex items-end gap-1 relative z-10 text-white">
              <span className="text-5xl font-extrabold">${isAnnual ? '15' : '19'}</span>
              <span className="text-sm font-semibold text-emerald-200 mb-1">/month</span>
            </div>

            <button className="w-full py-3 rounded-full bg-white text-[#046B46] font-bold text-sm mb-8 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 relative z-10 shadow-lg">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </button>

            <ul className="space-y-4 mb-12 flex-1 relative z-10">
              {[
                'Access to all learning paths',
                'Advanced AI insights & study plans',
                'Live & recorded sessions',
                'Downloadable resources & templates',
                'Priority support',
                'Certificate of completion'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-emerald-50 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-white shrink-0 fill-[#035437]" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="bg-[#035437] rounded-2xl p-4 flex items-center gap-3 border border-white/10 relative z-10">
              <Target className="w-5 h-5 text-emerald-200 shrink-0" />
              <p className="text-[10px] text-emerald-100 font-medium leading-tight">Ideal for serious learners and career-focused individuals.</p>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-3xl p-8 flex flex-col shadow-sm border border-slate-100 relative">
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                <Landmark className="w-6 h-6 text-[#046B46]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Enterprise</h3>
                <p className="text-xs text-slate-500 leading-relaxed">For universities and organizations with advanced needs.</p>
              </div>
            </div>

            <div className="mb-8 flex items-end gap-1">
              <span className="text-5xl font-extrabold text-slate-900">Custom</span>
            </div>

            <button className="w-full py-3 rounded-full border-2 border-emerald-100 text-[#046B46] font-bold text-sm mb-8 hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2">
              Contact Sales <ArrowRight className="w-4 h-4" />
            </button>

            <ul className="space-y-4 mb-12 flex-1">
              {[
                'Unlimited users',
                'Custom learning paths & branding',
                'Advanced analytics & reporting',
                'Dedicated account manager',
                'SSO & LMS integration',
                '24/7 premium support'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-[#046B46] shrink-0 fill-emerald-100" />
                  {feature}
                </li>
              ))}
            </ul>

            <div className="bg-[#F8FAFC] rounded-2xl p-4 flex items-center gap-3 border border-slate-100">
              <Landmark className="w-5 h-5 text-[#046B46] shrink-0" />
              <p className="text-[10px] text-slate-600 font-medium leading-tight">Built for institutions, campuses and enterprise teams.</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer with Green Wave Background */}
      <div className="relative ">
        <div className="absolute inset-0 top-32 bg-[#046B46] -z-10" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[#046B46] -z-10" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 100%)' }} />

        {/* Upper Light Footer */}
        {/* Footer */}
        <footer className="bg-[#F2F9F5] relative overflow-hidden z-0">

          {/* Decorative Dots (Bottom Right) */}
          <div className="absolute right-12 bottom-48 grid grid-cols-5 gap-2.5 opacity-30 z-0">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-[#046B46] rounded-full" />
            ))}
          </div>

          {/* Decorative Leaves (Bottom Left) */}
          <div className="absolute left-0 bottom-24 w-64 h-64 z-10 pointer-events-none opacity-90">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full transform -translate-x-1/4 translate-y-1/4">
              <path d="M50 200 C 50 100, 150 50, 180 0 C 180 80, 100 150, 50 200 Z" fill="#A7F3D0" opacity="0.6" />
              <path d="M30 200 C 20 120, 80 70, 120 30 C 140 100, 80 160, 30 200 Z" fill="#34D399" opacity="0.8" />
              <path d="M10 200 C -10 130, 40 90, 80 60 C 90 120, 50 170, 10 200 Z" fill="#046B46" opacity="0.9" />
              <path d="M140 80 C 130 60, 150 50, 160 40 C 170 60, 150 70, 140 80 Z" fill="#046B46" />
            </svg>
          </div>

          {/* Full-Width Edge-to-Edge Top Section */}
          <div className="w-full relative z-10">
            <div className="bg-gradient-to-br from-emerald-50 rounded-t-[50px] border-t-2 border-dashed border-[#046B46]/40 px-8 md:px-16 lg:px-24 pt-16 pb-10 shadow-[0_-10px_30px_-15px_rgba(4,107,70,0.05)]">

              {/* Inner Content Grid constrained to max-width */}
              <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">

                {/* Column 1: Logo & Description */}
                <div className="lg:col-span-3 pr-4">
                  <Link href="/" className="flex items-center gap-2 mb-6">
                    <Image src="/logo.png" alt="Assessora" width={160} height={40} className="object-contain" />
                  </Link>

                  <p className="text-[13px] text-slate-500 leading-relaxed mb-8">
                    Assessora helps educators create, manage, and analyze assessments with ease — so every learner can reach their full potential.
                  </p>

                  {/* Social Icons */}
                  <div className="flex items-center gap-3">
                    <Link href="#" className="w-8 h-8 rounded-md bg-[#E2F0E9] flex items-center justify-center text-[#046B46] hover:bg-[#046B46] hover:text-white transition-colors">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                    </Link>
                    <Link href="#" className="w-8 h-8 rounded-md bg-[#E2F0E9] flex items-center justify-center text-[#046B46] hover:bg-[#046B46] hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    </Link>
                    <Link href="#" className="w-8 h-8 rounded-md bg-[#E2F0E9] flex items-center justify-center text-[#046B46] hover:bg-[#046B46] hover:text-white transition-colors">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                    </Link>
                    <Link href="#" className="w-8 h-8 rounded-md bg-[#E2F0E9] flex items-center justify-center text-[#046B46] hover:bg-[#046B46] hover:text-white transition-colors">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" /></svg>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Links Area */}
                <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <div className="mb-4">
                      <h4 className="text-[15px] font-bold text-[#046B46]">Product</h4>
                    </div>
                    <ul className="space-y-3.5">
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Features</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">How It Works</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Pricing</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Integrations</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Updates</Link></li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-4">
                      <GraduationCap className="w-5 h-5 text-[#046B46] mb-2" />
                      <h4 className="text-[15px] font-bold text-[#046B46]">Resources</h4>
                    </div>
                    <ul className="space-y-3.5">
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Blog</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Help Center</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Guides & Tutorials</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Webinars</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Community</Link></li>
                    </ul>
                  </div>

                  <div>
                    <div className="mb-4">
                      <Users className="w-5 h-5 text-[#046B46] mb-2" />
                      <h4 className="text-[15px] font-bold text-[#046B46]">Company</h4>
                    </div>
                    <ul className="space-y-3.5">
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">About Us</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Careers</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Press</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Contact</Link></li>
                      <li><Link href="#" className="text-[13px] text-slate-500 hover:text-[#046B46] transition-colors">Partners</Link></li>
                    </ul>
                  </div>
                </div>

                {/* Column 3: Newsletter */}
                <div className="lg:col-span-4 lg:pl-12 lg:border-l border-emerald-900/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail className="w-4 h-4 text-[#046B46]" />
                    <span className="text-[13px] font-bold text-[#046B46]">Stay Updated</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#046B46] mb-4 leading-tight">
                    Get the Latest Tips,<br />Features & Resources
                  </h3>
                  <p className="text-[13px] text-slate-500 mb-8 leading-relaxed max-w-sm">
                    Join our newsletter and be the first to know about new features, guides and educational insights.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-white rounded-full px-4 py-1.5 border border-slate-100 shadow-sm">
                      <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                      <input type="email" placeholder="Enter your email address" className="w-full text-[13px] py-2 focus:outline-none text-slate-700 bg-transparent placeholder:text-slate-400" />
                    </div>
                    <button className="w-11 h-11 rounded-full bg-[#046B46] hover:bg-[#035437] text-white flex items-center justify-center shrink-0 transition-colors shadow-md shadow-emerald-900/20">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Organic Wavy Transition SVG into Dark Green Section */}
          <div className="relative w-full -mb-1 z-20">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
              <path d="M0,40 C320,110 420,110 720,70 C1020,30 1220,10 1440,50 L1440,120 L0,120 Z" fill="#0A4B33" />
            </svg>
          </div>

          {/* Bottom Dark Section */}
          <div className="bg-[#0A4B33]  px-8 md:px-16  relative z-20">
            <div className="max-w-[1400px] mx-auto">

            </div>
          </div>
        </footer>

      </div>

    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Sparkles,
  PlayCircle,
  Cpu,
  Mail,
  Leaf,
  Code2,
  Award,
  FileText,
  Check,
  Quote,
  Users,
  Layout,
  MessageSquare,
  ArrowRight,
  BookMarked,
  ClipboardCheck,
  TrendingUp,
  GraduationCap,
  PlaySquare,
  ShieldCheck,
  Mouse,
  Play,
  Volume2,
  Maximize,
  Target,
  BarChart,
  BrainCircuit,
  Shield,
  FileBox
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features — Assessora',
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#F0FDF4] font-sans selection:bg-emerald-200">

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
            <Link href="/features" className="text-sm font-medium text-[#046B46] border-b-2 border-[#046B46] py-5">
              Features
            </Link>

            <Link href="pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
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

      <main className="overflow-hidden">

        {/* Floating Features Hero */}
        <section className="relative pt-20 pb-12 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 items-center">

            {/* Left Column Features */}
            <div className="space-y-6 lg:translate-x-1 relative z-10 flex flex-col items-center lg:items-end">
              <FeatureCard
                icon={BookMarked}
                title="Smart Learning Paths"
                desc="Personalized journeys that adapt to your goals."
                className="-translate-x-4 lg:-translate-x-12"
              />
              <FeatureCard
                icon={ClipboardCheck}
                title="Interactive Assessments"
                desc="Test your knowledge with real-world questions."
                className="translate-x-0"
              />
              <FeatureCard
                icon={TrendingUp}
                title="Progress Tracking"
                desc="See your growth with detailed insights."
                className="-translate-x-4 lg:-translate-x-12"
              />
            </div>

            {/* Center Content */}
            <div className="text-center relative z-20 order-first lg:order-none mb-12 lg:mb-0">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#046B46] uppercase tracking-[0.2em] mb-8 before:content-[''] before:block before:w-8 before:h-[1px] before:bg-emerald-300 after:content-[''] after:block after:w-8 after:h-[1px] after:bg-emerald-300">
                Our Features
              </div>
              <h1 className="text-5xl md:text-6xl font-medium text-slate-900 leading-[1.1] mb-6">
                Tools That <br />
                <span className="text-[#046B46] font-serif italic">Turn Learning</span><br />
                Into Progress
              </h1>
              <p className="text-slate-600 mb-8 max-w-sm mx-auto">
                Everything you need to learn smarter, stay organized and achieve more — all in one place.
              </p>
              <button className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3 rounded-full transition-colors shadow-lg shadow-emerald-900/20">
                Explore All Features <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Right Column Features */}
            <div className="space-y-6 lg:-translate-x-1 relative z-10 flex flex-col items-center lg:items-start">
              <FeatureCard
                icon={GraduationCap}
                title="Expert Instructors"
                desc="Learn from industry experts and experienced educators."
                className="translate-x-4 lg:translate-x-12"
              />
              <FeatureCard
                icon={PlaySquare}
                title="Rich Learning Resources"
                desc="Videos, notes, quizzes and more — all in one place."
                className="translate-x-0"
              />
              <FeatureCard
                icon={ShieldCheck}
                title="Secure & Flexible"
                desc="Learn anytime, anywhere, on any device."
                className="translate-x-4 lg:translate-x-12"
              />
            </div>

          </div>

          <div className="mt-24 flex flex-col items-center text-slate-400">
            <Mouse className="w-6 h-6 mb-2 animate-bounce" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll to explore</span>
          </div>
        </section>

        <section className="py-15 bg-[#FAFCFB] relative overflow-hidden">

          {/* Background Decorative Shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#E8F4EE] rounded-br-full -z-10 opacity-70" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E8F4EE] rounded-tl-full -z-10 opacity-70" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">

            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#046B46] uppercase tracking-[0.2em] mb-4 before:content-[''] before:block before:w-6 before:h-[1px] before:bg-[#046B46]">
                  Featured Feature
                </div>
                <h2 className="text-4xl font-bold text-slate-900">
                  Adaptive Learning<br />Path for Every Student
                </h2>
              </div>
              <div className="max-w-sm">
                <p className="text-sm text-slate-500 mb-4">
                  Assessora analyzes your strengths, weaknesses and learning patterns to create a personalized study path — so you can focus on what matters most.
                </p>
                <button className="inline-flex items-center gap-2 text-xs font-bold text-[#046B46] bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-full transition-colors">
                  Explore Adaptive Learning <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 lg:gap-8">
              {[
                {
                  step: '01',
                  icon: Target,
                  title: 'Multi-Format Parsing',
                  subtitle: 'PDF, TXT & MARKDOWN SUPPORT',
                  desc: 'Upload your syllabus, notes, or course material. Our system instantly parses and comprehends the content structure.'
                },
                {
                  step: '02',
                  icon: Cpu,
                  title: 'AI Smart Generation',
                  subtitle: "BLOOM'S TAXONOMY ENGINE",
                  desc: 'Our AI automatically generates 5–10 balanced questions distributed across multiple cognitive levels and difficulty mixes.'
                },
                {
                  step: '03',
                  icon: Code2,
                  title: 'Interactive Quiz UI',
                  subtitle: 'LIVE TIMER & NAVIGATION',
                  desc: 'Take assessments using a clean, distraction-free interface featuring live countdowns, question jumping, and instant submission.'
                },
                {
                  step: '04',
                  icon: Award,
                  title: 'Deep Analytics',
                  subtitle: 'STRENGTHS & WEAKNESSES',
                  desc: 'Instantly view your total score, topic-wise breakdowns, cognitive level performance, and download detailed reports.'
                }
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[24px] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100/80 flex flex-col justify-between transition-transform hover:-translate-y-1 duration-300 relative group"
                >
                  <div>
                    {/* Step Number */}
                    <div className="text-[#046B46] font-mono text-2xl font-bold mb-6">
                      {card.step}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">
                      {card.title}
                    </h3>

                    {/* Subtitle Tag */}
                    <div className="text-[10px] font-bold text-[#046B46] tracking-wider uppercase mb-4">
                      {card.subtitle}
                    </div>

                    {/* Description */}
                    <p className="text-[13px] text-slate-500 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>

                  {/* Decorative bottom indicator accent */}
                  <div className="w-8 h-1 bg-[#E8F4EE] rounded-full mt-8 group-hover:w-full group-hover:bg-[#046B46] transition-all duration-300" />
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Video & Quote Section */}
        <section className="bg-white py-16 border-t border-b border-emerald-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row gap-10 items-center">

              {/* Left Side: Video Mockup Card */}
              <div className="w-full lg:w-3/5 aspect-video bg-slate-900 rounded-2xl relative overflow-hidden group cursor-pointer shadow-md">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/30 to-black/20 z-10" />

                {/* Campus / Building Background Image (Replace src with your actual image if needed) */}
                <Image
                  src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1200&auto=format&fit=crop"
                  alt="Campus View"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-black/30 z-10" />

                {/* Center Play Button */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-[#046B46] ml-1 fill-[#046B46]" />
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="absolute bottom-0 inset-x-0 h-12 bg-black/60 backdrop-blur-xs z-20 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <Play className="w-4 h-4 text-white fill-white cursor-pointer" />
                    <span className="text-white text-xs font-medium tracking-wide">0:00 / 0:50</span>
                  </div>

                  {/* Timeline bar indicator */}
                  <div className="hidden sm:block flex-1 mx-6 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-[#046B46] rounded-full" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-white cursor-pointer hover:text-emerald-400 transition-colors" />
                    <Maximize className="w-4 h-4 text-white cursor-pointer hover:text-emerald-400 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Right Side: Quote & Author */}
              <div className="w-full lg:w-2/5 lg:pr-4 flex flex-col justify-center">
                {<span>
                  <Quote className="w-8 h-8 text-[#046B46]/30 mb-4 fill-[#046B46]/10" />
                </span>}

                <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-snug">
                  Tell me and I will forget, show me and I may remember, involve me and I will understand.
                </h3>

                <p className="text-[13px] text-slate-500 mb-8 leading-relaxed">
                  At Assessora, we believe in hands-on learning, real projects, and practical experience — because that&apos;s how true understanding happens.
                </p>

                {/* Author Profile */}
                <div className="flex items-center gap-3.5 pt-2">
                  <div className="w-10 h-10 bg-[#E8F4EE] rounded-full flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 text-[#046B46]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Assessora Team</div>
                    <div className="text-[11px] text-slate-400 font-medium">Learning Beyond Textbooks</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>



        {/* Adaptive Learning Section */}
        <section className="bg-[#F2F9F5] py-12 ">
          <div className="max-w-7xl mx-auto px-6">

            {/* The Green Wavy Container */}
            <div className="relative rounded-[40px] bg-[#046B46] overflow-hidden shadow-2xl shadow-emerald-900/20 pt-16 pb-12 px-8 md:px-12">
              {/* Fake SVG wave at top using CSS clip path or absolute positioning */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-[#F2F9F5]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', borderBottomLeftRadius: '50% 100%', borderBottomRightRadius: '50% 100%', transform: 'scale(1.5) translateY(-50%)' }} />

              <div className="relative z-10 text-white mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
                  <Sparkles className="w-3 h-3" /> AI Powered Learning
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Your Personalized<br />Learning Journey</h3>
                    <p className="text-emerald-100 text-sm max-w-md">
                      Assessora studies your progress, identifies knowledge gaps, and builds a personalized roadmap to help you improve faster and achieve your goals.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 lg:mt-0">
                    <div>
                      <Target className="w-5 h-5 text-emerald-300 mb-2" />
                      <div className="text-xs font-bold mb-1">Personalized Path</div>
                      <div className="text-[10px] text-emerald-200/80 leading-tight">Tailor-made resources aligning with your goals.</div>
                    </div>
                    <div>
                      <BarChart className="w-5 h-5 text-emerald-300 mb-2" />
                      <div className="text-xs font-bold mb-1">Progress Tracking</div>
                      <div className="text-[10px] text-emerald-200/80 leading-tight">Real-time visual data on your performance.</div>
                    </div>
                    <div>
                      <BrainCircuit className="w-5 h-5 text-emerald-300 mb-2" />
                      <div className="text-xs font-bold mb-1">Smart Recommendations</div>
                      <div className="text-[10px] text-emerald-200/80 leading-tight">Get the right resources at the right time.</div>
                    </div>
                    <div>
                      <Shield className="w-5 h-5 text-emerald-300 mb-2" />
                      <div className="text-xs font-bold mb-1">Better Results</div>
                      <div className="text-[10px] text-emerald-200/80 leading-tight">Build confidence and reach your goals.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mockups Row */}
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-6">

                {/* Mockup 1: Study Plan */}
                <div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                        <BookMarked className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">Your Personalized Study Plan</div>
                        <div className="text-[10px] text-slate-500">Based on your current level and learning goals.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <Check className="w-3 h-3" /> Auto-updated
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Math */}
                    <div className="flex items-center justify-between border border-slate-100 p-3 rounded-xl hover:border-emerald-100 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-50 rounded flex items-center justify-center">
                          <span className="text-lg">➗</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Mathematics</div>
                          <div className="text-[10px] text-slate-500">Module 1 • Algebra</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-[75%] h-full bg-[#046B46] rounded-full" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">75%</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">In Progress</span>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>

                    {/* Science */}
                    <div className="flex items-center justify-between border border-slate-100 p-3 rounded-xl hover:border-emerald-100 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                          <span className="text-lg">🔬</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Science</div>
                          <div className="text-[10px] text-slate-500">Module 2 • Chemistry</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-[45%] h-full bg-blue-500 rounded-full" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">45%</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Continue</span>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>




                  </div>
                </div>

                {/* Mockup 2: Learning Insights */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xl flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-sm font-bold text-slate-900">Learning Insights</div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500">This Week ▾</span>
                  </div>

                  <div className="flex-1 bg-slate-50 rounded-xl p-4 flex items-center gap-4 mb-4">
                    {/* CSS Donut Chart */}
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-100 relative shrink-0">
                      <div className="absolute inset-0 border-4 border-[#046B46] rounded-full" style={{ clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 0 100%, 0 0, 50% 0, 50% 50%)' }} />
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#046B46]">
                        87%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 mb-0.5">Overall Progress</div>
                      <div className="text-[9px] text-slate-500 leading-tight">Keep going, You&apos;ve completed 6 of 8 modules this week.</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Recent Activity</div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-emerald-50 flex items-center justify-center text-emerald-600"><Check className="w-3 h-3" /></div>
                          <div>
                            <div className="font-semibold text-slate-900">Completed Mathematics Quiz</div>
                            <div className="text-[9px] text-slate-500">Scored 92% • Module 1</div>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">2h ago</span>
                      </div>


                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#F2F9F5] relative pt-20 overflow-hidden z-0">

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
                    <GraduationCap className="w-5 h-5 text-[#046B46] mb-2" />
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
  );
}

function FeatureCard({ icon: Icon, title, desc, className = '' }: any) {
  return (
    <div className={`bg-white p-5 rounded-2xl shadow-sm border border-emerald-50 w-full max-w-[280px] flex items-center gap-4 group hover:shadow-md transition-all cursor-pointer ${className}`}>
      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 group-hover:bg-emerald-100 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-bold text-slate-900 mb-0.5">{title}</h3>
        <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0" />
    </div>
  );
}

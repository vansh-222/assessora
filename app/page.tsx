import Link from 'next/link';
import Image from 'next/image';
import {
  GraduationCap,
  Mail,
  Leaf,
  BookOpen,
  Sparkles,
  PlayCircle,
  FileText,
  Link as LinkIcon,
  AlignLeft,
  AlignJustify,
  Plus,
  Check,
  Quote,
  Users,
  Layout,
  MessageSquare,
  Star,
  FileBox,
  Lightbulb,
  ClipboardList,
  BarChart2,
  ArrowRight
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assessora — AI-Powered Academic Assessments',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans selection:bg-emerald-200">

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Assessora" width={160} height={40} className="object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-sm font-medium text-[#046B46] border-b-2 border-[#046B46] py-5">
              Home
            </Link>
            <Link href="features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
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

        {/* Hero Section */}
        <section id="home" className="relative pt-12 md:pt-17 pb-16 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left Content */}
            <div className="w-full max-w-[580px] relative z-10 mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#Edf5f0] text-[#046B46] text-xs font-semibold mb-8">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Academic Intelligence
              </div>

              <h1 className="text-[30px] md:text-[45px] font-extrabold text-[#111827] leading-[1.1] mb-6 tracking-tight">
                Turn Your Study Material into <span className="text-[#046B46]">Smarter Assessments</span>
              </h1>

              <p className="text-[15px] text-slate-500 mb-10 leading-relaxed pr-4 max-w-[500px]">
                Upload your syllabus, lecture notes, or course material and let Assessora AI create a balanced, Bloom&apos;s Taxonomy-based quiz, track your progress, and give you personalized insights to help you learn better.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-12">
                <Link href="/register" className="text-[13px] font-semibold text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3 rounded-full transition-colors flex items-center gap-2">
                  Create Your Assessment <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="flex items-center gap-3 group">
                  <div className="w-12 h-12 rounded-full bg-[#Edf5f0] flex items-center justify-center group-hover:bg-[#c1e2d1] transition-colors text-[#046B46]">
                    <PlayCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left flex flex-col">
                    <span className="text-[15px] font-semibold text-slate-900 leading-tight">Watch Demo</span>
                    <span className="text-[13px] text-slate-500">2 mins</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-8 text-[13px] font-semibold text-slate-600">
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#046B46]" /> PDF</span>
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#046B46]" /> TXT</span>
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#046B46]" /> Markdown</span>
                <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-[#046B46]" /> Text</span>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative w-full flex justify-center lg:justify-end">
              <Image
                src="/hero-illustration.png"
                alt="Student studying with AI"
                width={700}
                height={600}
                className="w-full max-w-[600px] h-auto z-10 relative object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* Testimonial & Social Proof */}
        <section className="relative max-w-[1400px] mx-auto px-6 py-20 overflow-hidden bg-gradient-to-br from-emerald-50">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-8 max-w-7xl mx-auto">

            {/* Left Side: Blob Image & Quote Card */}
            <div className="relative w-full lg:w-[45%] flex justify-center lg:justify-start lg:pl-8">

              {/* Background Light Green Blob */}
              <div className="absolute -left-4 bottom-4 w-[280px] h-[280px] bg-[#E8F4EE] rounded-full -z-10 blur-xl opacity-70" />

              {/* Decorative Leaves (Top Left) */}
              <div className="absolute -left-6 top-8 z-10 text-[#046B46] drop-shadow-sm transform -rotate-12">
                <svg width="48" height="64" viewBox="0 0 48 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 35C12.5 35 1.5 25 15.5 15C15.5 15 25.5 28 12.5 35Z" fill="currentColor" />
                  <path d="M5.5 45C5.5 45 -2.5 35 7.5 28C7.5 28 15.5 39 5.5 45Z" fill="currentColor" />
                  <path d="M22.5 25C22.5 25 15.5 10 32.5 5C32.5 5 38.5 20 22.5 25Z" fill="#10B981" />
                </svg>
              </div>

              {/* The Masked Image (Organic Shape) */}
              <div
                className="relative w-[85%] max-w-[380px] aspect-[4/3] overflow-hidden shadow-lg border-4 border-white z-0"
                style={{
                  // Creates the custom organic blob shape seen in the image
                  borderRadius: '35% 65% 50% 50% / 45% 40% 60% 55%'
                }}
              >
                {/* Using a placeholder book image that matches the context */}
                <Image
                  src="/image.png"
                  alt="Books on a desk"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[#046B46]/10 mix-blend-multiply" />
              </div>

              {/* The Overlapping Quote Card */}
              <div className="absolute top-1/2 -translate-y-1/7 right-20 translate-x-[15%] md:translate-x-[25%] lg:translate-x-[35%] w-[280px] md:w-[250px] bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-8 z-20 border border-slate-50">

                {/* Custom Quote Icon */}


                <p className="text-[14px] text-slate-600 mb-6 leading-relaxed font-medium pr-2">
                  "Assessora has completely changed the way we assess and track student progress. "
                </p>

                <p className="text-sm font-bold text-[#046B46] mb-0.5">— Priya Sharma</p>
                <p className="text-[13px] text-slate-400 font-medium mb-6">High School Teacher</p>

                {/* Pagination Dots */}
                <div className="flex gap-2 items-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#046B46]"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-100"></div>
                  <div className="w-2 h-2 rounded-full bg-emerald-100"></div>
                </div>
              </div>
            </div>

            {/* Right Side: Stats & Info */}
            <div className="w-full lg:w-[55%] lg:pl-16 relative">

              {/* Very faint vertical divider line (Desktop only) */}
              <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-slate-200/60" />

              <h3 className="text-[11px] font-bold tracking-[0.15em] text-[#046B46] uppercase mb-4">
                Trusted by Educators
              </h3>

              <h2 className="text-3xl md:text-[38px] font-bold text-slate-900 mb-5 leading-[1.15] tracking-tight">
                Join <span className="text-[#046B46]">50,000+</span> Educators<br />Already on Assessora
              </h2>

              <p className="text-[15px] text-slate-500 mb-10 max-w-[480px] leading-relaxed">
                From individual teachers to large institutions, Assessora is helping learners and educators achieve more.
              </p>

              {/* Stats Grid with Dividers */}
              <div className="grid grid-cols-2 md:grid-cols-4 border-t md:border-t-0 border-slate-100 pt-8 md:pt-0">

                <div className="flex flex-col border-r border-slate-100 border-b md:border-b-0 pb-6 md:pb-0 pr-6">
                  <Users className="w-5 h-5 text-[#046B46] mb-3" />
                  <div className="text-[28px] font-bold text-slate-900 mb-1">50K+</div>
                  <div className="text-[11px] text-slate-400 font-semibold tracking-wider">Active Educators</div>
                </div>

                <div className="flex flex-col md:border-r border-slate-100 border-b md:border-b-0 pb-6 md:pb-0 px-6 md:px-6">
                  <FileText className="w-5 h-5 text-[#046B46] mb-3" />
                  <div className="text-[28px] font-bold text-slate-900 mb-1">1M+</div>
                  <div className="text-[11px] text-slate-400 font-semibold tracking-wider">Questions Created</div>
                </div>

                <div className="flex flex-col border-r border-slate-100 pt-6 md:pt-0 px-0 md:px-6 pr-6 md:pr-6">
                  <Layout className="w-5 h-5 text-[#046B46] mb-3" />
                  <div className="text-[28px] font-bold text-slate-900 mb-1">5K+</div>
                  <div className="text-[11px] text-slate-400 font-semibold tracking-wider">Institutions</div>
                </div>

                <div className="flex flex-col pt-6 md:pt-0 pl-6 md:px-6">
                  <Star className="w-5 h-5 text-[#046B46] mb-3" />
                  <div className="text-[28px] font-bold text-slate-900 mb-1">98%</div>
                  <div className="text-[11px] text-slate-400 font-semibold tracking-wider">User Satisfaction</div>
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* Features / Why Choose Assessora */}

        <section id="features" className="py-20 bg-[#FAFCFB] relative z-30">

          {/* Embedded CSS for the running dashed line animation */}
          <style dangerouslySetInnerHTML={{
            __html: `
        @keyframes flowDash {
          to {
            stroke-dashoffset: -24;
          }
        }
        .animate-flow-line {
          animation: flowDash 1s linear infinite;
        }
      `}} />

          {/* Continuous S-curve Dotted Snake Line (Desktop Only) */}
          <svg
            className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
            viewBox="0 0 1440 900"
            preserveAspectRatio="none"
            fill="none"
          >
            {/* 
          Continuous running snake path: 
          Starts at M 380,-90 (reaches UP into the previous section to hit the quote card dot) 
          -> Swoops left -> Weaves through badges 01-04 -> Sweeps perfectly into the right edge of CTA button 
        */}
            <path
              className="animate-flow-line"
              d="
            M 418,-60
            C 380,50 100,100 100,250
            C 100,350 150,400 240,400
            C 330,400 400,430 560,400
            C 720,370 800,430 880,400
            C 960,370 1050,430 1200,400
            C 1350,370 1300,750 860,798
            C 500,750 150,900 140,1050
            
          "
              stroke="#046B46"
              strokeWidth="2"
              strokeDasharray="6 6"
              strokeLinecap="round"
              strokeOpacity="0.45"
            />
          </svg>

          {/* Background Decorative Shapes */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#E8F4EE] rounded-br-full -z-10 opacity-70 overflow-hidden" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#E8F4EE] rounded-tl-full -z-10 opacity-70 overflow-hidden" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">

            {/* Section Header */}
            <div className="text-center mb-20 relative">

              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-12 bg-slate-200"></div>
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-emerald-50 text-[#046B46] text-xs font-bold uppercase tracking-wider">
                  Why Choose Assessora
                </div>
                <div className="h-px w-12 bg-slate-200"></div>
              </div>

              <h2 className="text-3xl md:text-[42px] font-bold text-slate-900 mb-5 leading-tight tracking-tight">
                Smarter Assessments,<br />
                <span className="text-[#046B46]">Better Learning Outcomes.</span>
              </h2>

              <p className="text-[15px] text-slate-500 max-w-2xl mx-auto leading-relaxed">
                Assessora uses advanced AI to understand your study material, create balanced assessments, and give you meaningful insights — so you can learn smarter, not harder.
              </p>

              {/* Handwritten Note (Desktop Only) */}
              <div className="hidden lg:flex flex-col items-end absolute right-4 top-4">
                <span className="font-handwriting text-[#046B46] text-xl -rotate-12 mb-1">
                  Your progress<br />matters
                </span>
                <svg width="40" height="50" viewBox="0 0 40 50" fill="none" className="text-[#046B46] -translate-x-6">
                  <path d="M35 5 C 35 25, 20 40, 5 45" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M5 45 L 12 39 M 5 45 L 14 47" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="relative mt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 pt-4">
                {[
                  { step: '01', icon: FileText, title: 'Upload & Parse', desc: 'Upload your syllabus, notes or course material. We support PDF, TXT, Markdown and pasted text — and instantly understand the content.' },
                  { step: '02', icon: Lightbulb, title: 'Generate Smart Quiz', desc: "Our AI creates 5-10 questions using Bloom's Taxonomy, balanced across cognitive levels and topics, with the right difficulty mix." },
                  { step: '03', icon: ClipboardList, title: 'Take the Assessment', desc: 'Use a clean, focused quiz interface with a live timer, question navigation and instant submission.' },
                  { step: '04', icon: BarChart2, title: 'Get Meaningful Insights', desc: 'See your score, topic-wise performance, Bloom-level breakdown, strengths & weaknesses — and download a detailed report.' },
                ].map((feature, idx) => (
                  <div key={idx} className="relative group flex flex-col h-full mt-6 md:mt-0">

                    {/* Floating Number Badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#046B46] text-white flex items-center justify-center text-xs font-bold border-[5px] border-white shadow-sm z-20">
                      {feature.step}
                    </div>

                    {/* Card Body */}
                    <div className="bg-white rounded-[24px] p-8 pt-12 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-100/60 h-full flex flex-col transition-transform hover:-translate-y-1 duration-300 relative z-10">
                      <div className="w-14 h-14 bg-[#E8F4EE] rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <feature.icon className="w-6 h-6 text-[#046B46]" strokeWidth={1.8} />
                      </div>
                      <h3 className="text-[17px] font-bold text-slate-900 mb-3">{feature.title}</h3>
                      <p className="text-[13px] text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mt-16 relative z-10">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-white bg-[#046B46] hover:bg-[#035437] px-8 py-3 rounded-full transition-colors shadow-lg shadow-emerald-900/10"
              >
                Create Your First Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>


        <section id="how-it-works" className="py-5 bg-[#FAFCFB] overflow-hidden relative">

          {/* 1-second ON / 1-second OFF snap toggle animation */}
          <style dangerouslySetInnerHTML={{
            __html: `
        @keyframes toggleBadgeColor {
          0%, 49.9% {
            background-color: #E8F4EE;
            color: #046B46;
          }
          50%, 100% {
            background-color: #046B46;
            color: #ffffff;
          }
        }
        .animate-toggle-badge {
          animation: toggleBadgeColor 2s steps(1) infinite;
        }
      `}} />

          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">

              {/* Left Side: Text Content */}
              <div className="w-full max-w-lg z-10">
                {/* Blinking / Inverting Badge */}
                <div className="animate-toggle-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-6 shadow-sm transition-colors">
                  <Sparkles className="w-3.5 h-3.5 fill-current" /> HOW IT WORKS
                </div>

                <h2 className="text-4xl md:text-[42px] font-bold text-slate-900 mb-6 leading-[1.15] tracking-tight">
                  Go from Idea to<br />
                  Assessment in <span className="text-[#046B46]">4 Easy Steps</span>
                </h2>

                <p className="text-[15px] text-slate-500 mb-10 leading-relaxed pr-4">
                  Create, customize, and launch intelligent assessments in minutes. Assessora makes the entire process simple, fast, and hassle-free — so you can focus on what truly matters: learning.
                </p>

              </div>

              {/* Right Side: Image */}
              <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center z-10">
                <div className="absolute right-[10%] top-[10%] w-[320px] h-[360px] bg-[#E8F4EE] rounded-full -z-20 mt-8" />

                <Image
                  src="/image-copy.png"
                  alt="How Assessora works mockup"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="max-w-7xl mx-auto px-6 ">
          <div className="bg-gradient-to-r from-[#034A31] via-[#046B46] to-[#1AB877] rounded-[32px] p-6 md:p-12 lg:p-14 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative overflow-hidden shadow-2xl shadow-emerald-900/15">

            {/* Background Decorative Gradient Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#34D399] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-30 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#059669] rounded-full blur-[80px] translate-y-1/2 opacity-40 pointer-events-none" />

            {/* Left Side Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-start lg:items-center gap-6 lg:gap-8 max-w-4xl">

              {/* Icon Box */}
              <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-[20px] flex items-center justify-center shrink-0 border border-white/10 shadow-inner">
                {/* WhatsApp SVG Icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
              </div>

              {/* Text & Pills */}
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2.5">
                  Transform Your Library Today
                </h2>
                <p className="text-emerald-50/90 text-[15px] mb-5 leading-relaxed max-w-2xl">
                  Join colleges using Assessora to simplify library management and transform the way they handle books, students, and daily operations.
                </p>

                {/* Badges / Pills */}
                <div className="flex flex-wrap gap-2.5">
                  <span className="bg-black/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-[13px] font-medium text-emerald-50">
                    1000+ Members
                  </span>
                  <span className="bg-black/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-[13px] font-medium text-emerald-50">
                    Daily Updates
                  </span>
                  <span className="bg-black/15 backdrop-blur-sm px-4 py-1.5 rounded-full text-[13px] font-medium text-emerald-50">
                    Active Discussions
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side: CTA Button */}
            <div className="relative z-10 w-full lg:w-auto shrink-0 mt-4 lg:mt-0">
              <Link
                href="/register"
                className="flex items-center justify-center gap-2.5 bg-white text-[#046B46] hover:bg-emerald-50 px-8 py-4 rounded-full font-bold text-[15px] transition-transform hover:scale-105 shadow-xl w-full sm:w-auto"
              >
                {/* Tiny WhatsApp Icon in the Button */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                Get Started
              </Link>
            </div>

          </div>
        </section>

      </main>

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

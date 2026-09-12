import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Sparkles, 
  PlayCircle, 
  FileText, 
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
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#046B46]" />
            <span className="font-bold text-slate-900 text-lg tracking-tight">Assessora</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-sm font-medium text-[#046B46] border-b-2 border-[#046B46] py-5">
              Home
            </Link>
            <Link href="features" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Features
            </Link>
           
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
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
        <section id="home" className="relative pt-16 md:pt-24 pb-12 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-xl relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-6 border border-emerald-100">
                <Sparkles className="w-3 h-3" />
                AI-Powered Academic Intelligence
              </div>
              
              <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Turn Your Study Material into <span className="text-[#046B46]">Smarter Assessments</span>
              </h1>
              
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Upload your syllabus, lecture notes, or course material and let Assessora AI create a balanced, Bloom&apos;s Taxonomy-based quiz, track your progress, and give you personalized insights to help you learn better.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <Link href="/register" className="text-sm font-medium text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3.5 rounded-full transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/20">
                  Create Your Assessment <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900 group">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors text-emerald-600">
                    <PlayCircle className="w-5 h-5 fill-current" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-tight">Watch Video</span>
                    <span className="text-[10px] text-slate-400 font-normal">2 mins</span>
                  </div>
                </button>
              </div>

              <div className="flex items-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-500" /> PDF</span>
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-500" /> TXT</span>
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-500" /> Markdown</span>
                <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-emerald-500" /> Doc</span>
              </div>
            </div>

            {/* Right Illustration */}
            <div className="relative">
              <div className="absolute top-10 -left-10 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 right-10 w-64 h-64 bg-amber-100/60 rounded-full blur-3xl -z-10" />
              <Image 
                src="/hero-illustration.png" 
                alt="Student studying with AI" 
                width={800} 
                height={600} 
                className="w-full h-auto drop-shadow-2xl z-10 relative object-contain"
                priority
              />
            </div>
          </div>
        </section>

        {/* Testimonial & Social Proof */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
            
            {/* Quote Card */}
            <div className="relative bg-gradient-to-br from-emerald-50 to-white p-8 rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
              <Quote className="w-10 h-10 text-emerald-200 mb-4" />
              <p className="text-lg text-slate-700 font-medium leading-relaxed mb-6 italic relative z-10">
                &quot;Assessora has completely changed the way we assess and track student progress. It&apos;s simple, powerful, and incredibly easy to use.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  PS
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">— Priya Sharma</p>
                  <p className="text-xs text-slate-500">High School Teacher</p>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
            </div>

            {/* Stats */}
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-2">Trusted by Educators</div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 leading-tight">
                Join <span className="text-[#046B46]">50,000+</span> Educators<br/>Already on Assessora
              </h2>
              <p className="text-sm text-slate-500 mb-8 max-w-md">
                From individual teachers to large institutions, Assessora is helping learners and educators achieve more.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div>
                  <Users className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">50K+</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Active Students</div>
                </div>
                <div>
                  <FileBox className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">1M+</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Questions Created</div>
                </div>
                <div>
                  <Layout className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">5K+</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Institutions</div>
                </div>
                <div>
                  <Star className="w-5 h-5 text-emerald-600 mb-2" />
                  <div className="text-2xl font-bold text-slate-900">98%</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">User Satisfaction</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Features / Why Choose Assessora */}
        <section id="features" className="py-24 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                Why Choose Assessora
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Smarter Assessments,<br/>
                <span className="text-[#046B46]">Better Learning Outcomes.</span>
              </h2>
              <p className="text-slate-500 max-w-2xl mx-auto">
                Assessora uses advanced AI to understand your study material, create balanced assessments, and give you meaningful insights — so you can learn smarter, not harder.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              {/* Connecting line (desktop only) */}
              <div className="hidden md:block absolute top-12 left-12 right-12 h-[2px] bg-emerald-100 -z-10 border-t-2 border-dashed border-emerald-200" />
              
              {[
                { step: '01', icon: FileText, title: 'Upload & Parse', desc: 'Upload your syllabus, notes or course material. We support PDF, TXT, Markdown and pasted text — and instantly understand the content.' },
                { step: '02', icon: Lightbulb, title: 'Generate Smart Quiz', desc: "Our AI creates 5-10 questions using Bloom's Taxonomy, balanced across cognitive levels and topics, with the right difficulty mix." },
                { step: '03', icon: ClipboardList, title: 'Take the Assessment', desc: 'Use a clean, focused quiz interface with a live timer, question navigation and instant submission.' },
                { step: '04', icon: BarChart2, title: 'Get Meaningful Insights', desc: 'See your score, topic-wise performance, Bloom-level breakdown, strengths & weaknesses — and download a detailed report.' },
              ].map((feature, idx) => (
                <div key={idx} className="relative pt-6 group">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#046B46] text-white flex items-center justify-center text-xs font-bold shadow-lg shadow-emerald-900/20 group-hover:scale-110 transition-transform">
                    {feature.step}
                  </div>
                  <div className="bg-white border border-slate-100 rounded-3xl p-8 pt-10 text-center shadow-sm hover:shadow-xl transition-shadow hover:border-emerald-100 h-full">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <feature.icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-3">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/register" className="inline-flex items-center gap-2 text-sm font-medium text-white bg-[#046B46] hover:bg-[#035437] px-6 py-3 rounded-full transition-colors shadow-lg shadow-emerald-900/20">
                Create Your First Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How it Works mockup section */}
        <section id="how-it-works" className="py-24 bg-[#F9FAFB] overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold uppercase tracking-wider mb-4 border border-emerald-100">
                  <PlayCircle className="w-3 h-3" /> How It Works
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                  Go from Idea to<br/>Assessment in <span className="text-[#046B46]">4 Easy Steps</span>
                </h2>
                <p className="text-slate-500 mb-8 max-w-md leading-relaxed">
                  Create, customize, and launch intelligent assessments in minutes. Assessora makes the entire process simple, fast, and hassle-free — so you can focus on what truly matters: learning.
                </p>
                <div className="font-handwriting text-emerald-600 text-2xl -rotate-6 ml-4">
                  Simple steps.<br/>Powerful results.
                </div>
              </div>

              {/* CSS Mockup Representation */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-emerald-50 rounded-[40px] transform rotate-3 scale-105 opacity-50" />
                <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 relative z-10 transform -rotate-1">
                  
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-[#046B46]" />
                      <span className="font-bold text-slate-900 text-sm">Assessora</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    </div>
                  </div>

                  {/* Mockup Content */}
                  <div className="space-y-4">
                    <div>
                      <div className="h-4 w-32 bg-slate-800 rounded mb-2" />
                      <div className="h-2 w-48 bg-slate-200 rounded" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="border-2 border-emerald-500 bg-emerald-50 rounded-xl p-3 flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-emerald-800">Multiple Choice</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-2 opacity-50">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        <span className="text-xs font-semibold text-slate-500">True / False</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-2 opacity-50">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        <span className="text-xs font-semibold text-slate-500">Short Answer</span>
                      </div>
                      <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-2 opacity-50">
                        <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                        <span className="text-xs font-semibold text-slate-500">Long Answer</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                      <div className="inline-block bg-[#046B46] text-white text-[10px] font-bold px-8 py-2 rounded-full">
                        Generate
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-[#046B46] rounded-[32px] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Transform Your Library Today
              </h2>
              <p className="text-emerald-100 max-w-lg mb-8">
                Join students using Assessora to simplify learning, manage test prep, and transform the way they master concepts, and ace exams.
              </p>
              <div className="flex gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-black/20 px-3 py-1 rounded-full border border-white/10">Learn Smarter</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 bg-black/20 px-3 py-1 rounded-full border border-white/10">Save Time</span>
              </div>
            </div>

            <div className="relative z-10 shrink-0">
              <Link href="/register" className="inline-flex items-center gap-2 text-sm font-bold text-[#046B46] bg-white hover:bg-emerald-50 px-8 py-4 rounded-full transition-colors shadow-lg">
                <MessageSquare className="w-4 h-4 fill-current" />
                Get Started Now
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
            
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="w-6 h-6 text-[#046B46]" />
                <span className="font-bold text-slate-900 text-xl tracking-tight">Assessora</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-2">Smarter Assessments. Better Learning.</p>
              <p className="text-sm text-slate-500 mb-6 max-w-xs leading-relaxed">
                Assessora helps students create, manage, and analyze assessments with ease — so every learner can reach their full potential.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Layout className="w-4 h-4" /> Product</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Features</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">How it Works</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Integrations</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Updates</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><FileBox className="w-4 h-4" /> Resources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Help Center</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Guides & Tutorials</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Webinars</Link></li>
                <li><Link href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">Community</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4" /> Stay Updated</h4>
              <p className="text-xs text-slate-500 mb-4">
                Get the Latest Tips, Features & Resources straight to your inbox.
              </p>
              <div className="flex items-center gap-2">
                <input 
                  type="email" 
                  placeholder="Enter your email address" 
                  className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
                <button className="w-9 h-9 rounded-full bg-[#046B46] hover:bg-[#035437] text-white flex items-center justify-center transition-colors shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400">© 2026 Assessora. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-xs text-slate-400 hover:text-slate-600">Privacy Policy</Link>
              <Link href="#" className="text-xs text-slate-400 hover:text-slate-600">Terms of Service</Link>
              <Link href="#" className="text-xs text-slate-400 hover:text-slate-600">Cookie Settings</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

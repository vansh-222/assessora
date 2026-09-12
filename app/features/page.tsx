import Link from 'next/link';
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
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#046B46]" />
            <span className="font-bold text-slate-900 text-lg tracking-tight">Assessora</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Home
            </Link>
            <Link href="/features" className="text-sm font-medium text-[#046B46] border-b-2 border-[#046B46] py-5">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              How it Works
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900">
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
        <section className="relative pt-20 pb-32 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-4 items-center">
            
            {/* Left Column Features */}
            <div className="space-y-6 lg:translate-x-12 relative z-10 flex flex-col items-center lg:items-end">
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
                Tools That <br/>
                <span className="text-[#046B46] font-serif italic">Turn Learning</span><br/>
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
            <div className="space-y-6 lg:-translate-x-12 relative z-10 flex flex-col items-center lg:items-start">
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

        {/* Video & Quote Section */}
        <section className="bg-white py-24 border-t border-b border-emerald-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col lg:flex-row gap-12 items-center">
              
              {/* Video Mockup */}
              <div className="w-full lg:w-3/5 aspect-video bg-slate-900 rounded-2xl relative overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/40 to-black/20 z-10" />
                <div className="absolute inset-0 bg-slate-800" /> {/* Generic background placeholder for building */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="w-16 h-16 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1 fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-black/60 to-transparent z-20 flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <Play className="w-4 h-4 text-white fill-white" />
                    <span className="text-white text-xs font-medium">0:00 / 0:30</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-4 h-4 text-white" />
                    <Maximize className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Quote */}
              <div className="w-full lg:w-2/5 pr-4">
                <Quote className="w-8 h-8 text-emerald-200 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-6 leading-tight">
                  Tell me and I will forget, show me and I may remember, involve me and I will understand.
                </h3>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                  At Assessora, we believe in hands-on learning, real projects, and practical experience — because that&apos;s how true understanding happens.
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Assessora Team</div>
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Learning Beyond Textbooks</div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Adaptive Learning Section */}
        <section className="bg-white py-24 pb-32">
          <div className="max-w-7xl mx-auto px-6">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
              <div>
                <div className="inline-flex items-center gap-2 text-[10px] font-bold text-[#046B46] uppercase tracking-[0.2em] mb-4 before:content-[''] before:block before:w-6 before:h-[1px] before:bg-[#046B46]">
                  Featured Feature
                </div>
                <h2 className="text-4xl font-bold text-slate-900">
                  Adaptive Learning<br/>Path for Every Student
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

            {/* The Green Wavy Container */}
            <div className="relative rounded-[40px] bg-[#046B46] overflow-hidden shadow-2xl shadow-emerald-900/20 pt-16 pb-12 px-8 md:px-12">
              {/* Fake SVG wave at top using CSS clip path or absolute positioning */}
              <div className="absolute top-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', borderBottomLeftRadius: '50% 100%', borderBottomRightRadius: '50% 100%', transform: 'scale(1.5) translateY(-50%)' }} />
              
              <div className="relative z-10 text-white mb-12">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
                  <Sparkles className="w-3 h-3" /> AI Powered Learning
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="text-3xl font-bold mb-4">Your Personalized<br/>Learning Journey</h3>
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

                    {/* English */}
                    <div className="flex items-center justify-between border border-slate-100 p-3 rounded-xl hover:border-emerald-100 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-amber-50 rounded flex items-center justify-center">
                          <span className="text-lg">📖</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">English</div>
                          <div className="text-[10px] text-slate-500">Module 3 • Grammar</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-[10%] h-full bg-amber-500 rounded-full" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">10%</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">Start</span>
                        <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                    </div>

                    {/* Social Studies */}
                    <div className="flex items-center justify-between border border-slate-100 p-3 rounded-xl hover:border-emerald-100 transition-colors cursor-pointer group opacity-60">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                          <span className="text-lg">🌍</span>
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">Social Studies</div>
                          <div className="text-[10px] text-slate-500">Module 4 • History</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="w-[0%] h-full bg-slate-200 rounded-full" />
                          </div>
                          <span className="text-[10px] font-bold text-slate-700">0%</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">Locked</span>
                        <ArrowRight className="w-3 h-3 text-slate-200 transition-colors" />
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
                      <div className="flex items-center justify-between text-xs group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center text-blue-600"><Play className="w-3 h-3 fill-current" /></div>
                          <div>
                            <div className="font-semibold text-slate-900">Started Science Lesson</div>
                            <div className="text-[9px] text-slate-500">Module 2 • Chemistry</div>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">5h ago</span>
                      </div>
                      <div className="flex items-center justify-between text-xs group cursor-pointer">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded bg-amber-50 flex items-center justify-center text-amber-600"><FileText className="w-3 h-3" /></div>
                          <div>
                            <div className="font-semibold text-slate-900">Viewed Study Plan</div>
                            <div className="text-[9px] text-slate-500">Personalized for your goals</div>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 font-medium">Yesterday</span>
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
      <footer className="bg-white pt-16 pb-8">
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

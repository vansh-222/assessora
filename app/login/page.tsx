'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      
      {/* Left panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-4 md:p-4 lg:p-6 relative">
        <Link href="/" className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg ">
          <Image src="/logo.png" alt="Assessora" width={140} height={35} className="object-contain" />
        </Link>
        
        <div className="w-full max-w-md mx-auto flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#0A3D2C] mb-2">Welcome Back</h1>
            <p className="text-slate-500 text-sm">Log in to continue your learning journey with confidence</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-[#0A3D2C] mb-1.5">Email address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A3D2C] focus:ring-1 focus:ring-[#0A3D2C] transition-colors"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-[#0A3D2C] mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#0A3D2C] focus:ring-1 focus:ring-[#0A3D2C] transition-colors pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0A3D2C]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link href="#" className="text-sm font-bold text-[#0A3D2C] hover:underline">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0A3D2C] hover:bg-[#072a1e] text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-4 text-xs text-slate-400 font-medium">Or continue with</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
              <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="font-bold text-[#0A3D2C] hover:underline">
              Create free account
            </Link>
          </p>
        </div>
      </div>

      {/* Right panel - Marketing showcase */}
      <div className="hidden lg:flex w-1/2 p-6 h-screen">
        <div className="w-full h-full bg-[#0A3D2C] rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Constellation Graphics (CSS Mockup) */}
          <div className="relative w-full max-w-md aspect-square flex items-center justify-center mb-1">
            
            {/* Connection Lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
              <path d="M150,200 L120,200 Q100,200 100,220 L100,250 Q100,280 130,280 L200,280" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M300,100 L350,100 Q380,100 380,130 L380,150 Q380,180 350,180 L280,180" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            </svg>

            {/* Main Avatar */}
            <div className="w-64 h-64 bg-emerald-100 rounded-full border-8 border-[#0A3D2C] z-10 relative shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-emerald-50"></div>
              {/* Fallback avatar SVG since we don't have the image asset */}
              <svg className="w-32 h-32 text-emerald-700 relative z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>

            {/* Floating avatars */}
            <div className="absolute top-1/4 left-8 w-14 h-14 bg-white rounded-full border-4 border-[#0A3D2C] z-10 flex items-center justify-center text-emerald-600 shadow-xl overflow-hidden">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            
            <div className="absolute top-12 right-12 w-20 h-20 bg-white rounded-full border-4 border-[#0A3D2C] z-10 flex items-center justify-center text-emerald-600 shadow-xl overflow-hidden">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>

            {/* Little floating dots */}
            <div className="absolute top-8 left-1/3 w-4 h-4 bg-white/60 rounded-full" />
            <div className="absolute bottom-12 right-1/4 w-6 h-6 bg-white rounded-full" />

            {/* Live Class Badge */}
            <div className="absolute bottom-15 left-12 bg-white rounded-xl p-2.5 shadow-xl border border-white/20 z-20 flex items-center gap-3 pr-4">
               <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center relative">
                 <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                 <div className="absolute -bottom-1 -right-1 bg-[#0A3D2C] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white">Live</div>
               </div>
               <div>
                 <div className="text-xs font-bold text-slate-900 leading-tight mb-0.5">Live 1-on-1 Practice</div>
                 <div className="flex items-center gap-1">
                   <div className="flex text-amber-400">
                     <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                     <svg className="w-2.5 h-2.5 text-slate-200" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                   </div>
                   <span className="text-[8px] text-slate-500 font-medium">5.0 Rating</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center px-4 relative z-10 max-w-lg">
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Introducing new features</h2>
            <p className="text-emerald-50 text-sm leading-relaxed mb-12">
              We understand that in many places, high-quality education is reserved for the elite. Our mission is to democratize access. 
            </p>
          </div>

          
        </div>
      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Flame, 
  Zap, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Smartphone, 
  MessageSquare, 
  X, 
  Menu, 
  ChevronRight, 
  ArrowRight,
  Play,
  Calendar,
  CheckCircle,
  HelpCircle,
  Plus,
  User,
  LogOut,
  Star,
  Check,
  ChevronDown
} from 'lucide-react';

// Type definitions
interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  extendedText: string;
  duration: string;
  intensity: 'Medium' | 'High' | 'Extreme';
  focus: string;
  image: string;
  icon: string;
  routines: string[];
}

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export default function App() {
  // Navigation & Scroll states
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication & Session States
  const [user, setUser] = useState<{ name: string; email: string; plan: string } | null>(() => {
    const saved = localStorage.getItem('wild_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  // Modals & Feedback UI States
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<'rookie' | 'wild'>('wild');
  const [activeProgramDetails, setActiveProgramDetails] = useState<WorkoutProgram | null>(null);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  // Form handling
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', agree: false });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [supportForm, setSupportForm] = useState({ name: '', email: '', message: '' });
  
  // Custom Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Trigger brief alert toast
  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Scroll depth tracking for Navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['hero', 'programs', 'benefits', 'pricing', 'signup'];
      const current = sections.find(section => {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 120;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set up selected program context on click-to-signup
  const handleHitItClick = (programTitle: string) => {
    // Determine target plan matching the program intensity
    if (programTitle === 'Power Up' || programTitle === 'Super Body Toning') {
      setSelectedPlanId('wild');
    } else {
      setSelectedPlanId('rookie');
    }
    
    // Smooth scroll to subscription section
    const el = document.getElementById('signup');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      triggerToast(`Selected ${programTitle}! Fill in details to start this program.`, 'info');
    }
  };

  // Handle Form Actions
  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) {
      triggerToast('Please fill out all fields.', 'error');
      return;
    }
    if (!signupForm.agree) {
      triggerToast('You must agree to the Terms & Conditions.', 'error');
      return;
    }

    const newUser = {
      name: signupForm.name,
      email: signupForm.email,
      plan: selectedPlanId === 'wild' ? 'Wild Gym-er' : 'Rookie Pack',
    };

    localStorage.setItem('wild_user', JSON.stringify(newUser));
    setUser(newUser);
    setRegisterModalOpen(false);
    triggerToast(`Welcome to the Pack, ${newUser.name}! Your primal journey starts now.`, 'success');
  };

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      triggerToast('Please enter both email and password.', 'error');
      return;
    }

    // Simulate login
    const loggedUser = {
      name: loginForm.email.split('@')[0].toUpperCase(),
      email: loginForm.email,
      plan: 'Wild Gym-er',
    };

    localStorage.setItem('wild_user', JSON.stringify(loggedUser));
    setUser(loggedUser);
    setLoginModalOpen(false);
    triggerToast(`Welcome back, ${loggedUser.name}! Be fierce!`, 'success');
  };

  const handleSupportSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!supportForm.name || !supportForm.email || !supportForm.message) {
      triggerToast('Please fill out all fields before sending.', 'error');
      return;
    }
    setSupportModalOpen(false);
    setSupportForm({ name: '', email: '', message: '' });
    triggerToast('Message sent! Support pack will contact you within 24 hours.', 'success');
  };

  const handleLogOut = () => {
    localStorage.removeItem('wild_user');
    setUser(null);
    triggerToast('Logged out. Keep your fierce spirit alive!', 'info');
  };

  const handleCancelMembership = () => {
    localStorage.removeItem('wild_user');
    setUser(null);
    triggerToast('Membership has been cancelled successfully.', 'info');
  };

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Static workout programs data matching original site & expanding with details
  const workouts: WorkoutProgram[] = [
    {
      id: 'power_up',
      title: 'Power Up',
      description: 'Power up and become super strong with strength training. Pull tough ropes, lift weights and build strength in both your hands and legs.',
      extendedText: 'Engage in brute power development. Through systematic heavy resistance training using nature-forged battle ropes, earth weights, and gravity-defying bodyweight movements under the sky, you will stimulate raw muscular growth and massive bone density improvements.',
      duration: '4-Week Intensive',
      intensity: 'Extreme',
      focus: 'Absolute Power & Core Stability',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
      icon: 'zap',
      routines: [
        'Warmup: Heavy Crawl Rotations (10 mins)',
        'Apex Pulls: Ropes Tension Drops (5 sets x 45s)',
        'Stone Deadlifts: Natural Resistance (4 sets x 10 reps)',
        'Finisher: Suspension Core Slams (3 sets x 60s)'
      ]
    },
    {
      id: 'be_flexible',
      title: 'Be Flexible',
      description: 'Bend and twist like a tiger with poses that increases your flexibility. A mix of stretches and yoga will keep your body young and free of stiff limbs.',
      extendedText: 'Release skeletal tension and unlock full range-of-motion. Combining primal floor flow patterns, restorative power alignment, and natural physical alignments that stretch tight quad clusters, core lines, and restricted joint spheres to grant animalistic agility.',
      duration: '6-Week Restorative',
      intensity: 'Medium',
      focus: 'Joint Mobility & Primal Agility',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      icon: 'heart',
      routines: [
        'Primal Spine: Tiger Cat-Cow Transitions (12 mins)',
        'Dynamic Alignment: Horizon Lunges (4 sets x 30s)',
        'Limber Drops: Lower Body Deep Stretch (3 sets x 90s)',
        'Mindset: Elemental Static Breathwork (10 mins)'
      ]
    },
    {
      id: 'super_body_toning',
      title: 'Super Body Toning',
      description: 'Look fierce and wild with a body that’s toned from head to toe. Get all the right muscles in all the right places while hitting tough cardio exercises for extreme health.',
      extendedText: 'Amplify explosive athletic lung power and fast-twitch muscle recruitment. By incorporating outdoor calisthenics bounds, continuous hill/trail intervals, and high-velocity metabolic conditioning phases, you shed layers to showcase pure, functional anatomy.',
      duration: '5-Week Metabolic Burn',
      intensity: 'High',
      focus: 'Fat Oxidation & Kinetic Muscle Definition',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
      icon: 'dumbbell',
      routines: [
        'Kinetic Elevation: Shadow Cardio Drills (10 mins)',
        'Pack Sprints: 100m Ascent Springs (6 sets with slow walks)',
        'Animalistic Plyometrics: Log Jump Ups (4 sets x 15 reps)',
        'Power Out: Gravity Planks with Earth Grips (3 sets x max)'
      ]
    }
  ];

  const testimonials: Testimonial[] = [
    {
      name: 'Marcus Vance',
      role: 'Founding Wild Gym-er',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
      quote: 'Ditched the windowless basement gym for natural forest lifting. The air is pristine, the challenge is real, and my joints have never felt this youthful and vibrant. Tarzan would be proud!',
      rating: 5
    },
    {
      name: 'Selena Thorne',
      role: 'Flexible Tiger Adept',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
      quote: 'The "Be Flexible" flows cured years of chronic posture compression from office work. It feels less like clinical gym chores and more like tapping into actual natural power.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gym-dark text-gray-100 flex flex-col font-sans relative selection:bg-brand-green selection:text-gym-dark antialiased">
      {/* Dynamic Floating Toast System */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border ${
              toast.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300' 
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/30 text-rose-300'
                : 'bg-zinc-900/90 border-zinc-700 text-brand-orange'
            } backdrop-blur-md font-medium tracking-wide`}
          >
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <X className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === 'info' && <Sparkles className="w-5 h-5 text-brand-orange shrink-0" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header / Navbar */}
      <nav 
        id="navbar-root"
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-gym-dark/95 border-b border-zinc-800/60 py-3.5 backdrop-blur-md shadow-lg shadow-black/20' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Brand */}
          <button 
            id="nav-logo"
            onClick={() => scrollTo('hero')} 
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-brand-green to-emerald-700 rounded-lg flex items-center justify-center text-gym-dark font-black transform group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 shadow-md shadow-brand-green/20">
              <Dumbbell className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="block font-display font-black text-xl italic tracking-wider text-white select-none">
                WILD & FREE
              </span>
              <span className="block text-[9px] font-bold text-brand-green tracking-widest -mt-1 select-none">
                WORKOUT PLATFORM
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div id="desktop-links" className="hidden md:flex items-center gap-8">
            {[
              { label: 'Programs', id: 'programs' },
              { label: 'Benefits', id: 'benefits' },
              { label: 'Pricing', id: 'pricing' },
              { label: 'Join', id: 'signup' }
            ].map((link) => (
              <button
                id={`nav-link-${link.id}`}
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`text-sm font-semibold tracking-wider transition-colors hover:text-white uppercase relative py-1 focus:outline-none ${
                  activeSection === link.id ? 'text-brand-green' : 'text-zinc-400'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Auth Action Buttons */}
          <div id="auth-actions" className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4 bg-zinc-900/60 pl-3 pr-2 py-1.5 rounded-full border border-zinc-800">
                <span className="text-xs font-semibold text-brand-green tracking-wide">
                  ⚡ {user.name} ({user.plan})
                </span>
                <button
                  id="nav-logout-btn"
                  onClick={handleLogOut}
                  className="p-1 px-3 text-[11px] bg-red-950/40 border border-red-900/40 hover:bg-rose-900/60 hover:text-white rounded-full text-rose-300 font-bold tracking-wide transition-all uppercase flex items-center gap-1.5"
                  title="Logout"
                >
                  <LogOut className="w-3 h-3" /> Out
                </button>
              </div>
            ) : (
              <>
                <button 
                  id="nav-login-btn"
                  onClick={() => setLoginModalOpen(true)} 
                  className="text-xs font-bold tracking-wider text-white uppercase hover:text-brand-green transition-colors py-2 px-4 border border-transparent"
                >
                  Login
                </button>
                <button 
                  id="nav-register-btn"
                  onClick={() => scrollTo('signup')} 
                  className="bg-brand-green hover:bg-emerald-400 text-gym-dark font-black tracking-wider text-xs uppercase px-5 py-2.5 rounded-lg transition-all duration-300 shadow-md shadow-brand-green/10 hover:shadow-brand-green/20 hover:-translate-y-0.5"
                >
                  Register Now
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden flex items-center">
            <button
              id="mobile-menu-hamburger"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-400 hover:text-white bg-zinc-900/40 border border-zinc-800/40 focus:outline-none"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gym-dark/98 border-b border-zinc-900 overflow-hidden"
            >
              <div className="px-5 pt-3 pb-6 space-y-4 flex flex-col">
                <button 
                  id="mobile-link-programs"
                  onClick={() => scrollTo('programs')} 
                  className="text-left text-base font-semibold tracking-wider text-zinc-300 hover:text-white py-2 border-b border-zinc-900"
                >
                  WILD PROGRAMS
                </button>
                <button 
                  id="mobile-link-benefits"
                  onClick={() => scrollTo('benefits')} 
                  className="text-left text-base font-semibold tracking-wider text-zinc-300 hover:text-white py-2 border-b border-zinc-900"
                >
                  EXTRA BENEFITS
                </button>
                <button 
                  id="mobile-link-pricing"
                  onClick={() => scrollTo('pricing')} 
                  className="text-left text-base font-semibold tracking-wider text-zinc-300 hover:text-white py-2 border-b border-zinc-900"
                >
                  MEMBERSHIP PLANS
                </button>
                <button 
                  id="mobile-link-signup"
                  onClick={() => scrollTo('signup')} 
                  className="text-left text-base font-semibold tracking-wider text-zinc-300 hover:text-white py-2 border-b border-zinc-900"
                >
                  BURN MUSCLES TODAY
                </button>
                
                {user ? (
                  <div className="pt-2 flex flex-col gap-3">
                    <div className="bg-zinc-900 py-3 px-4 rounded-xl border border-zinc-800 text-sm font-semibold text-brand-green">
                      Logged in as: {user.name} ({user.plan})
                    </div>
                    <button
                      id="mobile-logout-btn"
                      onClick={handleLogOut}
                      className="w-full text-center py-2.5 rounded-lg border border-red-900/40 bg-rose-950/30 text-rose-300 hover:bg-rose-950/55 font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Log Out
                    </button>
                  </div>
                ) : (
                  <div className="pt-2 flex flex-col gap-3">
                    <button
                      id="mobile-login-btn"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setLoginModalOpen(true);
                      }}
                      className="w-full text-center py-2.5 rounded-lg border border-zinc-800 text-zinc-300 font-semibold uppercase tracking-wider text-xs"
                    >
                      Login
                    </button>
                    <button
                      id="mobile-register-btn"
                      onClick={() => scrollTo('signup')}
                      className="w-full text-center py-2.5 rounded-lg bg-brand-green text-gym-dark font-black uppercase tracking-wider text-xs shadow-md"
                    >
                      Register Now
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section 
        id="hero" 
        className="relative min-h-[92vh] flex items-center pt-24 pb-12 overflow-hidden"
      >
        {/* Background photo with high contrast dark gradient overlays */}
        <div className="absolute inset-0 z-0">
          <img 
            ref={null}
            src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=1600&auto=format&fit=crop" 
            alt="Outdoor fitness setting" 
            className="w-full h-full object-cover opacity-35 object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gym-dark via-gym-dark/80 to-gym-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-gym-dark via-transparent to-gym-dark/90" />
          
          {/* Natural atmosphere subtle dots pattern */}
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero text */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">
              {/* Kickoff Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-950/80 to-zinc-900/80 border border-emerald-500/20 rounded-full text-brand-green text-xs font-bold tracking-widest uppercase shadow-md shadow-brand-green/5">
                <Flame className="w-3.5 h-3.5 animate-pulse" /> Unchain Your Inner Beast
              </div>
              
              <h1 id="hero-heading" className="text-5xl sm:text-7xl lg:text-8xl font-display font-black uppercase italic tracking-tight text-white leading-[0.9] text-left">
                BE FIERCE WITH <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-emerald-400 to-teal-400 block sm:inline">WILD</span> WORKOUTS
              </h1>

              <p id="hero-subtext" className="text-zinc-300 text-lg sm:text-xl max-w-xl text-left leading-relaxed font-light">
                Escape the suffocating, air-conditioned artificial neon boxes. Step into nature’s brutal, beautiful workspace to get fast, flexible, and strong like Tarzan. Run free, lift stones, pull timber, and master absolute health.
              </p>

              <div id="hero-actions" className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2">
                <button
                  id="hero-primary-cta"
                  onClick={() => scrollTo('signup')}
                  className="group bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-gym-dark font-black tracking-wider text-sm uppercase px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3.5 shadow-xl shadow-brand-green/10 hover:shadow-brand-green/20 hover:-translate-y-1"
                >
                  Register Now
                  <ArrowRight className="w-5 h-5 shrink-0 group-hover:translate-x-1.5 transition-transform" />
                </button>
                <button
                  id="hero-secondary-cta"
                  onClick={() => scrollTo('programs')}
                  className="px-8 py-4 rounded-xl border border-zinc-700/80 bg-zinc-900/30 text-white font-bold tracking-wider text-sm uppercase hover:bg-zinc-800/50 hover:border-zinc-500 transition-all flex items-center justify-center gap-2 group"
                >
                  Explore Programs
                  <ChevronRight className="w-4 h-4 shrink-0 opacity-60 group-hover:translate-x-1 transition-all" />
                </button>
              </div>

              {/* Small credentials indicator */}
              <div className="flex items-center gap-6 pt-6 border-t border-zinc-800/50 w-full mt-4">
                <div>
                  <span className="block font-display font-black text-3xl text-white">4,800+</span>
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Active Wild Humans</span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <span className="block font-display font-black text-3xl text-white">24/7</span>
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Cloud Support Staff</span>
                </div>
                <div className="w-px h-8 bg-zinc-800" />
                <div>
                  <span className="block font-display font-black text-3xl text-white">100%</span>
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">Free of Artificial Gyms</span>
                </div>
              </div>
            </div>

            {/* Hero visual widget */}
            <div className="lg:col-span-5 hidden lg:block relative">
              <div className="relative mx-auto max-w-sm rounded-[2rem] border border-zinc-800 bg-gym-card/40 p-4 backdrop-blur-md shadow-2xl">
                {/* Visual mockup container representing active app tracking */}
                <div className="relative rounded-[1.6rem] bg-gym-dark overflow-hidden aspect-[4/5] border border-zinc-800">
                  <img 
                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=800&auto=format&fit=crop" 
                    alt="Active outdoor exercise" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gym-dark via-transparent to-transparent" />
                  
                  {/* Floating info overlay badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-gym-dark/80 backdrop-blur-md rounded-full border border-zinc-800 text-[10px] font-bold text-zinc-400 tracking-wider">
                      OUTDOOR SENSORS
                    </span>
                    <span className="w-2.5 h-2.5 bg-brand-green rounded-full animate-ping" />
                  </div>

                  <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-3">
                    <div className="bg-gym-dark/90 backdrop-blur-md border border-zinc-800/80 rounded-xl p-3 shadow-lg">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-orange text-gym-dark flex items-center justify-center font-bold">
                          🔥
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Daily Burn Rate</span>
                          <span className="block font-display font-black text-lg text-white">462 KCAL METRICS</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gym-dark/90 backdrop-blur-md border border-zinc-800/80 rounded-xl p-3 shadow-lg">
                      <div className="flex items-center gap-2.5 justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-brand-green text-gym-dark flex items-center justify-center font-bold">
                            🦁
                          </div>
                          <div>
                            <span className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wide">Beast Performance</span>
                            <span className="block font-display font-black text-lg text-white">APEX TIGER SCORE</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-brand-green font-mono bg-brand-green/10 px-2 py-0.5 rounded">97.8%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle outer tag decal */}
                <div className="absolute -right-8 top-12 bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-lg shadow-xl -rotate-12 flex items-center gap-2">
                  <Star className="w-4 h-4 text-brand-orange fill-brand-orange" />
                  <span className="text-xs font-black tracking-wider text-white">TARZAN CERTIFIED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attribute Ribbon Bar */}
      <div className="w-full bg-brand-green/95 text-gym-dark font-display font-black tracking-widest text-sm py-4 uppercase flex overflow-hidden select-none border-y border-brand-green">
        <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap min-w-full justify-around items-center shrink-0">
          <span>🐆 FAST LIKE A TIGER</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>🎋 FLEXIBLE LIKE A BAMBOO VINE</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>💪 STRONG LIKE AN APEX LION</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>🛡️ CANCELLATION FREEDOM ANYTIME</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>🏕️ 100% OUTDOOR SPACE</span>
        </div>
        <div aria-hidden="true" className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap min-w-full justify-around items-center shrink-0 select-none">
          <span>🐆 FAST LIKE A TIGER</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>🎋 FLEXIBLE LIKE A BAMBOO VINE</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>💪 STRONG LIKE AN APEX LION</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>🛡️ CANCELLATION FREEDOM ANYTIME</span>
          <span className="text-[8px] opacity-40">●</span>
          <span>🏕️ 100% OUTDOOR SPACE</span>
        </div>
      </div>

      {/* Wild Programs Section */}
      <section id="programs" className="section-padding py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading Group */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <span className="text-xs font-extrabold text-brand-green tracking-widest uppercase block mb-2">
                Our Training Curriculums
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-black uppercase italic text-white tracking-wide">
                WILD PROGRAMS
              </h2>
              <div className="w-20 h-1.5 bg-brand-green mt-3.5" />
            </div>
            <p className="text-zinc-400 text-sm sm:text-base max-w-md text-left font-light leading-relaxed">
              We operate exclusively outdoors, testing gravity and physical load with pure, high-potency functional movements designed to trigger rapid physical adaptivity.
            </p>
          </div>

          {/* Programs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {workouts.map((program) => {
              const IconComponent = program.id === 'power_up' ? Zap : program.id === 'be_flexible' ? Heart : Dumbbell;
              return (
                <div 
                  id={`program-card-${program.id}`}
                  key={program.id}
                  className="bg-gym-card/50 rounded-2xl border border-zinc-800/85 overflow-hidden flex flex-col hover:border-zinc-700/90 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1.5 transition-all duration-300 group"
                >
                  {/* Card Visual Asset Area */}
                  <div className="relative h-52 overflow-hidden bg-zinc-950">
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-65"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gym-card via-transparent to-black/35" />
                    
                    {/* Floating Intensity Tag */}
                    <div className="absolute top-4 right-4 px-2.5 py-1.5 bg-gym-dark/90 backdrop-blur-md rounded-lg border border-zinc-800/80 flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        program.intensity === 'Extreme' ? 'bg-red-500' : program.intensity === 'High' ? 'bg-brand-orange' : 'bg-brand-green'
                      }`} />
                      <span className="text-[10px] font-black uppercase text-zinc-300 tracking-wider">
                        {program.intensity} INTENSITY
                      </span>
                    </div>

                    {/* Floating Program Overlay Icon rounded */}
                    <div className="absolute -bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-brand-green to-emerald-600 rounded-xl flex items-center justify-center text-gym-dark shadow-lg shadow-brand-green/20">
                      <IconComponent className="w-5.5 h-5.5" />
                    </div>
                  </div>

                  {/* Program Description Area */}
                  <div className="p-6 pt-10 flex-grow flex flex-col justify-between items-start text-left">
                    <div className="w-full">
                      <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase block mb-1">
                        {program.duration}
                      </span>
                      <h3 className="text-2xl font-display font-extrabold text-white uppercase italic tracking-wide group-hover:text-brand-green transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-zinc-400 text-sm mt-3.5 leading-relaxed font-light line-clamp-3">
                        {program.description}
                      </p>
                    </div>

                    {/* Footer Actions nested in card */}
                    <div className="w-full mt-6 pt-5 border-t border-zinc-800/50 flex items-center justify-between">
                      <button
                        id={`btn-details-${program.id}`}
                        onClick={() => setActiveProgramDetails(program)}
                        className="text-xs font-bold text-zinc-300 hover:text-white uppercase tracking-wider flex items-center gap-1.5 focus:outline-none"
                      >
                        Inspect Routine <Plus className="w-3.5 h-3.5 text-brand-green" />
                      </button>

                      <button
                        id={`btn-hitit-${program.id}`}
                        onClick={() => handleHitItClick(program.title)}
                        className="bg-brand-green hover:bg-emerald-400 text-gym-dark font-black tracking-widest text-xs uppercase px-4.5 py-2.5 rounded-lg transition-all shadow-md shadow-brand-green/5"
                      >
                        HIT IT
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Extra Benefits Section */}
      <section id="benefits" className="py-24 bg-gym-card/15 border-y border-zinc-900 relative">
        <div className="absolute inset-0 opacity-[0.015] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side text column */}
            <div className="lg:col-span-5 flex flex-col items-start text-left">
              <span className="text-xs font-extrabold text-brand-green tracking-widest uppercase block mb-2">
                Uncompromising Support Value
              </span>
              <h2 className="text-4xl sm:text-5xl font-display font-black uppercase italic text-white tracking-wide">
                EXTRA BENEFITS
              </h2>
              <div className="w-16 h-1.5 bg-brand-green mt-3.5 mb-6" />
              
              <p className="text-zinc-300 font-light leading-relaxed text-sm sm:text-base mt-2">
                Other than getting effective workouts that make you fast, flexible, and strong like Tarzan, these extra benefits come with our membership plan to make your exercise time free of stress and hassles.
              </p>

              {/* Highlight badge list */}
              <div className="mt-8 space-y-4">
                {[
                  '100% Digital access from any screen',
                  'Flexible billing cycle (cancel anytime)',
                  'Direct messaging connection to trainer staff',
                  'Community boards with daily checkins'
                ].map((txt, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold text-zinc-300">{txt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side bento block layout */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    id: 'customized_for_you',
                    title: 'Customized for you',
                    text: 'Get customized workouts that targets your body and health goals with specific exercises.',
                    icon: Sparkles,
                    color: 'text-brand-green',
                    bg: 'from-emerald-950/20 to-zinc-900/10'
                  },
                  {
                    id: 'support_24_7',
                    title: '24/7 Support',
                    text: 'Hit up the customer support team with your questions. They work around the clock to help you.',
                    icon: MessageSquare,
                    color: 'text-yellow-500',
                    bg: 'from-amber-950/20 to-zinc-900/10'
                  },
                  {
                    id: 'workout_any_device',
                    title: 'Workout with any device',
                    text: 'Follow the exercises on your phone while traveling or at home on smart Tvs.',
                    icon: Smartphone,
                    color: 'text-brand-green',
                    bg: 'from-emerald-950/20 to-zinc-900/10'
                  },
                  {
                    id: 'best_prices',
                    title: 'Best Prices',
                    text: 'Gyms might be expensive but we strive to make workouts available to you by being affordable.',
                    icon: ShieldCheck,
                    color: 'text-teal-400',
                    bg: 'from-teal-950/20 to-zinc-900/10'
                  }
                ].map((benefit) => {
                  const BenefitIcon = benefit.icon;
                  return (
                    <div 
                      id={`benefit-box-${benefit.id}`}
                      key={benefit.id} 
                      className={`bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800/80 text-left hover:border-zinc-700/80 transition-all shadow-lg flex flex-col justify-between`}
                    >
                      <div>
                        {/* Benefit icon */}
                        <div className={`w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800/90 flex items-center justify-center ${benefit.color} mb-5 shadow-sm`}>
                          <BenefitIcon className="w-5.5 h-5.5" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-wide">
                          {benefit.title}
                        </h3>
                        <p className="text-zinc-400 text-xs mt-3 leading-relaxed font-light">
                          {benefit.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* User Reviews Subsection */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-extrabold text-brand-green tracking-widest uppercase block mb-1">
            Proven Results
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black uppercase text-white tracking-wide">
            TESTIMONIALS OF THE PACK
          </h2>
          <div className="w-12 h-1 bg-brand-green mx-auto mt-3 mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((test, idx) => (
              <div key={idx} className="bg-gym-card/30 border border-zinc-800/85 p-6 rounded-2xl text-left flex flex-col justify-between relative">
                <div>
                  <div className="flex gap-1 text-brand-orange mb-3">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-brand-orange" />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm font-light leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-zinc-800/50">
                  <img 
                    src={test.avatar} 
                    alt={test.name} 
                    className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="block text-xs font-bold text-white">{test.name}</span>
                    <span className="block text-[10px] text-zinc-500 uppercase font-semibold tracking-wider">{test.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Plan Tier Grid Section */}
      <section id="pricing" className="py-24 bg-gym-card/10 border-t border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <span className="text-xs font-extrabold text-brand-green tracking-widest uppercase block mb-2">
            Pack Admission Tiers
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-black uppercase italic text-white tracking-wide">
            MEMBERSHIP PLANS
          </h2>
          <div className="w-16 h-1.5 bg-brand-green mx-auto mt-3.5 mb-8" />

          {/* Pricing Billing Cycle Switch */}
          <div className="inline-flex items-center bg-zinc-900 p-1.5 rounded-xl border border-zinc-800 shadow-md mb-12">
            <button
              id="billing-monthly"
              onClick={() => setPricingCycle('monthly')}
              className={`px-4.5 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all ${
                pricingCycle === 'monthly' 
                  ? 'bg-brand-green text-gym-dark shadow-md shadow-brand-green/10' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Monthly Cycle
            </button>
            <button
              id="billing-yearly"
              onClick={() => setPricingCycle('yearly')}
              className={`px-4.5 py-2.5 rounded-lg text-xs font-extrabold tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                pricingCycle === 'yearly' 
                  ? 'bg-brand-green text-gym-dark shadow-md' 
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Yearly Save 20%
              <span className="text-[9px] font-black tracking-widest bg-brand-orange text-white px-1.5 py-0.5 rounded uppercase">
                Save
              </span>
            </button>
          </div>

          {/* Pricing cards columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* For Rookies */}
            <div 
              id="plan-card-rookie"
              className={`rounded-2xl border bg-gym-card/30 p-8 flex flex-col justify-between text-left transition-all ${
                selectedPlanId === 'rookie' 
                  ? 'border-zinc-700 ring-2 ring-zinc-700 shadow-xl' 
                  : 'border-zinc-800 hover:border-zinc-700/60 shadow-lg shadow-black/10'
              }`}
            >
              <div>
                <span className="text-[10px] font-extrabold text-zinc-500 tracking-widest uppercase block mb-1">
                  Beginner Entry Pass
                </span>
                <h3 className="text-2xl font-display font-bold uppercase italic text-white">
                  For Rookies
                </h3>
                <div className="w-8 h-1 bg-zinc-700 mt-2.5 mb-6" />
                
                {/* Cost declaration */}
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-4xl sm:text-5xl font-display font-black text-white">
                    ${pricingCycle === 'monthly' ? '19.95' : '15.95'}
                  </span>
                  <span className="text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                    / Month
                  </span>
                </div>

                <p className="text-zinc-400 text-xs font-light leading-relaxed mb-6">
                  Perfect introductory tier for beginners looking to try simple outdoor physical adjustments before scaling upward.
                </p>

                {/* Features list */}
                <ul className="space-y-3.5 mb-8">
                  {[
                    'Access to Be Flexible curriculum',
                    'Mobile & Tablet interface accessibility',
                    'Bi-weekly outdoor video routine guidelines',
                    'Static PDF tracking logs'
                  ].map((fItem, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                      <Check className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="text-zinc-300 font-light">{fItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                id="select-rookie"
                onClick={() => {
                  setSelectedPlanId('rookie');
                  scrollTo('signup');
                  triggerToast('Selected. Provide registration details below.', 'info');
                }}
                className={`w-full py-3.5 rounded-xl font-bold tracking-wider text-xs uppercase transition-all ${
                  selectedPlanId === 'rookie' 
                    ? 'bg-zinc-700 hover:bg-zinc-650 text-white shadow-md' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {selectedPlanId === 'rookie' ? 'YOUR SELECTION' : 'CHOOSE ROOKIE PACK'}
              </button>
            </div>

            {/* For Wild Gym-ers */}
            <div 
              id="plan-card-wild"
              className={`rounded-2xl border bg-gym-card/65 p-8 flex flex-col justify-between text-left transition-all relative ${
                selectedPlanId === 'wild' 
                  ? 'border-brand-green ring-2 ring-brand-green/60 shadow-brand-green/5 shadow-2xl' 
                  : 'border-zinc-800 hover:border-zinc-700/65 shadow-lg'
              }`}
            >
              {/* Popular Tag badge */}
              <div className="absolute -top-3.5 right-6 bg-brand-orange text-white text-[9px] font-black italic tracking-widest px-3.5 py-1 rounded-full shadow-lg">
                RECOMMENDED
              </div>

              <div>
                <span className="text-[10px] font-extrabold text-brand-green tracking-widest uppercase block mb-1">
                  Apex Alpha Admission
                </span>
                <h3 className="text-2xl font-display font-bold uppercase italic text-white flex items-center gap-2">
                  For Wild Gym-ers
                </h3>
                <div className="w-12 h-1 bg-brand-green mt-2.5 mb-6" />
                
                {/* Cost declaration */}
                <div className="flex items-baseline gap-1.5 mb-6">
                  <span className="text-4xl sm:text-5xl font-display font-black text-brand-green">
                    ${pricingCycle === 'monthly' ? '45.95' : '36.75'}
                  </span>
                  <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">
                    / Month
                  </span>
                </div>

                <p className="text-zinc-400 text-xs font-light leading-relaxed mb-6">
                  Our premier unlimited tier providing all advanced conditioning, bespoke workouts, and 24/7 priority communication.
                </p>

                {/* Features list */}
                <ul className="space-y-3.5 mb-8">
                  {[
                    'Full access to ALL 3 curriculums',
                    'Power Up & Super Body Toning workouts included',
                    'Customized health goals with specific routines',
                    '24/7 support & questions line access',
                    'Work out with any smart TV, phone or device',
                    'Exclusive daily wilderness progress tracking tools'
                  ].map((fItem, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs">
                      <Check className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                      <span className="text-zinc-200 font-semibold">{fItem}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                id="select-wild"
                onClick={() => {
                  setSelectedPlanId('wild');
                  scrollTo('signup');
                  triggerToast('Excellent! Form context switched to Wild Gym-er.', 'info');
                }}
                className={`w-full py-3.5 rounded-xl font-bold tracking-wider text-xs uppercase transition-all ${
                  selectedPlanId === 'wild' 
                    ? 'bg-brand-green text-gym-dark hover:bg-emerald-400 font-black shadow-md shadow-brand-green/20' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {selectedPlanId === 'wild' ? 'YOUR SELECTION' : 'CHOOSE WILD GYM-ER'}
              </button>
            </div>
          </div>

          {/* Standard recurring monthly fee footer disclaimer copy */}
          <p className="text-[11px] text-zinc-500 max-w-lg mx-auto mt-10 leading-relaxed">
            All memberships and plans automatically renew for a recurring monthly fee of $45.95 (or rookies tier equal rate) unless cancelled. Members are free to cancel at any time. By subscribing you agree to the <button onClick={() => setShowTermsModal(true)} className="underline hover:text-zinc-400 text-zinc-500 font-bold focus:outline-none">Terms & Conditions</button> and <button onClick={() => setShowPrivacyModal(true)} className="underline hover:text-zinc-400 text-zinc-500 font-bold focus:outline-none">Privacy Policy</button>.
          </p>
        </div>
      </section>

      {/* Burn Muscles Today Sign up Box Section */}
      <section id="signup" className="py-24 bg-gym-dark relative overflow-hidden">
        {/* Subtle decorative background imagery */}
        <div className="absolute inset-0 opacity-[0.03] z-0 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop" 
            alt="Forest tree trunks background texture" 
            className="w-full h-full object-cover grayscale"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto">
            
            {/* Form Container Wrapper Card */}
            <div className="bg-gym-card/60 backdrop-blur-md rounded-2xl border border-zinc-805 border-zinc-800/90 p-8 sm:p-12 text-center shadow-2xl relative">
              
              {user ? (
                /* Authenticated User Status panel instead of blank form */
                <div id="user-status-card" className="py-8 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mb-6 border border-brand-green/20">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-display font-bold uppercase italic text-white">
                    MEMBERSHIP ACTIVE
                  </h3>
                  <p className="text-xs font-bold text-brand-green tracking-wider uppercase mt-2.5">
                    Logged in as: {user.name}
                  </p>
                  
                  <div className="my-8 py-5 px-6 rounded-xl border border-zinc-800/60 bg-zinc-900/40 text-left max-w-md w-full">
                    <span className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                      Your Pack Account details
                    </span>
                    <span className="block text-sm text-zinc-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      <strong>Registered Email:</strong> {user.email}
                    </span>
                    <span className="block text-sm text-zinc-300 font-medium mt-1">
                      <strong>Enrolled Plan:</strong> {user.plan}
                    </span>
                    <span className="block text-sm text-zinc-300 font-medium mt-1">
                      <strong>Automatic Renewal:</strong> Active (${selectedPlanId === 'rookie' ? '19.95' : '45.95'}/mo)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                    <button
                      id="logout-btn-dashboard"
                      onClick={handleLogOut}
                      className="w-full sm:w-auto px-6 py-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-zinc-300 hover:text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all"
                    >
                      LOG OUT SESSION
                    </button>
                    <button
                      id="cancel-btn-dashboard"
                      onClick={handleCancelMembership}
                      className="w-full sm:w-auto px-6 py-3 bg-rose-950/40 border border-rose-900/30 text-rose-300 hover:bg-rose-900/60 hover:text-white rounded-xl font-bold uppercase text-xs tracking-wider transition-all"
                    >
                      CANCEL PLAN SUBSCRIPTION
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary landing checkout form */
                <div>
                  <span className="text-xs font-extrabold text-brand-green tracking-widest uppercase block mb-2">
                    Initialize Your Primal Shift
                  </span>
                  <h2 className="text-4xl sm:text-5xl font-display font-black uppercase text-white tracking-wide">
                    BURN MUSCLES TODAY
                  </h2>
                  <div className="w-12 h-1 bg-brand-green mx-auto mt-3 mb-8" />

                  <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-md mx-auto mb-10 leading-relaxed">
                    Set up your subscription for <strong>{selectedPlanId === 'wild' ? 'Wild Gym-er' : 'Rookie Pack'}</strong>. Fill out the fields inside our secure environment to activate outdoor guidance.
                  </p>

                  <form onSubmit={handleRegisterSubmit} className="space-y-5 text-left max-w-xl mx-auto">
                    
                    {/* Selectors overlay within card to let them toggle dynamically on the checkout card */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button
                        type="button"
                        onClick={() => setSelectedPlanId('rookie')}
                        className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-wider text-center transition-all ${
                          selectedPlanId === 'rookie' 
                            ? 'bg-zinc-800 border-zinc-700 text-white shadow-sm font-semibold' 
                            : 'bg-zinc-900/30 border-zinc-900 text-zinc-500 hover:text-zinc-400'
                        }`}
                      >
                        Rookie (${pricingCycle === 'monthly' ? '19.95' : '15.95'})
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedPlanId('wild')}
                        className={`py-3 rounded-lg border text-xs font-bold uppercase tracking-wider text-center transition-all ${
                          selectedPlanId === 'wild' 
                            ? 'bg-brand-green/10 border-brand-green/30 text-brand-green font-semibold' 
                            : 'bg-zinc-900/30 border-zinc-900 text-zinc-500 hover:text-zinc-400'
                        }`}
                      >
                        Wild Gym-er (${pricingCycle === 'monthly' ? '45.95' : '36.75'})
                      </button>
                    </div>

                    {/* Form Fields */}
                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-2">
                        Enter Your Full Name
                      </label>
                      <input 
                        id="signup-name"
                        type="text" 
                        required
                        placeholder="John Savage Doe"
                        value={signupForm.name}
                        onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                        className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-2">
                        Email Address
                      </label>
                      <input 
                        id="signup-email"
                        type="email" 
                        required
                        placeholder="john@wildpack.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-2">
                        Secure Password
                      </label>
                      <input 
                        id="signup-password"
                        type="password" 
                        required
                        placeholder="••••••••"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                      />
                    </div>

                    {/* Agreement Option checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                      <input 
                        id="signup-agree"
                        type="checkbox"
                        required
                        checked={signupForm.agree}
                        onChange={(e) => setSignupForm({ ...signupForm, agree: e.target.checked })}
                        className="w-4 h-4 rounded border-zinc-800 text-brand-green focus:ring-transparent accent-brand-green mt-1 shrink-0"
                      />
                      <label htmlFor="signup-agree" className="text-[11px] text-zinc-400 font-light leading-snug">
                        Strictly accept subscription and automatic renewal conditions. I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="underline hover:text-zinc-300">Terms & Conditions</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} className="underline hover:text-zinc-300">Privacy Policy</button>.
                      </label>
                    </div>

                    {/* Checkout Button */}
                    <button
                      id="signup-submit-btn"
                      type="submit"
                      className="w-full bg-gradient-to-r from-brand-green to-emerald-500 hover:from-emerald-400 hover:to-teal-400 text-gym-dark font-black tracking-wider text-xs uppercase py-4 rounded-xl mt-4 transition-all duration-300 shadow-xl shadow-brand-green/10 hover:shadow-brand-green/20 cursor-pointer"
                    >
                      SUBSCRIBE & START (${selectedPlanId === 'rookie' ? (pricingCycle === 'monthly' ? '19.95' : '15.95') : (pricingCycle === 'monthly' ? '45.95' : '36.75')})
                    </button>

                    <div className="text-center pt-4">
                      <span className="text-[10px] text-zinc-500 tracking-wide">
                        ALREADY HAVE A PASS?{' '}
                        <button 
                          id="btn-switch-to-login"
                          type="button" 
                          onClick={() => setLoginModalOpen(true)} 
                          className="text-brand-green hover:underline font-bold"
                        >
                          LOGIN HERE
                        </button>
                      </span>
                    </div>

                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto bg-gym-dark border-t border-zinc-910 border-zinc-900 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            
            {/* Logo Summary block */}
            <div className="md:col-span-5 flex flex-col items-start text-left gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-brand-green rounded-lg flex items-center justify-center text-gym-dark font-black">
                  <Dumbbell className="w-5 h-5" />
                </div>
                <div>
                  <span className="block font-display font-black text-lg italic tracking-wider text-white">
                    WILD & FREE
                  </span>
                  <span className="block text-[8px] font-bold text-brand-green tracking-widest -mt-1">
                    EST. 2026
                  </span>
                </div>
              </div>
              <p className="text-zinc-500 text-xs font-light leading-relaxed max-w-sm">
                Customized nature-bound fitness. Pull ropes, breath pristine pine oxygen, and twist dynamically under open skies. All physical adaptions and animalistic health plans are fully cancelable anytime.
              </p>
            </div>

            {/* Quick Navigation Footer list */}
            <div className="md:col-span-3 flex flex-col items-start text-left gap-4">
              <h4 className="text-[10px] font-extrabold text-white tracking-widest uppercase">
                Explore Primal Links
              </h4>
              <div className="flex flex-col gap-2.5 text-xs">
                <button onClick={() => scrollTo('programs')} className="text-zinc-500 hover:text-brand-green text-left transition-colors font-medium">Wild Programs</button>
                <button onClick={() => scrollTo('benefits')} className="text-zinc-500 hover:text-brand-green text-left transition-colors font-medium">Extra Benefits</button>
                <button onClick={() => scrollTo('pricing')} className="text-zinc-500 hover:text-brand-green text-left transition-colors font-medium">Membership Tiers</button>
                <button onClick={() => scrollTo('signup')} className="text-zinc-500 hover:text-brand-green text-left transition-colors font-medium">Enroll Pack Today</button>
              </div>
            </div>

            {/* Legit policy Links / Support form button in Footer */}
            <div className="md:col-span-4 flex flex-col items-start text-left gap-4">
              <h4 className="text-[10px] font-extrabold text-white tracking-widest uppercase">
                Policies & Community Support
              </h4>
              <div className="flex flex-col gap-2.5 text-xs w-full pb-2">
                <button onClick={() => setShowPrivacyModal(true)} className="text-zinc-500 hover:text-white text-left transition-colors font-medium text-xs">Privacy Policy</button>
                <button onClick={() => setShowTermsModal(true)} className="text-zinc-500 hover:text-white text-left transition-colors font-medium text-xs">Terms & Conditions</button>
                <button onClick={() => {
                  setSupportForm({ name: '', email: '', message: '' });
                  setSupportModalOpen(true);
                }} className="text-zinc-500 hover:text-white text-left transition-colors font-medium text-xs flex items-center gap-1.5 focus:outline-none">
                  Open Support Ticket <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-ping inline-block" />
                </button>
              </div>
            </div>

          </div>

          {/* Trademarks credits line */}
          <div className="mt-12 pt-8 border-t border-zinc-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
              © {new Date().getFullYear()} WORKOUT WILD & FREE. COPIED & RECONSTRUCTED TO HIGH-FIDELITY SPECS.
            </p>
            <p className="text-[9px] font-mono text-zinc-700 tracking-tighter">
              LOCATED: OUTDOORS ● PORT: 3000 ● RETAIN INTEGRITY
            </p>
          </div>
        </div>
      </footer>

      {/* MODALS OVERLAYS PORTAL */}
      <AnimatePresence>
        
        {/* PROGRAM DETAILED VIEW MODAL */}
        {activeProgramDetails && (
          <div 
            id="modal-program-details"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Modal backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProgramDetails(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-gym-card rounded-2xl border border-zinc-800 p-6 sm:p-8 text-left shadow-2xl z-10 overflow-hidden"
            >
              {/* Top border decor accent color */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-green" />

              {/* Close Button */}
              <button 
                id="btn-close-program-modal"
                onClick={() => setActiveProgramDetails(null)}
                className="absolute top-5 right-5 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-4 pt-2">
                <span className="text-[10px] font-bold text-brand-green tracking-widest uppercase block mb-1">
                  Routine Inspection • {activeProgramDetails.duration}
                </span>
                <h3 className="text-3xl font-display font-black uppercase text-white italic tracking-wide">
                  {activeProgramDetails.title}
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-zinc-300 text-xs sm:text-sm font-light leading-relaxed">
                  {activeProgramDetails.extendedText}
                </p>

                {/* Scope overview */}
                <div className="bg-gym-dark/90 p-4 rounded-xl border border-zinc-800 flex items-center justify-between text-xs font-semibold">
                  <div>
                    <span className="block text-[8px] text-zinc-500 tracking-wider font-extrabold uppercase">Target Profile focus</span>
                    <span className="text-zinc-300 block mt-0.5">{activeProgramDetails.focus}</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[8px] text-zinc-500 tracking-wider font-extrabold uppercase">Metabolic rate</span>
                    <span className="text-zinc-200 block mt-0.5">{activeProgramDetails.intensity === 'Extreme' ? '💥 Extreme Blast' : activeProgramDetails.intensity === 'High' ? '⚡ High Conditioning' : '🍃 Aerobic Balance'}</span>
                  </div>
                </div>

                {/* Sub routines checkboxes lists */}
                <div>
                  <h4 className="text-[10px] font-extrabold text-white tracking-widest uppercase mb-2.5">
                    SAMPLE WORKOUT DRILLS
                  </h4>
                  <div className="space-y-2">
                    {activeProgramDetails.routines.map((routine, index) => (
                      <div key={index} className="flex items-center gap-3 p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-900 text-xs">
                        <div className="w-5 h-5 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-zinc-300 font-light">{routine}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                id="modal-detail-cta-btn"
                onClick={() => {
                  handleHitItClick(activeProgramDetails.title);
                  setActiveProgramDetails(null);
                }}
                className="w-full bg-brand-green hover:bg-emerald-400 text-gym-dark font-black tracking-widest text-xs uppercase py-3.5 rounded-xl mt-6 transition-all shadow-md shadow-brand-green/10 flex items-center justify-center gap-2"
              >
                Enroll & Start Training <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}

        {/* SECURE LOGIN OVERLAY MODAL */}
        {loginModalOpen && (
          <div 
            id="modal-login"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLoginModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-gym-card rounded-2xl border border-zinc-800 p-6 sm:p-8 text-left shadow-2xl z-10"
            >
              <button 
                id="btn-close-login"
                onClick={() => setLoginModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6 pt-2">
                <span className="text-xs font-black text-brand-green uppercase tracking-widest block mb-1">
                  Access Wild Gate
                </span>
                <h3 className="text-2xl font-display font-medium text-white tracking-widest uppercase italic">
                  LOGIN CLIENT
                </h3>
                <div className="w-8 h-1 bg-brand-green mx-auto mt-2.5" />
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Registered Email Address
                  </label>
                  <input 
                    id="login-email"
                    type="email" 
                    required
                    placeholder="pack_member@wild.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Your Password
                  </label>
                  <input 
                    id="login-password"
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>

                <button
                  id="btn-login-submit"
                  type="submit"
                  className="w-full bg-brand-green hover:bg-emerald-400 text-gym-dark font-black tracking-widest text-xs uppercase py-3.5 rounded-xl mt-2 transition-all cursor-pointer"
                >
                  ENTER GATEWAY
                </button>

                <div className="text-center pt-2.5">
                  <span className="text-[10px] text-zinc-500 font-medium">
                    NEW MEMBER TO PACK?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        setLoginModalOpen(false);
                        scrollTo('signup');
                      }}
                      className="text-brand-green hover:underline font-bold"
                    >
                      REGISTER FIRST
                    </button>
                  </span>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* CUSTOM SUPPORT TICKET OVERLAY MODAL */}
        {supportModalOpen && (
          <div 
            id="modal-support"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSupportModalOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-gym-card rounded-2xl border border-zinc-800 p-6 sm:p-8 text-left shadow-2xl z-10"
            >
              <button 
                id="btn-close-support"
                onClick={() => setSupportModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900 transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-5 pt-2">
                <span className="text-xs font-black text-brand-green uppercase tracking-widest block mb-1">
                  How can we help?
                </span>
                <h3 className="text-2xl font-display font-medium text-white tracking-widest uppercase italic">
                  CONTACT SUPPORT
                </h3>
                <div className="w-8 h-1 bg-brand-green mx-auto mt-2" />
              </div>

              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Your Full Name
                  </label>
                  <input 
                    id="support-name"
                    type="text" 
                    required
                    placeholder="Enter name"
                    value={supportForm.name}
                    onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                    className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input 
                    id="support-email"
                    type="email" 
                    required
                    placeholder="email@address.com"
                    value={supportForm.email}
                    onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                    className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Support Inquiry
                  </label>
                  <textarea 
                    id="support-message"
                    required
                    rows={4}
                    placeholder="Describe how we can facilitate your progress..."
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    className="w-full bg-gym-dark border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all resize-none"
                  />
                </div>

                <button
                  id="btn-support-submit"
                  type="submit"
                  className="w-full bg-brand-green hover:bg-emerald-400 text-gym-dark font-black tracking-widest text-xs uppercase py-3.5 rounded-xl transition-all font-semibold"
                >
                  DISPATCH PACK INQUIRY
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {/* TERMS & CONDITIONS ACCORDION LIGHT OVERLAY MODAL */}
        {showTermsModal && (
          <div 
            id="modal-terms"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
          >
            <div onClick={() => setShowTermsModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            
            <div className="relative w-full max-w-lg bg-gym-card rounded-2xl border border-zinc-800 p-6 sm:p-8 text-left shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
              <button onClick={() => setShowTermsModal(false)} className="absolute top-5 right-5 p-1 rounded-lg text-zinc-500 hover:text-white focus:outline-none">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-display font-medium text-white uppercase italic mb-1 tracking-wider">
                TERMS & CONDITIONS
              </h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Last updated: June 2026</p>

              <div className="space-y-4 text-xs font-light text-zinc-400 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1.5">1. Membership Agreement</h4>
                  <p>By subscribing to our services, you grant full approval for a recurring monthly enrollment. All fees represent physical outdoor training guides, digital tracking assistance, and customer support.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1.5">2. Subscription Automatic Renewal</h4>
                  <p>All plans automatically renew every 30 days unless canceled inside your account. Free trials are available temporarily but convert automatically into paid memberships unless you cancel.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1.5">3. Release of Liability</h4>
                  <p>Physical workouts performed in outdoor locations involve inherent environmental risks. You assume 100% of physical liability. Please consult wellness professionals before practicing deep tiger yoga or lifting earth stones.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1.5">4. Refund Policy</h4>
                  <p>Fees are non-refundable but you are free to cancel subsequent charge-cycles at any moment. There are no penalty fees or hidden charges for canceling.</p>
                </div>
              </div>

              <button onClick={() => setShowTermsModal(false)} className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold tracking-wider text-xs uppercase py-3 rounded-xl">
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY ACCORDION LIGHT OVERLAY MODAL */}
        {showPrivacyModal && (
          <div 
            id="modal-privacy"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div onClick={() => setShowPrivacyModal(false)} className="absolute inset-0 bg-black/85 backdrop-blur-sm" />
            
            <div className="relative w-full max-w-lg bg-gym-card rounded-2xl border border-zinc-800 p-6 sm:p-8 text-left shadow-2xl z-10 max-h-[85vh] overflow-y-auto">
              <button onClick={() => setShowPrivacyModal(false)} className="absolute top-5 right-5 p-1 rounded-lg text-zinc-500 hover:text-white focus:outline-none">
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-display font-medium text-white uppercase italic mb-1 tracking-wider">
                PRIVACY POLICY
              </h3>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-4">Last updated: June 2026</p>

              <div className="space-y-4 text-xs font-light text-zinc-400 leading-relaxed">
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1.5">1. Data Collection</h4>
                  <p>We process your email and user statistics safely structure to configure your workout target guidelines. No medical data or banking information is kept inside our local databases.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1.5">2. Security Standards</h4>
                  <p>Our secure server layers are fully compatible with HTTPS parameters, protecting transaction emails and logins from unauthorized external visibility.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-1.5">3. Third Party Disclosures</h4>
                  <p>Workout Wild & Free does not sell, lease, or distribute email contacts or progress records to third-party marketing companies, ensuring your training privacy is kept integral.</p>
                </div>
              </div>

              <button onClick={() => setShowPrivacyModal(false)} className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold tracking-wider text-xs uppercase py-3 rounded-xl">
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        )}

      </AnimatePresence>
    </div>
  );
}

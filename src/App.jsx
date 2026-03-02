import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  MapPin, 
  Clock, 
  Instagram, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight,
  Tractor,
  BrickWall,
  ExternalLink
} from 'lucide-react';

import img1 from './assets/img1.jpg';
import img2 from './assets/img2.jpg';
import img3 from './assets/img3.jpg';
import img4 from './assets/img4.jpg';
import img5 from './assets/img5.jpg';
import logoImg from './assets/logo.png';

// Importação corrigida para usar o componente Helmet
import { Helmet } from 'react-helmet-async';


const Button = ({ children, onClick, className = "", variant = "primary" }) => {
  const baseStyles = "px-6 py-4 rounded-md font-black uppercase tracking-tighter transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-900/40",
    secondary: "bg-white text-gray-900 hover:bg-gray-100 shadow-xl",
    outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
  };
  
  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

// Brand Logo Component
const BrandLogo = ({ light = false, className = "" }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <div className="relative group">
      <div
        className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden shadow-lg border-2 ${
          light ? 'border-white/20' : 'border-gray-200'
        } transition-all duration-300 scale-105`}
      >
        <img
          src={logoImg}
          alt="HD Pro Construction Logo"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=HD+PRO";
          }}
        />
      </div>
    </div>

    <div className="flex flex-col leading-none text-left">
      <span
        className={`text-2xl md:text-3xl font-black italic tracking-tighter ${
          light ? 'text-white' : 'text-gray-500'
        }`}
      >
        HD{""}
        <span
          className="text-[22px] text-orange-600"
          style={{
            textShadow: '3px 2px 1px rgba(1, 1, 1, 100)',
          }}
        >
          PRO
        </span>
      </span>

      <span
        className={`text-[10px] font-bold tracking-[0.3em] uppercase ${
          light ? 'text-orange-400' : 'text-gray-500'
        }`}
      >
        Construction INC
      </span>
    </div>
  </div>
);

const SectionTitle = ({ children, subtitle }) => (
  <div className="text-center mb-16">
    <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 uppercase italic tracking-tighter">
      {children}
    </h2>
    <div className="w-32 h-2 bg-orange-600 mx-auto mb-6"></div>
    {subtitle && <p className="text-gray-500 max-w-2xl mx-auto font-medium">{subtitle}</p>}
  </div>
);

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const igPosts = [
    { 
      url: img1, 
      link: "https://www.instagram.com/p/DLaxLm0J1f9/",
      caption: "High-quality paver project." 
    },
    { 
      url: img2, 
      link: "https://www.instagram.com/p/DIQtl7kuggE/",
      caption: "Professional masonry work." 
    },
    { 
      url: img3, 
      link: "https://www.instagram.com/p/C_CGh4CJkYu/",
      caption: "Modern outdoor walkway design." 
    },
    { 
      url: img4, 
      link: "https://www.instagram.com/p/DVWeq_yifvz/",
      caption: "Precision excavation and grading." 
    },
    { 
      url: img5, 
      link: "https://www.instagram.com/p/DOfirlYDTIz/",
      caption: "Premium stone wall construction." 
    }
  ];

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % igPosts.length);
  const prevSlide = () => setActiveSlide((prev) => (prev - 1 + igPosts.length) % igPosts.length);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    
    const interval = setInterval(nextSlide, 5000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  const phoneNumber = "+18572492409";
  const handleSmsRequest = () => {
    window.location.href = `sms:${phoneNumber}?body=Hi HD Pro Construction, I saw your website and I'd like to request a free estimate.`;
  };

  const services = [
    { title: "Pavers", desc: "Expert installation of interlocking concrete and stone pavers." },
    { title: "Brick Work", desc: "Professional masonry for walls, chimneys, and structural needs." },
    { title: "Walkways", desc: "Beautifully designed paths that add value to your property." },
    { title: "Stone Walls", desc: "Robust and aesthetic natural stone retaining walls." },
    { title: "Excavation", desc: "Precision site clearing, grading, and earth moving." },
    { title: "Fences", desc: "Quality residential and commercial fencing solutions." }
  ];

  return (
    <>
      <Helmet>
        <title>HD Pro Construction | Pavers, Masonry & Excavation in Boston</title>
        <meta name="description" content="HD Pro Construction INC specializes in Pavers, Brick work, Stone Walls, and Excavation services in Boston, MA. Request your free estimate today!" />
        <link rel="canonical" href="https://hdproconstruction.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hdproconstruction.com/" />
        <meta property="og:title" content="HD Pro Construction | Expert Outdoor Transformations" />
        <meta property="og:description" content="Professional masonry and excavation services in Boston. Built with integrity and precision." />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://hdproconstruction.com/" />
        <meta property="twitter:title" content="HD Pro Construction | Expert Outdoor Transformations" />
        <meta property="twitter:description" content="Professional masonry and excavation services in Boston. Built with integrity and precision." />
      </Helmet>

      <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-orange-600 selection:text-white">
        
        {/* Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white shadow-2xl py-2' : 'bg-transparent py-6 text-white'}`}>
          <div className="container mx-auto px-6 flex justify-between items-center">
            <BrandLogo light={!scrolled} className="w-auto h-auto" />

            <div className="hidden lg:flex gap-10 font-black uppercase text-xs tracking-[0.2em] items-center text-left">
              <a href="#services" className="hover:text-orange-600 transition-colors">Services</a>
              <a href="#about" className="hover:text-orange-600 transition-colors">About</a>
              <a href="#contact" className="hover:text-orange-600 transition-colors">Contact</a>
              <Button onClick={handleSmsRequest} variant={scrolled ? 'primary' : 'secondary'} className="py-3 px-6 text-[15px]">
                Free Estimate
              </Button>
            </div>

            <button className="lg:hidden p-2 bg-orange-600 rounded-md text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-gray-900 z-[60] flex flex-col items-center justify-center gap-10 text-white">
            <button className="absolute top-8 right-8" onClick={() => setIsMenuOpen(false)}><X size={48} /></button>
            <BrandLogo light className="scale-150 mb-10" />
            <a href="#services" className="text-4xl font-black italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>SERVICES</a>
            <a href="#about" className="text-4xl font-black italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>ABOUT</a>
            <a href="#contact" className="text-4xl font-black italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>CONTACT</a>
            <Button onClick={handleSmsRequest} className="text-xl px-16 py-8 shadow-2xl shadow-orange-500/20">FREE ESTIMATE</Button>
          </div>
        )}

        {/* Hero Section */}
        <header className="relative h-screen flex items-center overflow-hidden text-left">
          <div className="absolute inset-0 bg-gray-900">
            <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=2070')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <div className="inline-block bg-orange-600 text-white font-black px-4 py-1 mb-8 italic skew-x-[-12deg] animate-fade-in uppercase tracking-widest text-sm text-left">
                <span className="inline-block skew-x-[12deg]">Professional Excellence</span>
              </div>
              
              <h1 className="text-6xl md:text-[120px] font-black text-white leading-[0.85] mb-8 uppercase italic tracking-tighter drop-shadow-2xl text-left">
                Transforming <br />
                <span className="text-orange-600">Outdoor</span> <br />
                Spaces
              </h1>

              {/* Instagram Bio Integration */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-orange-500 font-black uppercase tracking-widest text-sm mb-10 border-l-4 border-orange-600 pl-6">
                <span>Pavers</span> | <span>Brick</span> | <span>Walkways</span> | <span>Stone Walls</span> | <span>Excavation</span> | <span>Fences</span> | <span>Paint</span> 
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Button onClick={handleSmsRequest} className="text-xl py-6 px-12 group">
                  <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
                  Text for Free Estimate
                </Button>
                <div className="flex items-center gap-4 text-white">
                  <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center">
                     <Phone size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Direct Call</p>
                    <p className="text-xl font-black tracking-tighter italic">+1 (857) 249-2409</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute bottom-12 right-12 hidden lg:block bg-white p-6 rounded-2xl shadow-2xl rotate-3 border-b-8 border-orange-600">
            <p className="text-gray-400 text-[10px] font-black uppercase mb-1">Owner & Operator</p>
            <p className="text-3xl font-black italic tracking-tighter text-gray-900">Dan</p>
          </div>
        </header>

        {/* Services Section */}
        <section id="services" className="py-32 bg-gray-50 relative text-left">
          <div className="container mx-auto px-6">
            <SectionTitle subtitle="Professional masonry and excavation services for your next outdoor project.">
              Expert Services
            </SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {services.map((service, idx) => (
                <div key={idx} className="group bg-white p-10 rounded-2xl shadow-xl hover:shadow-2xl transition-all border-l-8 border-transparent hover:border-orange-600 relative overflow-hidden">
                   <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Tractor size={120} />
                   </div>
                   <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter group-hover:text-orange-600 transition-colors">
                     {service.title}
                   </h3>
                   <p className="text-gray-500 font-medium leading-relaxed mb-8">
                     {service.desc}
                   </p>
                   <div className="flex items-center gap-2 text-orange-600 font-black uppercase tracking-widest text-xs group-hover:gap-4 transition-all cursor-pointer" onClick={handleSmsRequest}>
                     Book Now <ChevronRight size={16} />
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section with Instagram Carousel */}
        <section id="about" className="py-32 bg-gray-900 text-white overflow-hidden relative text-left">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            {/* Instagram Post Carousel */}
            <div className="relative group">
               <div className="relative z-10 rounded-3xl overflow-hidden border-8 border-gray-800 shadow-2xl aspect-square bg-gray-800">
                  {igPosts.map((post, idx) => (
                    <div 
                      key={idx} 
                      className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${idx === activeSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
                    >
                      <a href={post.link} target="_blank" rel="noopener noreferrer">
                        <img src={post.url} alt={post.caption} className="w-full h-full object-cover" />
                      </a>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
                        <p className="text-sm font-bold italic text-white/90 uppercase tracking-tight flex items-center justify-center gap-2">
                          <Instagram size={16} className="text-orange-500" />
                          {post.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {/* Carousel Controls */}
                  <button 
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-orange-600 p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-orange-600 p-3 rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={24} />
                  </button>

                  {/* Indicators */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {igPosts.map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-1 w-6 rounded-full transition-all ${idx === activeSlide ? 'bg-orange-600' : 'bg-white/20'}`}
                      ></div>
                    ))}
                  </div>
               </div>
               
               {/* Decorative Background Glow */}
               <div className="absolute -top-10 -left-10 w-40 h-40 bg-orange-600 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
               
               {/* Instagram Link Overlay Badge */}
               <a 
                href="https://www.instagram.com/hd_pro_construction_inc/" 
                target="_blank" 
                className="absolute -bottom-6 -right-6 z-20 bg-orange-600 p-4 rounded-2xl shadow-2xl hover:bg-white hover:text-orange-600 transition-all group flex items-center gap-3"
               >
                  <Instagram size={32} />
                  <div className="pr-4 border-r border-black/10 text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/50 leading-none mb-1">View Feed</p>
                    <p className="text-sm font-black italic tracking-tighter leading-none">Instagram</p>
                  </div>
                  <ExternalLink size={16} />
               </a>
            </div>
            
            <div className="text-left">
              <h2 className="text-5xl md:text-7xl font-black uppercase italic mb-10 leading-none">
                Quality Built <br /><span className="text-orange-600">On Experience</span>
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed italic font-medium">
                We specialize in turning vision into reality. Whether it's a new driveway, a custom stone wall, or complex excavation, HD Pro Construction INC delivers unmatched durability and style.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex gap-4 items-start">
                  <CheckCircle className="text-orange-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black uppercase italic text-lg mb-1 tracking-tight">Free Estimates</h4>
                    <p className="text-gray-500 text-sm">We provide honest on-site evaluations for every project.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <CheckCircle className="text-orange-600 shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black uppercase italic text-lg mb-1 tracking-tight">Expert Team</h4>
                    <p className="text-gray-500 text-sm">Licensed professionals with years of hard-won field experience.</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-8 bg-gray-800/50 rounded-2xl border-l-4 border-orange-600 flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-orange-600 mb-1">Follow Us</p>
                  <p className="text-xl font-black italic tracking-tighter">@hd_pro_construction_inc</p>
                </div>
                <a href="https://www.instagram.com/hd_pro_construction_inc/" target="_blank" className="bg-orange-600 p-4 rounded-xl hover:bg-orange-700 transition-colors">
                  <Instagram size={24} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section id="contact" className="py-32 relative text-center">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto bg-white p-16 md:p-24 rounded-[60px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100">
              <h2 className="text-5xl md:text-8xl font-black uppercase italic mb-8 leading-[0.85] tracking-tighter">
                Call or <span className="text-orange-600">Text</span> <br /> For Free Estimate
              </h2>
              <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto font-medium text-center">
                Let's discuss your next project. We are ready to help you transform your outdoor space in Boston, Massachusetts.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <Button onClick={handleSmsRequest} className="text-2xl py-8 px-16 shadow-2xl">
                  <MessageSquare size={32} />
                  +1 (857) 249-2409
                </Button>
                <Button variant="outline" className="text-2xl py-8 px-16 border-4">
                  <Phone size={32} />
                  Call Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-950 text-white pt-24 pb-12 text-left">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-16 mb-24">
              <div className="md:col-span-2">
                <BrandLogo light className="scale-125 origin-left mb-8" />
                <p className="text-gray-500 max-w-sm font-medium italic mb-8">
                  The leading choice for outdoor transformations in Boston. Built with integrity, precision, and grit.
                </p>
                <div className="flex gap-4">
                  <a href="https://www.instagram.com/hd_pro_construction_inc/" target="_blank" className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center hover:bg-orange-600 transition-all text-white">
                    <Instagram size={24} />
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-orange-600 font-black uppercase italic tracking-widest text-sm mb-8">Navigation</h4>
                <ul className="space-y-4 text-gray-400 font-black uppercase text-xs tracking-widest">
                  <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
                  <li><a href="#about" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">Estimates</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-orange-600 font-black uppercase italic tracking-widest text-sm mb-8">Connect</h4>
                <ul className="space-y-6 text-gray-400 font-bold">
                  <li className="flex items-start gap-3">
                    <Phone className="text-orange-600 shrink-0" size={20} />
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-black italic tracking-tighter text-white uppercase">+1 (857) 249-2409</span>
                      <span className="text-[10px] text-gray-600 mt-1">Main Office</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MessageSquare className="text-orange-600 shrink-0" size={20} />
                    <div className="flex flex-col leading-none">
                      <span className="text-sm font-black italic tracking-tighter text-white uppercase">+1 (774) 688-2900</span>
                      <span className="text-[10px] text-gray-600 mt-1">Direct SMS</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="text-orange-600 shrink-0" size={20} />
                    <span className="text-xs font-black uppercase italic text-white leading-tight">Serving all of Boston, Massachusetts</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="pt-12 border-t border-gray-900 flex flex-col md:row justify-between items-center gap-6">
              <p className="text-gray-600 font-bold uppercase text-[10px] tracking-[0.3em]">© 2024 HD PRO CONSTRUCTION INC | Built for Excellence</p>
              <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
                 <a href="#" className="hover:text-orange-600 transition-colors">Privacy</a>
                 <a href="#" className="hover:text-gray-600">Instagram</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
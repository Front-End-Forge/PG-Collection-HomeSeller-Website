// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import ShoppingCart from './components/ShoppingCart';
import UPICheckout from './components/UPICheckout';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { sampleCategories, aariCourseDetails } from './mockData';
import { fetchLiveProducts, fetchCategories } from './services/api';
import ProductListingPage from './components/ProductListingPage';
import CustomGownPage from './components/CustomGownPage';
import AariClassPage from './components/AariClassPage';
import { BookOpen, CheckCircle, Scissors, Phone, Lock, Eye, EyeOff, Sparkles, GraduationCap, ArrowLeft, ArrowRight } from 'lucide-react';

const BASE_URL = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

function App() {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab]     = useState('shop');

  // --- SECURE ROUTING & PASSWORD STATE ---
  const [isAdminMode, setIsAdminMode] = useState(() => {
    return sessionStorage.getItem('isAdminMode') === 'true';
  });
  const [enteredPin, setEnteredPin]       = useState('');
  const [showPassword, setShowPassword]   = useState(false);
  const [pinError, setPinError]           = useState('');

  // --- DATABASE DATA HOOK STATES ---
  const [liveProducts, setLiveProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // 🆕 STATE: Tracks the active category when a circle is tapped to open a separate page
  const [activeCategoryView, setActiveCategoryView] = useState(null);

  // Auto Scroll-to-Top Reset on screen changes across all monitors
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTab, activeCategoryView]);

  // Handle category mapping parameters configuration sets
  const getMatchKey = (name) => {
    if (name.includes('150')) return '150_Tops';
    if (name.includes('நைட்டி') || name.toLowerCase().includes('nightie')) return 'Nighties';
    if (name.includes('இன்னர்') || name.toLowerCase().includes('inner')) return 'Innerwear';
    if (name.includes('குழந்') || name.toLowerCase().includes('kid')) return 'Kids_Wear';
    return 'Others';
  };
  // --- CHECKOUT TOGGLE MODAL STATES ---
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  // --- CUSTOMER PROFILE STATUS TRACKER ---
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  // --- CENTRAL SOURCE OF TRUTH FOR THE CART ---
  const [cartItems, setCartItems] = useState([]);

  const handleGlobalRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (product) => {
    if (cartItems.some(item => item.id === product._id)) {
      alert("This unique item is already in your cart!");
      return;
    }
    setCartItems(prev => [
      ...prev,
      { id: product._id, title: product.title, size: product.size, price: product.price }
    ]);
  };

  const [activeSlide, setActiveSlide] = useState(0);

  const carouselSlides = [
    {
      title: "சிறுவர்களுக்கான ட்ரெண்டி ஆடைகள்!",
      desc: "மென்மையான காட்டன் துணியில் சொகுசான தையல் வடிவமைப்பு.",
      badge: "புதிய வரவு (New)",
      btnText: "BUY NOW",
      btnClass: "from-amber-400 via-orange-400 to-yellow-500 text-slate-950 shadow-orange-500/30 hover:shadow-orange-500/50",
      tab: "shop",
      image_url: "/slide1.jpg"
    },
    {
      title: "அழகிய குழந்தைகள் பட்டு பாவாடை!",
      desc: "விசேஷ தினங்களை மேலும் சிறப்பாக்க உங்களது விருப்பத்திற்கேற்ப தைத்து தரப்படும்.",
      badge: "டிசைனர் கவுன்",
      btnText: "ORDER NOW",
      btnClass: "from-pink-500 via-rose-450 to-purple-600 text-white shadow-rose-500/30 hover:shadow-rose-500/50",
      tab: "stitching",
      image_url: "/slide2.jpg"
    },
    {
      title: "தொழில்முறை ஆரி எம்பிராய்டரி!",
      desc: "அழகின் நுணுக்கம் ஆரியில் அரிய கலை. புதிய பேட்ச் வகுப்புகளுக்கு முன்பதிவு செய்ய தொடர்பு கொள்ளவும்.",
      badge: "அட்மிஷன் ஓபன்",
      btnText: "BOOK NOW",
      extraNote: "(Only 15 seats are Welcomed)",
      btnClass: "from-sky-400 via-teal-400 to-emerald-500 text-slate-950 shadow-teal-500/30 hover:shadow-teal-500/50",
      tab: "classes",
      image_url: "/slide3.jpg"
    }
  ];

  useEffect(() => {
    if (currentTab !== 'shop') return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [currentTab]);

  const [categories, setCategories] = useState(sampleCategories);

  // Trigger automated data loading when the page spins up and set up a 4-second background refresh sync
  useEffect(() => {
    const getStoreInventory = async (showLoading = true) => {
      if (showLoading) setIsLoading(true);
      
      // Load products
      const prodResult = await fetchLiveProducts();
      if (prodResult.success) {
        setLiveProducts(prodResult.data);
      } else {
        setLiveProducts([]);
      }

      // Load category image overrides
      try {
        const catResult = await fetchCategories();
        if (catResult.success && catResult.data && catResult.data.length > 0) {
          const merged = sampleCategories.map(cat => {
            const match = catResult.data.find(c => c.name === cat.name);
            return match ? { ...cat, image_url: match.image_url } : cat;
          });
          setCategories(merged);
        }
      } catch (err) {
        console.error("Error fetching dynamic categories:", err);
      }

      if (showLoading) setIsLoading(false);
    };

    // Initial first-paint load
    getStoreInventory(true);

    // Setup quiet 4-second short-polling for real-time storefront synchronization
    const pollInterval = setInterval(() => {
      getStoreInventory(false);
    }, 4000);

    return () => clearInterval(pollInterval);
  }, []);

  // Change this to any 4-digit code the seller prefers
  const SECRET_ADMIN_PIN = '2026';



  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    if (enteredPin === SECRET_ADMIN_PIN) {
      setIsAdminMode(true);
      sessionStorage.setItem('isAdminMode', 'true');
      setPinError('');
      setEnteredPin('');
    } else {
      setPinError('❌ Invalid Admin PIN! Access Denied.');
      setEnteredPin('');
    }
  };

  const handleExitAdmin = () => {
    setIsAdminMode(false);
    sessionStorage.removeItem('isAdminMode');
    navigate('/');
  };

  const handleCancelLogin = () => {
    setPinError('');
    setEnteredPin('');
    navigate('/');
  };

  return (
    <Routes>
      {/* Route 1: Public Customer Storefront */}
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-gray-50 pb-20 sm:pb-8">
            <Navbar 
              currentTab={currentTab} 
              setCurrentTab={setCurrentTab} 
              setIsAuthOpen={setIsAuthOpen} 
              cartCount={cartItems.length}
              searchQuery={searchQuery}       
              setSearchQuery={setSearchQuery} 
            />

            {/* --- HIGH-CONTRAST CHANNELS FIXED NAVIGATION GRID STRIP --- */}
            <div className="bg-slate-50 border-b border-slate-200 py-4 px-4 w-full select-none shadow-sm">
              <div className="max-w-7xl mx-auto grid grid-cols-2 sm:flex sm:flex-row sm:justify-center items-center gap-3 sm:gap-8 font-black uppercase text-xs sm:text-sm tracking-wide">
                
                {/* Link 1 */}
                <button 
                  onClick={() => { setCurrentTab('shop'); setActiveCategoryView(null); }} 
                  className={`w-full sm:w-auto py-2.5 px-4 rounded-xl border-2 font-black transition-all text-center ${
                    currentTab === 'shop' && !activeCategoryView
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-102' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ஆடை ஸ்டோர்
                </button>
                
                {/* Link 2 */}
                <button 
                  onClick={() => { setCurrentTab('stitching'); setActiveCategoryView(null); }} 
                  className={`w-full sm:w-auto py-2.5 px-4 rounded-xl border-2 font-black transition-all text-center ${
                    currentTab === 'stitching' 
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-102' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  டிசைனர் கவுன்கள்
                </button>
                
                {/* Link 3: 🚀 FIXED - "(3k)" text has been completely removed from this button label */}
                <button 
                  onClick={() => { setCurrentTab('classes'); setActiveCategoryView(null); }} 
                  className={`w-full sm:w-auto py-2.5 px-4 rounded-xl border-2 font-black transition-all text-center ${
                    currentTab === 'classes' 
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-102' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ஆரி வகுப்பு
                </button>
                
                {/* Link 4 */}
                <button 
                  onClick={() => { setCurrentTab('contact'); setActiveCategoryView(null); }} 
                  className={`w-full sm:w-auto py-2.5 px-4 rounded-xl border-2 font-black transition-all text-center ${
                    currentTab === 'contact' 
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md scale-102' 
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  தொடர்பு கொள்ள
                </button>

              </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 mt-6 flex-1 w-full pb-32 sm:pb-12">

              {activeCategoryView ? (
                <div className="space-y-6 animate-fade-in text-left">
                  
                  {/* 🚀 FIXED: Removed duplicate arrow, set 'w-fit' to stop it from stretching, and optimized padding */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveCategoryView(null)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 hover:border-teal-600 hover:bg-teal-50 text-gray-800 hover:text-teal-900 text-xs font-black rounded-xl transition shadow-sm active:scale-95 w-fit"
                    >
                      {/* Clean Lucide-React Arrow Icon (Replaces the text arrows perfectly) */}
                      <ArrowLeft className="w-4 h-4 text-teal-700 flex-shrink-0" />
                      <span className="leading-none pt-0.5">முகப்பு பக்கத்திற்குச் செல்ல (Back to Home)</span>
                    </button>
                  </div>

                  {/* Render the full-width list filtering loop inside an isolated canvas stage page view */}
                  <ProductListingPage 
                    products={liveProducts} 
                    categories={categories}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    selectedCategoryProp={activeCategoryView.key} // Passes dynamic match key tag parameters down
                    onAddToCart={(itemToAdd) => {
                      handleAddToCart(itemToAdd);
                      alert(`🛒 Added "${itemToAdd.title}" to your cart!`);
                    }} 
                    onBuyNow={(directProductItem) => {
                      const isAlreadyInCart = cartItems.some(item => item._id === directProductItem._id || item.id === directProductItem.id);
                      if (!isAlreadyInCart) {
                        setCartItems([...cartItems, directProductItem]);
                      }
                      setCurrentTab('cart');
                      setActiveCategoryView(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                </div>
              ) : (
                <>
              {currentTab === 'shop' && (
                <div className="space-y-10">
                  
                  {/* --- STEP 3: INTERACTIVE HOME ROUNDELS (CLICK TO FILTER GENERATOR) --- */}
                  <div className="w-full space-y-2 text-center my-4 select-none">
                    <section className="flex gap-6 overflow-x-auto pb-4 justify-start sm:justify-center scrollbar-hide snap-x px-4">
                      {categories.map((cat) => (
                        <div 
                          key={cat.id || cat._id} 
                          onClick={() => setActiveCategoryView({ name: cat.name, key: getMatchKey(cat.name) })} // 🚀 REDIRECTS TRIGGER: Opens isolated canvas state page view instantly
                          className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0 snap-center group"
                        >
                          <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md overflow-hidden group-hover:border-teal-500 transition-all duration-200">
                            {cat.image_url ? (
                              <img 
                                src={`${BASE_URL}${cat.image_url}`} 
                                alt={cat.name} 
                                className="w-full h-full object-cover transform group-hover:scale-105 transition"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (!e.target.parentNode.querySelector('.fallback-icon')) {
                                    const fallbackSpan = document.createElement('span');
                                    fallbackSpan.className = 'text-2xl fallback-icon';
                                    fallbackSpan.innerText = cat.icon || '👗';
                                    e.target.parentNode.appendChild(fallbackSpan);
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-2xl">{cat.icon || '👗'}</span>
                            )}
                          </div>
                          <span className="text-xs font-black text-gray-600 group-hover:text-teal-700 transition-colors">{cat.name}</span>
                        </div>
                      ))}
                    </section>
                  </div>
                  {/* --- STEP 4: FRESHLY CREATED PREMIUM RESPONSIVE HERO BANNER CAROUSEL --- */}
                  <div className="relative overflow-hidden shadow-2xl rounded-3xl min-h-[360px] sm:min-h-[420px] md:min-h-[480px] my-6 border border-sky-950 group">
                    {carouselSlides.map((slide, idx) => {
                      const isActive = activeSlide === idx;
                      return (
                        <div 
                          key={idx}
                          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out flex flex-row items-center justify-between p-10 sm:p-12 md:p-16 gap-8 ${isActive ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
                          style={{
                            backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 0.6), rgba(15, 23, 42, 0.2)), url(${slide.image_url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          {/* Left Side Content Overlay */}
                          <div className={`max-w-2xl space-y-4 text-left transition-all duration-1000 transform ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
                            <span className="bg-sky-500 bg-opacity-25 text-yellow-300 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-md border border-sky-400 inline-block font-sans">
                              ⚡ {slide.badge}
                            </span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                              {slide.title}
                            </h2>
                            <p className="text-sky-100 text-xs sm:text-sm font-semibold opacity-95 tracking-wide max-w-xl drop-shadow-sm">
                              {slide.desc}
                            </p>
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
                              <button 
                                onClick={() => setCurrentTab(slide.tab)}
                                className={`px-7 py-3.5 bg-gradient-to-r ${slide.btnClass} font-black text-xs sm:text-sm rounded-xl shadow-xl transition-all transform hover:scale-105 active:scale-95 uppercase tracking-widest flex items-center justify-center gap-2 duration-200 group/btn w-fit`}
                              >
                                <span>{slide.btnText}</span>
                                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200 flex-shrink-0" />
                              </button>
                              {slide.extraNote && (
                                <span className="text-yellow-300 text-xs sm:text-sm font-bold bg-slate-950/70 border border-teal-500/30 px-3 py-1.5 rounded-lg select-none backdrop-blur-sm shadow-sm animate-pulse-subtle w-fit leading-none">
                                  {slide.extraNote}
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}

                    {/* Manual Navigation Controls (Arrows) */}
                    <button 
                      onClick={() => setActiveSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)}
                      aria-label="முந்தைய ஸ்லைடு (Previous Slide)"
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900 bg-opacity-50 hover:bg-opacity-80 border border-white border-opacity-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ‹
                    </button>
                    <button 
                      onClick={() => setActiveSlide((prev) => (prev + 1) % carouselSlides.length)}
                      aria-label="அடுத்த ஸ்லைடு (Next Slide)"
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-900 bg-opacity-50 hover:bg-opacity-80 border border-white border-opacity-10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ›
                    </button>

                    {/* Page Pagination Dots Indicators */}
                    <div className="absolute right-8 bottom-6 flex gap-2.5 z-20">
                      {carouselSlides.map((_, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => setActiveSlide(idx)}
                          aria-label={`ஸ்லைடுக்குச் செல்ல (Go to slide) ${idx + 1}`}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${activeSlide === idx ? 'bg-yellow-400 w-6' : 'bg-sky-900 hover:bg-sky-700'}`}
                        />
                      ))}
                    </div>
                  </div>



                  {/* --- CRITICAL ARCHITECTURE UPDATE: LOAD TRUE PLP INTERFACES --- */}
                  <ProductListingPage 
                    products={liveProducts} 
                    categories={categories}
                    isLoading={isLoading}
                    searchQuery={searchQuery}
                    selectedCategoryProp="ALL" // Home list shows everything standardly
                    onAddToCart={(itemToAdd) => {
                      handleAddToCart(itemToAdd);
                      alert(`🛒 Added "${itemToAdd.title}" to your cart!`);
                    }} 
                    
                    // 🚀 FIXED: Concatenates new dress without erasing previous items, then jumps to invoices bill
                    onBuyNow={(directProductItem) => {
                      const isAlreadyInCart = cartItems.some(item => item._id === directProductItem._id || item.id === directProductItem.id);
                      if (!isAlreadyInCart) {
                        setCartItems([...cartItems, directProductItem]);
                      }
                      setCurrentTab('cart'); // Swaps screen view to invoice fields instantly
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />

                  {/* --- உன்னதமான தையல் & ஆரி பயிற்சி பிரிவு (உயர்தர டிசைன்) --- */}
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-10 text-left">
                    <div className="col-span-full mb-2">
                      <h3 className="text-base font-black text-gray-950 flex items-center gap-2 uppercase tracking-wide">
                        🪡 எங்கள் பிரத்யேக சேவைகள்
                      </h3>
                    </div>
                    
                    {/* 👑 பேனர் 1: பிரீமியம் தையல் கலை சேவைகள் (இமேஜ் உடன் மாற்றியமைக்கப்பட்ட உயர்தர டிசைன்) */}
                    <div 
                      onClick={() => { setCurrentTab('stitching'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="relative rounded-3xl overflow-hidden shadow-md group cursor-pointer bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex flex-col md:flex-row-reverse justify-between min-h-[250px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-blue-900/30"
                    >
                      {/* 🖼️ வலது பக்கம்: உங்களது கஸ்டம் கவுன் நிஜ புகைப்பட ஃபிரேம் */}
                      <div className="w-full md:w-2/5 h-56 sm:h-64 md:h-auto relative overflow-hidden flex-shrink-0 bg-slate-950">
                        {/* நுட்பமான கிரேடியன்ட்: மொபைலில் படம் தெளிவாகத் தெரியும், டெஸ்க்டாப்பில் மட்டும் மென்மையாக கலக்கும் */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent md:bg-gradient-to-r md:from-slate-900 md:via-transparent md:to-transparent z-10"></div>
                        
                        <img 
                          src={`${BASE_URL}/uploads/stitching-portfolio-banner.jpg`} // உங்கள் லைவ் பேக்கெண்ட் இமேஜ் பாத்
                          alt="Custom stitched ethnic long frock gown sample by PG Collection" 
                          loading="lazy"
                          className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // சேஃப்டி ஃபால்பேக்: இமேஜ் லோடாவதில் சிக்கல் இருந்தால் எமோஜி காண்பிக்கும்
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl bg-slate-950">💃</div>`;
                          }}
                        />
                      </div>

                      {/* இடது பக்கம்: விவரங்கள் மற்றும் தலைப்புகள் */}
                      <div className="p-6 flex flex-col justify-between flex-1 relative z-10 space-y-4">
                        <div className="space-y-2.5">
                          <span className="bg-blue-950 bg-opacity-70 text-blue-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-900/50 inline-block">
                            ஆடை தையல் கலை
                          </span>
                          <h4 className="text-xl font-black text-white tracking-tight leading-tight">
                            பிரீமியம் கவுன்கள் & லாங் பிராக்குகள்
                          </h4>
                          <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-sm opacity-95">
                            உங்களுடைய சரியான உடல் அளவுகளுக்கு ஏற்ப பட்டு பாவாடை சட்டைகள், லாங் பிராக்குகள் மற்றும் இந்தோ-வெஸ்டர்ன் கவுன்கள் ஆடைகளை மிகக் கச்சிதமாக தைத்து தருகிறோம்!
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-800/40">
                          <span className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                            👗 தையல் ஆர்டர் செய்ய இங்கே கிளிக் செய்யவும் →
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* பேனர் 2: ஆரி எம்பிராய்டரி அகாடமி (உயர்தர டிசைன் - இமேஜ் உடன் மாற்றியமைக்கப்பட்டது) */}
                    <div 
                      onClick={() => { setCurrentTab('classes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="relative rounded-3xl overflow-hidden shadow-md group cursor-pointer bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 flex flex-col md:flex-row-reverse justify-between min-h-[250px] transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-blue-900/30"
                    >
                      {/* 🖼️ வலது பக்கம்: உங்களது ஆரி எம்பிராய்டரி மயில் டிசைன் புகைப்பட ஃபிரேம் */}
                      <div className="w-full md:w-2/5 h-56 sm:h-64 md:h-auto relative overflow-hidden flex-shrink-0 bg-slate-950">
                        {/* நுட்பமான கிரேடியன்ட்: மொபைலில் படம் தெளிவாகத் தெரியும், டெஸ்க்டாப்பில் மட்டும் மென்மையாக கலக்கும் */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent md:bg-gradient-to-r md:from-slate-900 md:via-transparent md:to-transparent z-10"></div>
                        
                        <img 
                          src="/aari-peacock-embroidery.png" // Static path mapped in React public folder
                          alt="Beautiful Aari peacock embroidery sleeve design sample by PG Collection" 
                          loading="lazy"
                          className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            // சேஃப்டி ஃபால்பேக்: இமேஜ் லோடாவதில் சிக்கல் இருந்தால் எமோஜி காண்பிக்கும்
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl bg-slate-950">🪡</div>`;
                          }}
                        />
                      </div>

                      {/* இடது பக்கம்: விவரங்கள் மற்றும் தலைப்புகள் */}
                      <div className="p-6 flex flex-col justify-between flex-1 relative z-10 space-y-4">
                        <div className="space-y-2.5">
                          <span className="bg-blue-950 bg-opacity-70 text-blue-300 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md border border-blue-900/50 inline-block">
                            தொழில்முறை கல்வி
                          </span>
                          <h4 className="text-xl font-black text-white tracking-tight leading-tight">
                            பியூட்டிஃபுல் ஆரி எம்பிராய்டரி வகுப்பு
                          </h4>
                          <p className="text-slate-300 text-xs font-semibold leading-relaxed max-w-sm opacity-95">
                            அடிப்படை செயின் ஸ்டிட்ச் முதல் பிரைடல் பிளவுஸ் டிசைன்கள் மற்றும் கனமான கவுன் மேப்பிங் வரை முழுமையான ஆரி எம்பிராய்டரி கலைகளை மிக எளிதாக கற்றுக்கொள்ளுங்கள். கட்டணம் வெறும் ₹3,000 மட்டுமே!
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-800/40">
                          <span className="text-xs font-black text-yellow-400 uppercase tracking-wider flex items-center gap-1 group-hover:underline">
                            🎓 வகுப்பில் சேர விபரம் கேட்க →
                          </span>
                        </div>
                      </div>
                    </div>
                  </section>

                </div>
              )}

              {/* ================================================ */}
              {/* VIEW 2: CUSTOM TAILORING                         */}
              {/* ================================================ */}
              {currentTab === 'stitching' && (
                <CustomGownPage />
              )}

              {/* ================================================ */}
              {/* VIEW 3: AARI CLASSES                             */}
              {/* ================================================ */}
              {currentTab === 'classes' && (
                <AariClassPage />
              )}

              {/* ================================================ */}
              {/* VIEW 4: SHOPPING CART                            */}
              {/* ================================================ */}
              {currentTab === 'cart' && (
                <ShoppingCart 
                  cartItems={cartItems} 
                  onRemoveItem={handleGlobalRemoveItem} 
                  clearCart={() => setCartItems([])}
                />
              )}

              {/* ================================================ */}
              {/* VIEW 5: CONTACT US                               */}
              {/* ================================================ */}
              {currentTab === 'contact' && (
                <div className="max-w-xl mx-auto bg-white rounded-[24px] border border-gray-150 p-6 sm:p-8 text-center shadow-md space-y-6 my-6 select-none animate-fade-in">
                  {/* --- 📞 எங்களைத் தொடர்பு கொள்ள பக்க விபரங்கள் (TRANSLATED TO TAMIL) --- */}
                  
                  {/* Circular Icon Accent Stage */}
                  <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100">
                    <span className="text-xl">📞</span>
                  </div>

                  {/* Large Bold Headline Wording (Scaled Up and Localized) */}
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight leading-tight">
                      கேள்விகள் உள்ளதா? எங்களை நேரடியாகத் தொடர்பு கொள்ளவும்!
                    </h3>
                    {/* Description paragraph text expanded and mapped */}
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 leading-relaxed max-w-sm mx-auto">
                      நீங்கள் ஒரு கஸ்டம் பிராக் டிசைனைப் பற்றி விவாதிக்க விரும்பினாலும் அல்லது அடுத்த ஆரி கிளாஸ் பயிற்சி பேட்ச் விபரங்களைப் பற்றிக் கேட்க விரும்பினாலும், எப்போது வேண்டுமானாலும் எங்களைத் தாராளமாகத் தொடர்பு கொள்ளலாம்.
                    </p>
                  </div>

                  {/* Dual Support Core Action Links Buttons */}
                  <div className="space-y-3 pt-2">
                    
                    {/* Action 1: Green WhatsApp Pipeline Trigger pointed to her primary line */}
                    <a 
                      href="https://wa.me/917010006789?text=வணக்கம்!%20சேலம்%20பிஜி%20கலெக்ஷன்%20ஸ்டுடியோவின்%20சேவைகள்%20மற்றும்%20ஆரி%20வகுப்பு%20பற்றிய%20விபரங்களை%20நான்%20கேட்க%20விரும்புகிறேன்."
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-md transition-all duration-150 transform hover:-translate-y-0.5 flex items-center justify-center gap-2 shadow-emerald-100"
                    >
                      💬 வாட்ஸ்அப்பில் மெசேஜ் செய்ய (Message on WhatsApp)
                    </a>

                    {/* Action 2: Direct Calling Interface Wrapper pointed to her secondary line */}
                    <a 
                      href="tel:+917010006789"
                      className="w-full py-3.5 bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                    >
                      📞 நேரடியாக போன் செய்ய (Call Direct Support Phone)
                    </a>

                  </div>

                  {/* Security Trust Anchor Label */}
                  <div className="text-[10px] text-gray-400 font-black flex items-center gap-1 justify-center pt-2 uppercase tracking-wide">
                    ✓ உடனடி உதவி — பிஜி கலெக்ஷன் ஸ்டுடியோ சேலம்
                  </div>

                </div>
              )}
              </>
            )}

            </main>

            {/* --- OVERLAY POPUP FOR UPI TRANSACTION HOLD --- */}
            {showCheckoutModal && (
              <UPICheckout 
                amount={500} // The ₹500 advance fee we planned
                orderType="Aari Embroidery Class Admission"
                onClose={() => setShowCheckoutModal(false)}
                onPaymentSuccess={(utrNumber) => {
                  setShowCheckoutModal(false);
                  alert(`🎉 Registration Received! Your UTR Verification Reference Number is: ${utrNumber}. The instructor will contact you on WhatsApp within 1 hour.`);
                  // Here your backend connection API can save the record dynamically!
                }}
              />
            )}

            {/* --- DYNAMIC CUSTOMER VERIFICATION MODAL OVERLAY --- */}
            <AuthModal 
              isOpen={isAuthOpen}
              onClose={() => setIsAuthOpen(false)}
              onAuthSuccess={(verifiedPhone) => {
                setAuthenticatedUser(verifiedPhone);
                alert(`Welcome back! User logged in smoothly: ${verifiedPhone}`);
              }}
            />


            {/* Injecting the global footer element layout */}
            <Footer setCurrentTab={setCurrentTab} />
          </div>
        }
      />

      {/* Route 2: Secret Admin Login & Dashboard */}
      <Route
        path="/secret-admin-login"
        element={
          isAdminMode ? (
            <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
              <div className="max-w-4xl mx-auto mb-4 flex justify-between items-center">
                <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Lock className="w-3 h-3" /> Secure Admin Session Active
                </span>
                <button
                  onClick={handleExitAdmin}
                  className="text-xs font-bold text-gray-600 hover:text-teal-700 bg-white border px-4 py-1.5 rounded-lg shadow-sm transition"
                >
                  Exit Dashboard & Return to Shop
                </button>
              </div>
              <AdminDashboard />
            </div>
          ) : (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
              <div className="max-w-sm w-full bg-white rounded-2xl p-6 shadow-2xl border border-gray-100 text-center space-y-5">

                {/* Lock Icon */}
                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto border-2 border-red-100">
                  <Lock className="w-6 h-6 text-red-600" />
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-black text-gray-900">Boutique Administration Login</h3>
                  <p className="text-xs text-gray-400 mt-1">Enter your 4-digit security PIN to access the shop backend.</p>
                </div>

                {/* PIN Form */}
                <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      maxLength={4}
                      placeholder="••••"
                      value={enteredPin}
                      autoFocus
                      onChange={(e) => setEnteredPin(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center tracking-[0.5em] text-xl font-black p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 bg-gray-50 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Error Message */}
                  {pinError && (
                    <p className="text-xs text-red-600 font-bold bg-red-50 py-2 px-3 rounded-lg border border-red-100 font-sans text-center">
                      {pinError}
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleCancelLogin}
                      className="flex-1 py-2.5 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl transition shadow-sm"
                    >
                      Verify PIN
                    </button>
                  </div>
                </form>

                <p className="text-[10px] text-gray-300">
                  Authorized personnel only · Boutique Management System
                </p>
              </div>
            </div>
          )
        }
      />

      {/* Fallback Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

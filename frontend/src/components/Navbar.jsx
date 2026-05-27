// frontend/src/components/Navbar.jsx
import React from 'react';
import { Search, ShoppingBag, User, Home, Grid, BookOpen } from 'lucide-react';

// We pass currentTab, setCurrentTab, and setIsAuthOpen from App.js as props
export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  setIsAuthOpen, 
  cartCount, 
  searchQuery,       // 🆕 Receives search text state
  setSearchQuery     // 🆕 Receives state setter function
}) {
  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          
          {/* PG Collection Branded Logo */}
          <div onClick={() => { setCurrentTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-2 cursor-pointer select-none">
            <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-serif text-base font-black">PG</span>
            </div>
            <div className="flex flex-col justify-center text-left">
              <div className="flex items-center gap-1">
                <span className="text-base font-black text-gray-900">PG</span>
                <span className="text-base font-extrabold text-amber-500">Collection</span>
              </div>
              <span className="text-[8px] font-black text-sky-700 uppercase tracking-widest -mt-1 block">STUDIO - SALEM</span>
            </div>
          </div>

          {/* 🚀 FIXED: SEARCH BAR IS NOW DYNAMICALLY BOUND TO THE STATE ENGINE */}
          <div className="flex-1 max-w-lg relative hidden sm:block">
            <input
              type="text"
              placeholder='தேடுக: "நைட்டிகள்", "கவுன்கள்" அல்லது "ஆரி வகுப்புகள்"...'
              value={searchQuery} // Binds search box text directly to state engine
              onChange={(e) => {
                setSearchQuery(e.target.value);
                // Automatically switch the view back to the clothing store if they start searching
                if (currentTab !== 'shop') setCurrentTab('shop'); 
              }}
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm bg-gray-50 font-bold text-gray-800 placeholder-gray-400"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 cursor-default" />
          </div>

          {/* Right Access Actions Box */}
          <div className="flex items-center gap-6 select-none">
            <div onClick={() => setIsAuthOpen(true)} className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-sky-600 transition">
              <User className="w-5 h-5" />
              <span className="text-sm font-black hidden sm:inline">உள்நுழைக</span>
            </div>

            {/* 🚀 FIXED: CLICKING CARDS BAG ICON SWITCHES THE SCREEN DIRECTLY TO SHOPPING CART */}
            <div 
              onClick={() => {
                setCurrentTab('cart');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="relative cursor-pointer transition text-gray-700 hover:text-sky-600"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </div>
          </div>

        </div>

        {/* --- FRONTEND NAVBAR MENU STRIP --- */}
        <nav className="bg-sky-900 py-3 hidden sm:flex justify-center items-center gap-6 text-xs font-black uppercase tracking-wider text-sky-100 select-none shadow-sm">
          
          <button 
            onClick={() => setCurrentTab('shop')} 
            className={`transition-all duration-200 px-3 py-1 rounded-md ${
              currentTab === 'shop' 
                ? 'bg-white text-sky-950 shadow-sm scale-105' 
                : 'hover:bg-sky-700 hover:text-white'
            }`}
          >
            Shop Items
          </button>
          
          <span className="text-sky-700/50 font-light opacity-50">|</span>
          
          <button 
            onClick={() => setCurrentTab('stitching')} 
            className={`transition-all duration-200 px-3 py-1 rounded-md ${
              currentTab === 'stitching' 
                ? 'bg-white text-sky-950 shadow-sm scale-105' 
                : 'hover:bg-sky-700 hover:text-white'
            }`}
          >
            Custom Gowns
          </button>
          
          <span className="text-sky-700/50 font-light opacity-50">|</span>
          
          {/* 🚀 FIXED: The "(3k)" text suffix has been permanently removed from this navigation button */}
          <button 
            onClick={() => setCurrentTab('classes')} 
            className={`transition-all duration-200 px-3 py-1 rounded-md ${
              currentTab === 'classes' 
                ? 'bg-white text-sky-950 shadow-sm scale-105' 
                : 'hover:bg-sky-700 hover:text-white'
            }`}
          >
            Aari Class
          </button>
          
          <span className="text-sky-700/50 font-light opacity-50">|</span>
          
          <button 
            onClick={() => setCurrentTab('contact')} 
            className={`transition-all duration-200 px-3 py-1 rounded-md ${
              currentTab === 'contact' 
                ? 'bg-white text-sky-950 shadow-sm scale-105' 
                : 'hover:bg-sky-700 hover:text-white'
            }`}
          >
            Contact Studio
          </button>

        </nav>
      </header>

      {/* --- 🚀 FIXED: HIGH-VISIBILITY MOBILE BOTTOM NAV BAR (TAMIL + DARK BLUE BACKGROUND) --- */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-sky-950 via-slate-950 to-black border-t border-sky-950 shadow-2xl flex justify-around items-center h-16 sm:hidden px-2 rounded-t-2xl">
        
        {/* முகப்பு (Home Tab) */}
        <button 
          onClick={() => setCurrentTab('shop')} 
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            currentTab === 'shop' 
              ? 'bg-white bg-opacity-15 text-yellow-400 scale-105' 
              : 'text-sky-100 text-opacity-70 hover:text-white'
          }`}
        >
          <Home className="w-5 h-5 filter drop-shadow-sm" />
          <span className="text-[11px] font-black tracking-wide">முகப்பு</span>
        </button>

        {/* கவுன்கள் (Gowns Tab) */}
        <button 
          onClick={() => setCurrentTab('stitching')} 
          className={`flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all ${
            currentTab === 'stitching' 
              ? 'bg-white bg-opacity-15 text-yellow-400 scale-105' 
              : 'text-sky-100 text-opacity-70 hover:text-white'
          }`}
        >
          <Grid className="w-5 h-5 filter drop-shadow-sm" />
          <span className="text-[11px] font-black tracking-wide">கவுன்கள்</span>
        </button>

        {/* வகுப்புகள் (Classes Tab) */}
        <button 
          onClick={() => setCurrentTab('classes')} 
          className={`flex flex-col items-center justify-center gap-1 w-18 h-12 rounded-xl transition-all ${
            currentTab === 'classes' 
              ? 'bg-white bg-opacity-15 text-yellow-400 scale-105' 
              : 'text-sky-100 text-opacity-70 hover:text-white'
          }`}
        >
          <BookOpen className="w-5 h-5 filter drop-shadow-sm" />
          <span className="text-[11px] font-black tracking-wide">வகுப்புகள்</span>
        </button>

        {/* உள்நுழை (Profile Tab) */}
        <button 
          onClick={() => setIsAuthOpen(true)} 
          className="flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl text-sky-100 text-opacity-70 hover:text-white transition-all"
        >
          <User className="w-5 h-5 filter drop-shadow-sm" />
          <span className="text-[11px] font-black tracking-wide">உள்நுழை</span>
        </button>

      </div>
    </>
  );
}

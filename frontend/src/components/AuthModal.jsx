// frontend/src/components/AuthModal.jsx
import React, { useState } from 'react';
import { X, User, Smartphone, MapPin, CheckCircle, ShieldCheck, Lock } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    cityPin: ''
  });
  
  const [validationError, setValidationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleProfileLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const cleanName = formData.fullName.trim();
    if (!cleanName) {
      return setValidationError("❌ டெலிவரி பில்லிற்காக தயவுசெய்து உங்கள் பெயரை உள்ளிடவும்.");
    }
    const nameRegex = /^[A-Za-z\u0B80-\u0BFF\s]+$/; 
    if (!nameRegex.test(cleanName)) {
      return setValidationError("❌ பெயர்களில் எண்கள் அல்லது சிறப்பு குறியீடுகள் இருக்கக்கூடாது!");
    }

    const cleanPhone = formData.phone.trim();
    if (cleanPhone.length < 10) {
      return setValidationError(`❌ மொபைல் எண் முழுமையடையவில்லை! 10 இலக்கங்கள் தேவை.`);
    }

    const cleanCityPin = formData.cityPin.trim();
    if (!cleanCityPin) {
      return setValidationError("❌ தயவுசெய்து உங்கள் மாவட்டம் அல்லது பின்கோடை உள்ளிடவும்!");
    }

    try {
      setIsSubmitting(true);
      alert(`🎉 சுயவிவரம் சரிபார்க்கப்பட்டது! பிஜி கலெக்ஷன் உங்களை அன்புடன் வரவேற்கிறது, ${cleanName}.`);
      onAuthSuccess(cleanPhone); 
      onClose(); 
    } catch (err) {
      console.error(err);
      onAuthSuccess(cleanPhone);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center sm:p-4 animate-fade-in backdrop-blur-[2px]">
      
      {/* Immersive Mobile Baseline Frame */}
      <div className="bg-white w-full h-full sm:h-auto sm:max-w-md border border-gray-100 p-5 sm:p-6 space-y-6 flex flex-col justify-between fixed inset-0 sm:relative sm:rounded-3xl shadow-2xl overflow-y-auto">
        
        {/* Upper content stack wrapper */}
        <div className="space-y-6 flex-1 w-full">
          
          {/* Top Branding Header Area */}
          <div className="bg-gradient-to-br from-teal-800 via-teal-950 to-black p-5 text-white text-center relative overflow-hidden rounded-2xl border border-teal-950 select-none mt-2 sm:mt-0 shadow-md">
            <div className="absolute -right-6 -top-6 w-20 h-24 bg-teal-700 bg-opacity-20 rounded-full blur-xl"></div>
            
            {/* Exit Button */}
            <button 
              type="button"
              onClick={onClose} 
              className="absolute right-3 top-3 z-30 text-teal-100 hover:text-white bg-teal-900 bg-opacity-40 p-2 rounded-full border border-teal-700 active:scale-90 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 space-y-0.5">
              <span className="text-xl font-black tracking-wide block">👸 பிஜி கலெக்ஷன்</span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-teal-300 block">BOUTIQUE & AARI NEEDLE STUDIO • சேலம்</span>
            </div>
          </div>

          {/* Core Title Section */}
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">உள்நுழைய அல்லது பதிவுசெய்ய</h3>
            <p className="text-xs sm:text-sm text-gray-500 font-bold leading-normal max-w-xs mx-auto">பாதுகாப்பான செக்அவுட் மற்றும் பில்லிங் விவரங்களை உள்ளிட்டு உடனடியாகத் தொடரவும்.</p>
          </div>

          {/* Validation Alert Displays */}
          {validationError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-center text-sm font-black animate-pulse">
              {validationError}
            </div>
          )}

          {/* 🛠️ UPGRADED WIDE & THICK INPUT BOXES FORM */}
          <form onSubmit={handleProfileLoginSubmit} id="wideBoxesMobileLoginForm" className="w-full space-y-5 text-gray-700 text-left">
            
            {/* Field 1: Customer Name */}
            <div className="space-y-2 w-full">
              <label className="block text-xs font-black text-gray-600 uppercase tracking-wide">
                1. உங்கள் முழு பெயர் (பில்லில் அச்சிட)
              </label>
              {/* 🚀 UPGRADED: Set explicit tall height (h-14) and wider inner alignment padding */}
              <div className="flex border-2 border-gray-300 rounded-xl bg-gray-50 overflow-hidden items-center focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent transition shadow-sm h-14 w-full">
                <span className="pl-4 text-gray-400 flex-shrink-0"><User className="w-5 h-5" /></span>
                <input 
                  type="text" 
                  required
                  placeholder="எ.கா., அனிதா ராஜ்"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value.replace(/[0-9]/g, '')})}
                  className="w-full h-full pl-3 pr-4 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Field 2: Mobile Number */}
            <div className="space-y-2 w-full">
              <label className="block text-xs font-black text-gray-600 uppercase tracking-wide">
                2. மொபைல் போன் எண் (உள்நுழைய)
              </label>
              {/* 🚀 UPGRADED: Expanded box framework height (h-14) to provide vertical headroom */}
              <div className="flex border-2 border-gray-300 rounded-xl bg-gray-50 overflow-hidden items-center focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent transition shadow-sm h-14 w-full">
                <div className="flex items-center justify-center gap-1.5 px-4 h-full bg-gray-100 border-r-2 border-gray-200 select-none flex-shrink-0">
                  <span className="text-xs font-black text-teal-800">IN</span>
                  <span className="text-sm font-black text-gray-650 font-mono">+91</span>
                </div>
                <input 
                  type="tel" 
                  maxLength={10}
                  inputMode="numeric"
                  required
                  placeholder="10-இலக்க மொபைல் எண்"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})}
                  className="w-full h-full pl-4 pr-4 bg-transparent outline-none text-sm font-black tracking-widest text-gray-950 font-mono placeholder-gray-400"
                />
              </div>
            </div>

            {/* Field 3: City / Pincode */}
            <div className="space-y-2 w-full">
              <label className="block text-xs font-black text-gray-600 uppercase tracking-wide">
                3. மாவட்டம் மற்றும் பின்கோடு
              </label>
              {/* 🚀 UPGRADED: Set explicit height (h-14) and wide bounds */}
              <div className="flex border-2 border-gray-300 rounded-xl bg-gray-50 overflow-hidden items-center focus-within:ring-2 focus-within:ring-teal-600 focus-within:border-transparent transition shadow-sm h-14 w-full">
                <span className="pl-4 text-gray-400 flex-shrink-0"><MapPin className="w-5 h-5" /></span>
                <input 
                  type="text" 
                  required
                  placeholder="எ.கா., சேலம் - 636001"
                  value={formData.cityPin}
                  onChange={(e) => setFormData({...formData, cityPin: e.target.value})}
                  className="w-full h-full pl-3 pr-4 bg-transparent outline-none text-sm font-bold text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

          </form>
        </div>

        {/* --- BOTTOM STICKY ACTION AREA FOOTER --- */}
        <div className="pt-4 bg-white w-full border-t border-dashed mt-auto">
          <button 
            type="submit"
            form="wideBoxesMobileLoginForm" 
            className="w-full py-4 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-xl transition shadow-md uppercase tracking-wide flex items-center justify-center gap-2 text-sm active:scale-95 transform shadow-teal-100"
          >
            <CheckCircle className="w-4.5 h-4.5" /> பாதுகாப்பாக சேமித்து தொடரவும்
          </button>

          <div className="flex justify-between items-center text-[10px] text-gray-400 font-black tracking-wide pt-3 px-1 select-none uppercase">
            <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-600" /> பாதுகாப்பான உள்நுழைவு</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> விபரங்கள் ரகசியம்</span>
          </div>
        </div>

      </div>
    </div>
  );
}

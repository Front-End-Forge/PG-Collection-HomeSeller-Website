import React, { useState } from 'react';
import { CheckCircle, MapPin, Smartphone, Phone, GraduationCap, Award } from 'lucide-react';

export default function AariClassPage() {
  const [includeCertificate, setIncludeCertificate] = useState(false);
  const [batchType, setBatchType] = useState('OFFLINE'); 

  // Interactive local math billing counters
  const baseCourseFee = 3000; 
  const certificateFee = includeCertificate ? 1000 : 0;
  const totalLedgerAmount = baseCourseFee + certificateFee;

  const handleBookAariClassWhatsApp = () => {
    const businessPhone = "917010006789"; // Active Salem helpline line
    const courseMessage = `வணக்கம் டீச்சர்! நான் உங்களுடைய ஆரி எம்பிராய்டரி வகுப்பில் சேர விரும்புகிறேன்.%0A%0A*வகுப்பு முறை:* ${batchType === 'OFFLINE' ? 'ஹோம் ஸ்டுடியோ (சேலம்)' : 'ஆன்லைன் லைவ் வகுப்பு'}%0A*சான்றிதழ்:* ${includeCertificate ? 'தேவை (+₹1,000)' : 'தேவையில்லை'}%0A%0A*மொத்த வகுப்பு கட்டணம்:* ₹${totalLedgerAmount}%0A%0Aதயவுசெய்து உங்கள் GPay விவரங்களை அனுப்பவும். நான் முன்பதிவுத் தொகை ₹500 செலுத்தி எனது இடத்தை உறுதி செய்கிறேன்!`;
    
    window.open(`https://wa.me/${businessPhone}?text=${courseMessage}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in text-left pb-12 select-none w-full">
      
      {/* 1. TOP BANNER: 2-COLUMN DASHBOARD MATRIX */}
      <div className="bg-gradient-to-br from-teal-800 via-teal-900 to-teal-950 rounded-[24px] p-6 sm:p-8 text-white shadow-md border border-teal-700 w-full relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
          
          {/* Left Side: Title and Subtitle */}
          <div className="space-y-4">
            <span className="bg-teal-950 bg-opacity-80 text-yellow-300 text-[10px] sm:text-xs font-black tracking-widest px-3 py-1 rounded-md border border-teal-800 uppercase inline-block">
              ⚡ அகாடமி சேர்க்கை நடக்கிறது
            </span>
            {/* 🚀 FIXED: Modified title string nomenclature structure to use native Tamil values */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
              ஆரி வகுப்பு பயிற்சி (Aari Class)
            </h2>
            <p className="text-teal-100 text-xs sm:text-sm font-semibold leading-relaxed opacity-95 max-w-md">
              ஒரு சிறந்த ஹோம் இன்ஸ்ட்ரக்டரிடம் இருந்து வாழ்நாள் முழுவதும் வருமானம் தரும் கலையை நேரடியாகக் கற்றுக்கொள்ளுங்கள். திருமண ஆடைகளுக்கான கனமான கழுத்து டிசைன்களை நீங்களே உருவாக்க பழகலாம்!
            </p>
            {/* Symmetrical Pricing Row Grid */}
            <div className="flex gap-8 pt-2 font-mono text-sm sm:text-base">
              <div className="space-y-1">
                <span className="text-[10px] text-teal-300 uppercase block font-black tracking-wider opacity-80">பயிற்சி காலம்</span>
                <span className="font-black text-white">30 நாட்கள் (ஆன்லைன் & ஆஃப்லைன்)</span>
              </div>
              <div className="w-px bg-teal-700 self-stretch opacity-40"></div>
              <div className="space-y-1">
                <span className="text-[10px] text-teal-300 uppercase block font-black tracking-wider opacity-80">பயிற்சி கட்டணம்</span>
                <span className="font-black text-yellow-300">₹3000 (நிலையானது)</span>
              </div>
            </div>

            {/* 🚀 FIXED: NEW HIGH-CONVERSION PRIMARY BANNER ACTION BOOKING BUTTON */}
            <div className="pt-4 select-none">
              <button 
                type="button"
                onClick={handleBookAariClassWhatsApp} // Binds directly to your automated WhatsApp Tamil registration logic string
                className="px-6 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-teal-950 font-black text-xs rounded-xl shadow-md transition-all transform hover:scale-105 active:scale-95 uppercase tracking-wider flex items-center justify-center gap-1.5"
              >
                <span>📲</span> இப்போதே பதிவு செய்ய (Book Now)
              </button>
            </div>
          </div>

          {/* Right Side: Limited Offer Badge Box */}
          <div className="md:ml-auto w-full max-w-sm">
            {/* 🌹 சிறப்பு அறிவிப்புப் பெட்டி (15 Students Welcome Update) */}
            <div className="bg-white text-gray-950 rounded-2xl p-4 sm:p-5 shadow-lg max-w-xs w-full border border-yellow-100 space-y-2 text-left">
              
              <div className="flex items-center gap-1.5 text-xs font-black text-teal-800 uppercase tracking-wide">
                <span>✨</span>
                <span>சிறப்பு அறிவிப்பு</span>
              </div>
              
              {/* 🚀 FIXED: Displays only the welcoming text for the first 15 students and removes "Studio/Academy" words */}
              <p className="text-xs sm:text-sm font-black text-gray-800 leading-relaxed">
                சேலம் பயிற்சி மையம் — தனிப்பட்ட முறையில் சிறந்த பயிற்சிகளை வழங்க, எங்களது வகுப்பில் <span className="text-teal-700 font-black">மாதத்திற்கு முதல் 15 மாணவர்களை மட்டுமே</span> அன்போடு வரவேற்கிறோம்!
              </p>

            </div>
          </div>

        </div>
        <div className="absolute -right-10 -bottom-10 text-9xl text-teal-900 opacity-20 pointer-events-none"><GraduationCap /></div>
      </div>

      {/* 2. SYLLABUS GRID & BATCH SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        
        {/* Left: Syllabus Matrix Checklist */}
        <div className="md:col-span-2 bg-white rounded-[24px] border border-gray-200 p-6 shadow-sm space-y-5">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider border-b pb-2">
            முழுமையான பாடத்திட்ட விவரங்கள்
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 flex items-start gap-3 transition hover:bg-teal-50">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-gray-700">அடிப்படை ஆரி ஊசி கையாளுதல் மற்றும் கோர் நூல் நுட்பங்கள்</span>
            </div>
            <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 flex items-start gap-3 transition hover:bg-teal-50">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-gray-700">மலர், மாம்பழம் மற்றும் தூய மயில் மோடிஃப் டிசைன் வடிவங்கள்</span>
            </div>
            <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 flex items-start gap-3 transition hover:bg-teal-50">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-gray-700">கழுத்துப்பகுதி டிரேசிங் மற்றும் கனமான பார்டர் டிசைன் வேலைகள்</span>
            </div>
            <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 flex items-start gap-3 transition hover:bg-teal-50">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-gray-700">திருமண பிளவுஸ் மற்றும் கஸ்டம் குர்தி எம்பிராய்டரி வேலைப்பாடு</span>
            </div>
            <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 flex items-start gap-3 transition hover:bg-teal-50">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-gray-700">பிரைடல் ஹெவி-ஒர்க் ஃபிரேமிங் மற்றும் சர்பேஸ் பினிஷிங் கலைகள்</span>
            </div>
            <div className="p-3.5 rounded-xl border border-teal-100 bg-teal-50/40 flex items-start gap-3 transition hover:bg-teal-50">
              <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span className="text-xs font-bold text-gray-700">பயிற்சி முடிவுக்கான அங்கீகரிக்கப்பட்ட அகாடமி சான்றிதழ்</span>
            </div>
          </div>
        </div>

        {/* Right: Batch Selector Cards */}
        <div className="bg-white rounded-[24px] border border-gray-200 p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider border-b pb-2">
            பயிற்சி வகுப்பு முறை
          </h3>
          <div className="space-y-4">
            {/* OFFLINE CARD */}
            <div 
              onClick={() => setBatchType('OFFLINE')} 
              className={`p-5 border-2 rounded-2xl text-left flex items-start gap-3.5 cursor-pointer transition-all duration-200 ${
                batchType === 'OFFLINE' ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-600/10 shadow-md' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
              }`}
            >
              <div className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                <MapPin className="w-5 h-5 text-teal-700" />
              </div>
              <div className="space-y-1">
                <span className="block text-sm font-black text-gray-900 leading-tight">🏡 ஹோம் ஸ்டுடியோ பேட்ச்</span>
                <span className="text-[11px] text-gray-500 font-bold block leading-snug">சேலம் ஸ்டுடியோ நேரடி முறை. தனிப்பட்ட கவனிப்புடன் கூடிய நேரடிப் பயிற்சி.</span>
              </div>
            </div>

            {/* ONLINE CARD */}
            <div 
              onClick={() => setBatchType('ONLINE')} 
              className={`p-5 border-2 rounded-2xl text-left flex items-start gap-3.5 cursor-pointer transition-all duration-200 ${
                batchType === 'ONLINE' ? 'border-teal-700 bg-teal-50 ring-2 ring-teal-600/10 shadow-md' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'
              }`}
            >
              <div className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center shadow-inner flex-shrink-0">
                <Smartphone className="w-5 h-5 text-teal-700" />
              </div>
              <div className="space-y-1">
                <span className="block text-sm font-black text-gray-900 leading-tight">💻 ஆன்லைன் லைவ் வகுப்பு</span>
                <span className="text-[11px] text-gray-500 font-bold block leading-snug">திட்டமிடப்பட்ட வீடியோ அழைப்புகள் மற்றும் வகுப்புப் பதிவுகளுக்கான அணுகல்.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. OPTIONAL CERTIFICATE ADD-ON BLOCK */}
      <div className="bg-white rounded-[24px] border border-gray-200 p-5 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2">
          <label className="flex items-start gap-3 bg-gray-50 hover:bg-gray-100/60 transition p-4 rounded-2xl border-2 border-gray-200 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeCertificate} 
              onChange={(e) => setIncludeCertificate(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-5 h-5 mt-1 cursor-pointer" 
            />
            <div className="space-y-1">
              <span className="text-sm font-black text-gray-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> அரசாங்க சான்றிதழ் சேர்க்கவும் (+ ₹1,000)
              </span>
              <span className="text-xs text-gray-500 font-bold leading-relaxed block">
                வகுப்பை வெற்றிகரமாக முடித்த பிறகு, பிஜி கலெக்ஷன் ஸ்டுடியோ மூலம் வழங்கப்படும் தொழில்முறை அங்கீகரிக்கப்பட்ட அகாடமி சான்றிதழைப் பெற்றிடுங்கள்.
              </span>
            </div>
          </label>
        </div>

        <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl space-y-4 shadow-inner">
          <div className="flex justify-between items-baseline font-black text-gray-800">
            <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">மொத்த கட்டணம்:</span>
            <span className="text-2xl font-black text-teal-950 tracking-tight">₹{totalLedgerAmount}</span>
          </div>
          
          <button 
            type="button"
            onClick={handleBookAariClassWhatsApp}
            className="w-full py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition transform active:scale-95 shadow-emerald-100"
          >
            {/* Official Vector SVG WhatsApp Icon Graphic Element */}
            <svg 
              className="w-5 h-5 fill-white flex-shrink-0" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.5-5.739-1.453L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.628 3.978 14.157 2.95 11.53 2.95c-5.437 0-9.86 4.37-9.864 9.8 0 1.662.457 3.285 1.32 4.715L1.928 21.1l3.72-.946zm11.531-5.495c-.272-.137-1.611-.795-1.86-.884-.248-.09-.43-.136-.61.137-.18.273-.7 1.137-.857 1.32-.158.18-.316.2-.587.064-1.12-.563-1.926-.974-2.696-2.298-.21-.362.21-.336.6-.12.115.064.24.137.363.2.148.077.227.12.338.225.112.106.112.182.056.294-.056.113-.508 1.25-.621 1.522-.113.272-.226.318-.497.182-.271-.136-1.144-.421-2.179-1.345-.805-.717-1.348-1.604-1.506-1.876-.159-.273-.017-.42.12-.556.122-.122.272-.318.408-.477.136-.16.18-.272.271-.454.09-.181.045-.341-.022-.478-.068-.136-.61-1.477-.836-2.023-.22-.53-.442-.457-.61-.466-.156-.008-.335-.01-.513-.01-.18 0-.472.067-.719.34-.248.274-.944.923-.944 2.25s.965 2.613 1.1 2.794c.134.182 1.9 2.901 4.601 4.07 1.488.644 2.378.784 3.197.662.618-.092 1.611-.659 1.838-1.267.227-.609.227-1.132.159-1.239-.068-.108-.25-.154-.523-.292z"/>
            </svg>
            <span className="pt-0.5">Book on WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Sparkles, Scissors, Upload, Ruler, Phone, CheckCircle, ZoomIn, ChevronDown } from 'lucide-react';
import { customGownPortfolio } from '../mockData';

export default function CustomGownPage() {
  const [filterType, setFilterType] = useState('ALL');
  const [zoomImg, setZoomImg] = useState(null);
  
  // --- FORM STATES ---
  const [apparelType, setApparelType] = useState('Long Frock / Anarkali Gown');
  const [embroideryType, setEmbroideryType] = useState('Neckline Aari Needle Work');
  const [measurementMode, setMeasurementMode] = useState('SEND_SAMPLE');
  const [selectedFile, setSelectedFile] = useState(null);

  // 🚀 NEW STATES: Tracks whether our custom dropdown dropdowns are open or closed
  const [isApparelOpen, setIsApparelOpen] = useState(false);
  const [isEmbroideryOpen, setIsEmbroideryOpen] = useState(false);

  // Translated mapping objects for high-visibility UI selection text strings
  const apparelLabels = {
    "Long Frock / Anarkali Gown": "லாங் பிராக் / அனார்கலி கவுன் (Long Frock / Gown)",
    "Kids Ethnic Wear Pattu Pavadai": "குழந்தைகளுக்கான பட்டு பாவாடை சட்டை (Kids Wear)",
    "Trendy Custom Styling Short Top": "ட்ரெண்டி கஸ்டம் டிசைன் ஷார்ட் டாப் (Short Top)"
  };

  const embroideryLabels = {
    "Neckline Aari Needle Work": "கழுத்து பகுதியில் மட்டும் ஆரி வேலைப்பாடு (Neckline Aari)",
    "Heavy Bridal Work (Neck + Sleeve)": "கனமான பிரைடல் வேலைப்பாடு - கழுத்து & கை (Heavy Work)",
    "Plain Stitching Without Embroidery": "ஆரி வேலைப்பாடு தேவையில்லை - சாதாரண தையல் (Plain)"
  };

  const filteredItems = filterType === 'ALL' 
    ? customGownPortfolio 
    : customGownPortfolio.filter(item => item.type === filterType);

  const handleWhatsAppOrderSubmit = () => {
    // 🚀 FIXED: Point directly to your active business phone number
    const businessPhone = "917010006789"; 

    // Mapping states to clear Tamil descriptions for the WhatsApp message packet
    const apparelNameTa = apparelLabels[apparelType] || apparelType;
    const embroideryNameTa = embroideryLabels[embroideryType] || embroideryType;
    const measurementModeTa = measurementMode === 'SEND_SAMPLE' 
      ? '📦 அளவு ஆடை கொரியர் மூலம் அனுப்பப்படும்' 
      : '📏 இன்ச் டேப் அளவுகள் வாட்ஸ்அப்பில் எழுதப்படும்';

    // 🚀 FIXED: Entire automated enquiry message translated to fluent Tamil parameters!
    const messageText = `வணக்கம் டீச்சர்! நான் ஒரு டிசைனர் கவுன் தையல் முன்பதிவு செய்ய விரும்புகிறேன்.%0A%0A*1. ஆடை வகை:* ${apparelNameTa}%0A*2. எம்பிராய்டரி வகை:* ${embroideryNameTa}%0A*3. அளவு முறை:* ${measurementModeTa}%0A%0Aஎனது கஸ்டம் குறிப்பு டிசைனை இத்துடன் இணைத்துள்ளேன். தயவுசெய்து எனது ஆர்டரை சரிபார்த்து முன்பதிவு நேரத்தை உறுதிப்படுத்தவும். நன்றி!`;
    
    // Launches WhatsApp natively on mobile or web browsers
    window.open(`https://wa.me/${businessPhone}?text=${messageText}`, '_blank');
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      
      {/* --- 👑 HIGH-VISIBILITY PORTFOLIO GALLERY MODULE (LARGE FONTS FOR 35+ USERS) --- */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-6 shadow-md space-y-6 text-left select-none my-6 w-full">
        
        {/* Gallery Header Top Bar with Increased Sizing */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl filter drop-shadow-sm">✨</span>
            {/* Increased heading text from text-base to text-lg font-black */}
            <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">
              பொட்டிக் டிசைன் போர்ட்ஃபோலியோ
            </h3>
          </div>

          {/* Filter Buttons Right Side (Enlarged padding and text sizes) */}
          <div className="flex flex-wrap gap-2.5 text-xs font-black uppercase tracking-wide">
            <button 
              onClick={() => setFilterType('ALL')}
              className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
                filterType === 'ALL' 
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md scale-102' 
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              அனைத்தும்
            </button>
            <button 
              onClick={() => setFilterType('SIMPLE')}
              className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
                filterType === 'SIMPLE' 
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md scale-102' 
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              சாதாரண தையல்
            </button>
            <button 
              onClick={() => setFilterType('AARI_FUSED')}
              className={`px-4 py-2.5 rounded-xl border-2 transition-all ${
                filterType === 'AARI_FUSED' 
                  ? 'bg-teal-700 text-white border-teal-700 shadow-md scale-102' 
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              ஆரி வேலைப்பாடு கவுன்கள்
            </button>
          </div>
        </div>

        {/* GALLERY CARDS GRID LOOP (Enlarged Card Contents) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border-2 border-gray-100 p-4 flex flex-col justify-between hover:shadow-lg hover:border-teal-200 transition duration-200">
              
              {/* Large Stage Image Box */}
              <div className="aspect-square bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-5xl shadow-inner relative overflow-hidden">
                <span>{item.type === 'SIMPLE' ? '👗' : '👸'}</span>
              </div>
              
              {/* Wording Content Info Block (Enlarged with increased line-height spacing) */}
              <div className="mt-4 space-y-1.5 flex-1 flex flex-col justify-end">
                {/* Item title shifted to strong text-sm font-black */}
                <h4 className="text-xs sm:text-sm font-black text-gray-900 leading-snug capitalize tracking-tight">
                  {item.title}
                </h4>
                {/* Subtitle description wording shifted from text-[10px] to text-xs */}
                <p className="text-[11px] sm:text-xs font-bold text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* --- 👑 UPGRADED HIGH-ENGAGEMENT VISUAL WORKFLOW BANNER CONTAINER --- */}
      <div className="max-w-7xl mx-auto bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6 text-left select-none my-8">
        
        {/* Section Header Title with Larger Sizing */}
        <span className="block text-xs sm:text-sm font-black text-gray-400 uppercase tracking-wider border-b pb-2">
          ⚙️ கஸ்டம் ஆன்லைன் தையல் வேலை செய்யும் முறை
        </span>

        {/* 🚀 UPGRADED: 3-Column Symmetrical Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {/* படி 1: ஆடை வகையை தேர்வு செய்தல் */}
          <div className="flex flex-col items-center justify-start text-center p-4 space-y-4 w-full group">
            {/* Visual Image/Emoji Stage Box */}
            <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              <span className="filter drop-shadow-md">👗</span>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-teal-700 text-white rounded-full flex items-center justify-center font-black text-[11px] shadow-md">
                1
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-black text-gray-950 tracking-tight leading-tight">
                ஆடை வகையை தேர்வு செய்யவும்
              </h4>
              {/* Increased text size from text-[11px] to text-xs/text-sm for readability */}
              <p className="text-xs sm:text-sm font-bold text-gray-500 leading-relaxed max-w-xs">
                உங்களுக்கு பிடித்த கவுன் மாடலை தேர்ந்தெடுக்கவும் அல்லது பின்டெரெஸ்ட் (Pinterest) செயலியில் இருந்து மாதிரிகளை பதிவேற்றவும்.
              </p>
            </div>
          </div>

          {/* படி 2: துணியை அனுப்புதல் (சேலம் ஸ்டுடியோ) */}
          <div className="flex flex-col items-center justify-start text-center p-4 space-y-4 w-full pt-6 md:pt-4 md:pl-6 group">
            <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              <span className="filter drop-shadow-md">📦</span>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-teal-700 text-white rounded-full flex items-center justify-center font-black text-[11px] shadow-md">
                2
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-black text-gray-950 tracking-tight leading-tight">
                ஆடைக்கான துணியை அனுப்பவும்
              </h4>
              <p className="text-xs sm:text-sm font-bold text-gray-500 leading-relaxed max-w-xs">
                உங்களது துணி மெட்டீரியலை எங்களது சேலம் ஸ்டுடியோவிற்கு கொரியர் மூலம் அனுப்பலாம் அல்லது நேரில் வந்து ஒப்படைக்கலாம்.
              </p>
            </div>
          </div>

          {/* படி 3: தையல் மற்றும் டெலிவரி */}
          <div className="flex flex-col items-center justify-start text-center p-4 space-y-4 w-full pt-6 md:pt-4 md:pl-6 group">
            <div className="w-20 h-20 bg-teal-50 border border-teal-100 rounded-2xl flex items-center justify-center text-4xl shadow-inner relative group-hover:scale-105 transition-transform duration-300">
              <span className="filter drop-shadow-md">🚚</span>
              <div className="absolute -top-2.5 -right-2.5 w-6 h-6 bg-teal-700 text-white rounded-full flex items-center justify-center font-black text-[11px] shadow-md">
                3
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm sm:text-base font-black text-gray-950 tracking-tight leading-tight">
                தைக்கப்பட்டு டெலிவரி செய்யப்படும்
              </h4>
              <p className="text-xs sm:text-sm font-bold text-gray-500 leading-relaxed max-w-xs">
                உங்களது கச்சிதமான உடல் அளவிற்கு ஏற்ப ஆடைகளை நேர்த்தியாக தைத்து, உங்கள் வீட்டிற்கே பாதுகாப்பாக கொரியர் மூலம் அனுப்பி வைப்போம்!
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* --- 👑 உன்னதமான பிரீமியம் தையல் முன்பதிவு படிவம் (LUXURY FORM UPGRADE) --- */}
      <div className="max-w-xl mx-auto bg-white rounded-[24px] border border-gray-150 p-6 sm:p-8 shadow-md space-y-7 text-left select-none my-6">
        
        {/* Elegant Header Title with Subtle Underline Accent */}
        <div className="border-b border-gray-100 pb-4 relative">
          <div className="flex items-center gap-2.5">
            <span className="text-xl filter drop-shadow-sm">🪡</span>
            <h3 className="text-base sm:text-lg font-black text-gray-900 uppercase tracking-tight">
              தையல் முன்பதிவு படிவம் <span className="text-teal-700 font-medium text-xs font-sans tracking-wide lowercase"> (stitching form)</span>
            </h3>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-0.5 bg-teal-600 rounded-full"></div>
        </div>

        {/* FIELD 1: CUSTOM APPAREL TYPE WITH NEW HIGH-VISIBILITY TOGGLE */}
        <div className="space-y-2 relative">
          <label className="block text-xs font-black text-gray-950 uppercase tracking-wider">
            1. ஆடை வகையை தேர்வு செய்யவும் (Choose Apparel Type)
          </label>
          
          {/* The Master Toggle Button Bar */}
          <div 
            onClick={() => { setIsApparelOpen(!isApparelOpen); setIsEmbroideryOpen(false); }}
            className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-gray-800 flex justify-between items-center cursor-pointer shadow-sm active:bg-gray-100 transition"
          >
            <span className="leading-relaxed">{apparelLabels[apparelType]}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isApparelOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* 🚀 FIXED FOR MOBILE: Expanded Custom List Overlay Box (No layout compression!) */}
          {isApparelOpen && (
            <div className="absolute left-0 right-0 z-30 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden divide-y divide-gray-100 animate-fade-in">
              {Object.keys(apparelLabels).map((key) => (
                <div
                  key={key}
                  onClick={() => { setApparelType(key); setIsApparelOpen(false); }}
                  className={`p-3.5 text-xs sm:text-sm font-bold leading-relaxed cursor-pointer transition-colors ${
                    apparelType === key ? 'bg-teal-50 text-teal-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {apparelLabels[key]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FIELD 2: EMBROIDERY SURCHARGE OPTION WITH NEW HIGH-VISIBILITY TOGGLE */}
        <div className="space-y-2 relative">
          <label className="block text-xs font-black text-gray-950 uppercase tracking-wider">
            2. ஆரி எம்பிராய்டரி வேலைப்பாடு விவரம் (Embroidery Option)
          </label>
          
          {/* The Master Toggle Button Bar */}
          <div 
            onClick={() => { setIsEmbroideryOpen(!isEmbroideryOpen); setIsApparelOpen(false); }}
            className="w-full p-3.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm font-bold text-gray-800 flex justify-between items-center cursor-pointer shadow-sm active:bg-gray-100 transition"
          >
            <span className="leading-relaxed">{embroideryLabels[embroideryType]}</span>
            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isEmbroideryOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* 🚀 FIXED FOR MOBILE: Expanded Custom List Overlay Box */}
          {isEmbroideryOpen && (
            <div className="absolute left-0 right-0 z-30 mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden divide-y divide-gray-100 animate-fade-in">
              {Object.keys(embroideryLabels).map((key) => (
                <div
                  key={key}
                  onClick={() => { setEmbroideryType(key); setIsEmbroideryOpen(false); }}
                  className={`p-3.5 text-xs sm:text-sm font-bold leading-relaxed cursor-pointer transition-colors ${
                    embroideryType === key ? 'bg-teal-50 text-teal-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {embroideryLabels[key]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FIELD 3: UPLOAD REFERENCE DESIGN PICTURE */}
        <div className="space-y-2">
          <label className="block text-xs font-black text-gray-900 uppercase tracking-wider">
            3. மாதிரிக்கான டிசைன் புகைப்படத்தை பதிவேற்றவும் (Upload Design)
          </label>
          {/* Premium Soft Ivory Box Design */}
          <div className="border-2 border-dashed border-gray-200 hover:border-teal-400 rounded-2xl p-6 bg-gray-50 hover:bg-teal-50/30 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer relative min-h-[120px] shadow-sm group">
            <div className="w-10 h-10 bg-white border border-gray-100 shadow-sm rounded-xl flex items-center justify-center text-lg mb-2 group-hover:scale-105 transition-transform">
              📤
            </div>
            <span className="text-xs sm:text-sm font-black text-gray-800 leading-snug">
              {selectedFile ? `Selected: ${selectedFile}` : 'டிசைன் ஸ்கிரீன்ஷாட் புகைப்படத்தை இணைக்க இங்கே கிளிக் செய்யவும்'}
            </span>
            <span className="text-[11px] text-gray-400 block mt-1 font-semibold">
              கேமரா அல்லது போன் கேலரி மூலம் தேர்ந்தெடுக்கலாம்
            </span>
            <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0]?.name)} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* FIELD 4: SIZE MEASUREMENT SUBMISSION MODE */}
        <div className="space-y-3">
          <label className="block text-xs font-black text-gray-900 uppercase tracking-wider">
            4. அளவு ஆடை சமர்ப்பிக்கும் முறை (Size Measurement Mode)
          </label>
          
          <div className="grid grid-cols-1 gap-3">
            {/* Option A: Send sample dress */}
            <label className={`p-4 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
              measurementMode === 'SEND_SAMPLE' 
                ? 'border-teal-600 bg-teal-50 bg-opacity-40 shadow-sm' 
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
            }`}>
              <div className="flex items-start gap-3.5 flex-1 pr-2">
                <div className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-lg shadow-inner flex-shrink-0">📦</div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed pt-0.5">
                  உங்களுக்கு கச்சிதமாக பொருந்தும் பழைய அளவு ஆடை ஒன்றை என்னிடம் கொரியர் மூலம் அனுப்புவேன்
                </span>
              </div>
              <input type="radio" checked={measurementMode === 'SEND_SAMPLE'} onChange={() => setMeasurementMode('SEND_SAMPLE')} className="text-teal-700 focus:ring-teal-600 w-4 h-4 cursor-pointer flex-shrink-0" />
            </label>

            {/* Option B: Manual tape metrics */}
            <label className={`p-4 border-2 rounded-2xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
              measurementMode === 'MANUAL_TAPE' 
                ? 'border-teal-600 bg-teal-50 bg-opacity-40 shadow-sm' 
                : 'border-gray-200 bg-gray-50 hover:bg-gray-100/50'
            }`}>
              <div className="flex items-start gap-3.5 flex-1 pr-2">
                <div className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-lg shadow-inner flex-shrink-0">📏</div>
                <span className="text-xs sm:text-sm font-bold text-gray-800 leading-relaxed pt-0.5">
                  இன்ச் டேப் (Tape Metric) மூலம் எடுக்கப்பட்ட எனது உடல் அளவுகளை நானே வாட்ஸ்அப்பில் எழுதி அனுப்புவேன்
                </span>
              </div>
              <input type="radio" checked={measurementMode === 'MANUAL_TAPE'} onChange={() => setMeasurementMode('MANUAL_TAPE')} className="text-teal-700 focus:ring-teal-600 w-4 h-4 cursor-pointer flex-shrink-0" />
            </label>
          </div>
        </div>

        {/* BOOKING POLICY NOTICE BOX (Refined Colors) */}
        <div className="bg-amber-50 bg-opacity-70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 font-semibold leading-relaxed shadow-inner">
          💡 **முன்பதிவு கொள்கை விவரம் (Booking Policy):** உங்கள் தையல் நேரத்தை (Tailoring Time Slot) உறுதிப்படுத்திக் கொள்ள **₹200 முன்பதிவு கட்டணம் (Advance Reservation Fee)** வாட்ஸ்அப்பில் இன்வாய்ஸ் சரிபார்ப்பின் போது செலுத்த வேண்டும். இந்தத் தொகை உங்கள் இறுதி பில்லில் கழித்துக் கொள்ளப்படும்.
        </div>

        {/* PRIMARY SUBMIT WHATSAPP ACTION BUTTON */}
        <button 
          type="button"
          onClick={handleWhatsAppOrderSubmit}
          className="w-full py-3.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-black text-sm uppercase tracking-wider rounded-xl shadow-md transition transform active:scale-98 hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          💬 தையல் ஆர்டர் விபரம் கேட்க (Enquire Custom Work via WhatsApp)
        </button>

      </div>

      {/* --- ZOOM MODAL CONTROLLER OVERLAY --- */}
      {zoomImg && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setZoomImg(null)}
        >
          <div 
            className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-4 shadow-2xl relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-6xl p-4 bg-teal-50 rounded-xl w-24 h-24 flex items-center justify-center mx-auto border border-teal-100">
              {zoomImg.img}
            </div>
            <div>
              <h4 className="text-sm font-black text-gray-900">{zoomImg.title}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{zoomImg.desc}</p>
            </div>
            <button 
              onClick={() => setZoomImg(null)} 
              className="mt-2 w-full py-2 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 rounded-xl transition"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// frontend/src/components/Footer.jsx
import React from 'react';
import { Phone, MapPin, ShieldCheck, Truck, Award } from 'lucide-react';

export default function Footer({ setCurrentTab }) {
  return (
    <footer className="bg-gray-950 text-gray-400 mt-16 border-t border-gray-800 antialiased text-left w-full select-none">
      
      {/* 1. TOP TRUST BADGES SECTION (PERFECTLY SYMMETRICAL RE-GRID) */}
      <div className="max-w-7xl mx-auto px-6 py-12 border-b border-gray-800 grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-8">
        
        {/* Badge 1 */}
        <div className="flex items-start gap-4 p-2 w-full">
          <ShieldCheck className="w-10 h-10 text-teal-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <h4 className="text-white text-sm font-black tracking-wide leading-snug">
              100% பாதுகாப்பான பணம் செலுத்துதல்
            </h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed tracking-wide">
              GPay அல்லது PhonePe போன்ற எந்தவொரு UPI செயலி மூலமும் மிக எளிதாகவும் பாதுகாப்பாகவும் பணம் செலுத்தலாம்.
            </p>
          </div>
        </div>

        {/* Badge 2 */}
        <div className="flex items-start gap-4 p-2 w-full lg:px-4">
          <Truck className="w-10 h-10 text-teal-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <h4 className="text-white text-sm font-black tracking-wide leading-snug">
              நேரில் வந்து பெற்றுக்கொள்ளலாம்
            </h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed tracking-wide">
              சேலம் நகருக்குள் வசிக்கிறீர்களா? ஆடைகளை எங்களது ஹோம் ஸ்டுடியோவில் நேரில் வந்து பெற்றுக்கொண்டு டெலிவரி கட்டணத்தை மிச்சப்படுத்துங்கள்.
            </p>
          </div>
        </div>

        {/* Badge 3 */}
        <div className="flex items-start gap-4 p-2 w-full">
          <Award className="w-10 h-10 text-teal-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <h4 className="text-white text-sm font-black tracking-wide leading-snug">
              கைதேர்ந்த தையல் வேலைப்பாடு
            </h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed tracking-wide">
              உடல் அளவுக்கு கச்சிதமான கஸ்டம் லாங் பிராக் தையல் மற்றும் முழுமையான சான்றளிக்கப்பட்ட ஆரி எம்பிராய்டரி பயிற்சிகள் வழங்கப்படும்.
            </p>
          </div>
        </div>

      </div>

      {/* 2. BOTTOM DETAILS SECTION (MATCHED EXACT COUPLING GRID ALIGNMENT) */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10 text-sm">
        
        {/* Column 1: Company Profile */}
        <div className="space-y-4 w-full">
          <h4 className="text-white font-black text-sm uppercase tracking-wider border-l-2 border-teal-500 pl-2">
            👸 பிஜி கலெக்ஷன் (PG Collection)
          </h4>
          <p className="text-xs leading-relaxed text-gray-500 font-semibold tracking-wide">
            சேலத்தில் அமைந்துள்ள எங்களது ஹோம் ஸ்டுடியோவில் பிரத்தியேகமான சிங்கிள்-பீஸ் ஆடைகள், டிசைனர் லாங் பிராக்குகள் தையல் மற்றும் தொழில்முறை ஆரி எம்பிராய்டரி பயிற்சிகளை சிறந்த முறையில் வழங்குகிறோம்.
          </p>
        </div>

        {/* Column 2: Quick Links (Centered Placement Framework) */}
        <div className="space-y-4 w-full lg:px-4">
          <h4 className="text-white font-black text-xs uppercase tracking-wider border-l-2 border-teal-500 pl-2">
            விரைவு இணைப்புகள்
          </h4>
          <ul className="space-y-3.5 text-xs font-bold text-gray-500">
            <li>
              <button onClick={() => { setCurrentTab('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-teal-400 transition-colors">
                ரெடிமேட் ஆடைகள் ஸ்டோர்
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentTab('stitching'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-teal-400 transition-colors">
                கஸ்டம் கவுன் ஆர்டர்கள்
              </button>
            </li>
            <li>
              <button onClick={() => { setCurrentTab('classes'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="hover:text-teal-400 transition-colors">
                ஆரி எம்பிராய்டரி வகுப்புகள்
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact Info */}
        <div className="space-y-4 w-full">
          <h4 className="text-white font-black text-xs uppercase tracking-wider border-l-2 border-teal-500 pl-2">
            எங்களைத் தொடர்பு கொள்ள
          </h4>
          <ul className="space-y-3.5 text-xs font-bold text-gray-500">
            
            {/* Studio Location Anchor */}
            <li className="flex items-start gap-2.5">
              <span className="text-teal-500 flex-shrink-0 mt-0.5">📍</span>
              <span className="text-gray-500 leading-snug">
                ஹோம் ஸ்டுடியோ, சேலம், தமிழ்நாடு, இந்தியா
              </span>
            </li>
            
            {/* 🚀 SINGLE UNIFORM PHONE NUMBER FOR CALLS & WHATSAPP ROW */}
            <li className="flex items-center gap-2.5">
              <span className="text-teal-500 flex-shrink-0">📞</span>
              <a href="tel:+917010006789" className="hover:text-white transition font-mono tracking-wide text-gray-400">
                +91 70100 06789
              </a>
            </li>

          </ul>
        </div>

      </div>

      {/* 3. COPYRIGHT LINE */}
      <div className="bg-gray-900 py-4 border-t border-gray-800 text-center text-[11px] font-bold text-gray-600 tracking-wide">
        &copy; {new Date().getFullYear()} பிஜி கலெக்ஷன் பொட்டிக். அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.
      </div>

    </footer>
  );
}

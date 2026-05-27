// frontend/src/components/ShoppingCart.jsx
import React, { useState, useEffect } from 'react';
import { Clock, Trash2, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function ShoppingCart({ cartItems, onRemoveItem, clearCart }) {
  // --- STATE FOR 10-MINUTE TIMER LOCK SYSTEM ---
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [activeStep, setActiveStep] = useState('cart'); // cart -> checkout -> success
  const [checkoutStep, setCheckoutStep] = useState(1); // Accordion steps: 1, 2, 3
  
  // --- FORM STATES ---
  const [address, setAddress] = useState({ name: '', phone: '', pin: '', street: '', city: '' });
  const [isSelfPickup, setIsSelfPickup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI');

  // --- TIMER INTERACTION EFFECT ---
  useEffect(() => {
    if (cartItems.length === 0) return;
    if (timeLeft <= 0) {
      alert("⏱️ Your 10-minute reservation has expired! The items have been returned to shop stock.");
      clearCart();
      setActiveStep('cart');
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, cartItems, clearCart]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- BILLING LOGIC CONSTRAINTS ---
  const itemTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const deliveryFee = isSelfPickup || itemTotal >= 600 || itemTotal === 0 ? 0 : 50;
  const codFee = paymentMethod === 'COD' ? 30 : 0;
  const grandTotal = itemTotal + deliveryFee + codFee;

  // --- GENERATING THE WHATSAPP INVOICE STRING ---
  const handleCompleteOrderWhatsApp = () => {
    const orderId = Math.floor(1000 + Math.random() * 9000);
    const businessPhone = "917010006789"; // Direct target to her verified Salem line

    // Generate the formatted item lines string natively
    const itemsText = cartItems.length > 0 
      ? cartItems.map(item => `- ${item.title} (அளவு: ${item.size})`).join('%0A')
      : "- கஸ்டம் பொட்டிக் ஆடை";
    
    // Format the delivery method description cleanly in Tamil text
    const addressText = isSelfPickup 
      ? "🏪 வாடிக்கையாளர் சேலம் ஸ்டுடியோவிற்கு நேரில் வந்து பெற்றுக்கொள்வார்" 
      : `%0A   பெயர்: ${address.name}%0A   போன்: ${address.phone}%0A   முகவரி: ${address.street}, ${address.city} - ${address.pin}`;
    
    // Compile the finalized Tamil order text invoice data packet payload
    const tamilOrderMessage = `வணக்கம்! நான் உங்கள் இணையதளத்தில் புதிய ஆர்டர் செய்துள்ளேன்.%0A%0A*ஆர்டர் எண்:* %23${orderId}%0A%0A*ஆடை விவரங்கள்:*%0A${itemsText}%0A%0A*டெலிவரி விபரம்:* ${addressText}%0A%0A*பணம் செலுத்தும் முறை:* ${paymentMethod === 'UPI' ? 'Instant UPI (GPay/PhonePe)' : 'Cash on Delivery (COD)'}%0A*மொத்தத் தொகை:* ₹${grandTotal}%0A%0Aதயவுசெய்து எனது ஆடைகளை பேக் செய்து அனுப்பவும். நன்றி!`;
    
    // Launch the WhatsApp application interface instantly without checking backend server streams
    window.open(`https://wa.me/${businessPhone}?text=${tamilOrderMessage}`, '_blank');
    clearCart();
  };

  // --- RENDER SCREEN OPTION C: ORDER SUCCESS SCREEN ---
  if (activeStep === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-xl space-y-6 mt-6">
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100 animate-bounce">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">Payment Initiated Successfully!</h3>
          <p className="text-xs text-gray-400 mt-1">To finalize your single-piece secure booking, send your order invoice metadata straight to the seller's phone on WhatsApp now.</p>
        </div>
        <button 
          onClick={handleCompleteOrderWhatsApp}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm flex items-center justify-center gap-2 transition shadow-md hover:scale-[1.02]"
        >
          📲 Send Order Details to Seller via WhatsApp
        </button>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl border p-12 text-center shadow-sm mt-6">
        <span className="text-5xl">🛒</span>
        <h3 className="text-base font-black text-gray-800 mt-3">Your Cart is Empty</h3>
        <p className="text-xs text-gray-400 mt-1">Unique single-piece styles sell out fast. Return to the shop to find your perfect fit before it's gone!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pb-12">
      
      {/* LEFT COLUMN PANEL: TOGGLES BETWEEN STANDARD VIEW AND ACCORDION CHECKOUT */}
      <div className="md:col-span-2 space-y-4">
        
        {/* TIMER BAR CONTROLLER ACCENT */}
        <div className="bg-orange-50 border border-orange-100 p-3 rounded-xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2 text-orange-800 text-xs font-bold">
            <Clock className="w-4 h-4 text-orange-600 animate-pulse" />
            <span>இந்த தனித்துவமான சிங்கிள்-பீஸ் ஆடை உங்களுக்காக ஒதுக்கப்பட்டுள்ளது:</span>
          </div>
          <span className="bg-orange-600 text-white font-mono font-black px-2.5 py-0.5 rounded text-xs">
            {formatTime(timeLeft)}
          </span>
        </div>

        {activeStep === 'cart' ? (
          /* --- STEP 2: STANDARD SHOPPING CART VIEW --- */
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider border-b pb-2">My Selected Dress Pieces</h3>
            <div className="divide-y divide-gray-100">
              {cartItems.map(item => (
                <div key={item.id} className="py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center text-2xl">👗</div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900">{item.title}</h4>
                      <p className="text-xs text-teal-700 mt-0.5 font-bold">Size: {item.size} | Qty: 1 (Fixed)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-gray-900">₹{item.price}</span>
                    <button 
                      onClick={() => onRemoveItem(item.id)} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-gray-200 transition"
                      title="Remove from Cart"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* --- STEP 3: DEDICATED 3-STEP SINGLE PAGE ACCORDION CHECKOUT PANEL --- */
          <div className="space-y-3">
            
            {/* ACCORDION STEP 1: DELIVERY ADDRESS CONFIGURATION */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div 
                onClick={() => setCheckoutStep(1)} 
                className="bg-gray-50 p-4 font-black text-xs text-gray-700 uppercase tracking-wider flex justify-between cursor-pointer items-center"
              >
                <span>📍 படி 1: டெலிவரி முகவரி விவரங்கள்</span>
                {checkoutStep !== 1 && <span className="text-teal-700 hover:underline text-[10px]">Edit</span>}
              </div>
              {checkoutStep === 1 && (
                <div className="p-4 space-y-3 border-t">
                  {/* Home seller neighborhood shortcut toggle button */}
                  <label className="flex items-center gap-2 bg-teal-50 p-3 rounded-lg border border-teal-100 text-xs font-bold text-teal-800 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isSelfPickup} 
                      onChange={(e) => setIsSelfPickup(e.target.checked)} 
                      className="rounded text-teal-600 focus:ring-teal-500 cursor-pointer" 
                    />
                    <span>🏡 சேலம் ஸ்டுடியோவிற்கு நேரில் வந்து பெற்றுக்கொள்கிறேன் (டெலிவரி கட்டணம் இலவசம்)</span>
                  </label>
                  
                  {!isSelfPickup && (
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={address.name} 
                        onChange={e=>setAddress({...address, name:e.target.value})} 
                        className="col-span-2 p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50" 
                      />
                      <input 
                        type="tel" 
                        placeholder="10-Digit Mobile Number" 
                        value={address.phone} 
                        onChange={e=>setAddress({...address, phone:e.target.value})} 
                        className="p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50" 
                      />
                      <input 
                        type="number" 
                        placeholder="Pincode" 
                        value={address.pin} 
                        onChange={e=>setAddress({...address, pin:e.target.value})} 
                        className="p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50" 
                      />
                      <input 
                        type="text" 
                        placeholder="Street Address / House No." 
                        value={address.street} 
                        onChange={e=>setAddress({...address, street:e.target.value})} 
                        className="col-span-2 p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50" 
                      />
                      <input 
                        type="text" 
                        placeholder="City" 
                        value={address.city} 
                        onChange={e=>setAddress({...address, city:e.target.value})} 
                        className="p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none bg-gray-50" 
                      />
                    </div>
                  )}
                  <button 
                    onClick={() => setCheckoutStep(2)} 
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg mt-2 transition"
                  >
                    Next Step
                  </button>
                </div>
              )}
            </div>

            {/* ACCORDION STEP 2: SUMMARY INVENTORY VERIFICATION */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div 
                onClick={() => setCheckoutStep(2)} 
                className="bg-gray-50 p-4 font-black text-xs text-gray-700 uppercase tracking-wider flex justify-between cursor-pointer items-center"
              >
                <span>📋 படி 2: ஆர்டர் சரிபார்ப்புப் பட்டியல்</span>
                {checkoutStep !== 2 && <span className="text-teal-700 hover:underline text-[10px]">View</span>}
              </div>
              {checkoutStep === 2 && (
                <div className="p-4 border-t space-y-3">
                  <div className="divide-y divide-gray-50">
                    {cartItems.map(item => (
                      <div key={item.id} className="py-2 flex justify-between text-xs text-gray-600">
                        <span className="font-medium">{item.title} ({item.size})</span>
                        <span className="font-bold text-gray-900">₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCheckoutStep(3)} 
                    className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg mt-3 transition"
                  >
                    உறுதி செய்து கட்டணம் செலுத்தச் செல்லவும்
                  </button>
                </div>
              )}
            </div>

            {/* ACCORDION STEP 3: INDIA-FIRST UPI SELECTION TAB */}
            <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
              <div 
                onClick={() => setCheckoutStep(3)} 
                className="bg-gray-50 p-4 font-black text-xs text-gray-700 uppercase tracking-wider flex justify-between cursor-pointer items-center"
              >
                <span>💳 படி 3: கட்டண இடைமுக முறை</span>
              </div>
              {checkoutStep === 3 && (
                <div className="p-4 border-t space-y-3">
                  <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition ${paymentMethod === 'UPI' ? 'border-teal-600 bg-teal-50 text-teal-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                    <span className="text-xs font-bold">Instant UPI Deep Linking (Free)</span>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'UPI'} 
                      onChange={()=>setPaymentMethod('UPI')} 
                      className="text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                  </label>
                  <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition ${paymentMethod === 'COD' ? 'border-teal-600 bg-teal-50 text-teal-900' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}>
                    <span className="text-xs font-bold">Cash on Delivery (+₹30 extra fee)</span>
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'COD'} 
                      onChange={()=>setPaymentMethod('COD')} 
                      className="text-teal-600 focus:ring-teal-500 cursor-pointer"
                    />
                  </label>
                  <button 
                    onClick={() => setActiveStep('success')} 
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-black rounded-xl text-xs uppercase tracking-wide transition shadow-sm animate-pulse"
                  >
                    Place Order & Pay ₹{grandTotal}
                  </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* RIGHT COLUMN PANEL: PRICE DETAILS & INCENTIVE METRICS COUPLING */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit space-y-4">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider border-b pb-2">விலை விவரப் பட்டியல்</h3>
        
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>ஆடைகளின் மொத்த மதிப்பு</span>
            <span className="font-bold text-gray-800">₹{itemTotal}</span>
          </div>
          
          <div className="flex justify-between text-gray-600">
            <span>கொரியர் & டெலிவரி கட்டணம்</span>
            <span className="font-bold text-gray-800">
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
            </span>
          </div>

          {paymentMethod === 'COD' && (
            <div className="flex justify-between text-orange-600 font-semibold bg-orange-50 p-2 rounded-lg border border-orange-100">
              <span>COD Surcharge</span>
              <span>+₹30</span>
            </div>
          )}

          {/* Delivery incentive tracking bar progression */}
          {itemTotal < 600 && !isSelfPickup && (
            <div className="bg-teal-50 border border-teal-100 p-3 rounded-lg text-[10px] text-teal-800 font-bold leading-relaxed">
              💡 Progress Tracker: Add just <span className="underline">₹{600 - itemTotal}</span> more worth of unique dresses to unlock absolute FREE Shipping!
            </div>
          )}

          <div className="border-t pt-3 flex justify-between text-sm font-black text-gray-900">
            <span>மொத்த தொகை (Grand Total)</span>
            <span className="text-base text-teal-800">₹{grandTotal}</span>
          </div>
        </div>

        {activeStep === 'cart' && (
          <button
            onClick={() => setActiveStep('checkout')}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
          >
            <span>Proceed To Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </div>
  );
}

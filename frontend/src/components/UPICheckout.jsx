// frontend/src/components/UPICheckout.jsx
import React, { useState } from 'react';
import { ShieldCheck, Smartphone, CheckCircle, Copy } from 'lucide-react';

export default function UPICheckout({ amount, orderType, onPaymentSuccess, onClose }) {
  const [copied, setCopied] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // 1. Enter the home-seller's real business UPI ID here
  const SELLER_UPI_ID = "example@okaxis"; 
  const SELLER_NAME = "Boutique Owner";

  // 2. Generate standard Indian UPI Deep Link for mobile apps
  const upiUrl = `upi://pay?pa=${SELLER_UPI_ID}&pn=${encodeURIComponent(SELLER_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent("Payment for " + orderType)}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(SELLER_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl p-6 shadow-2xl border text-center space-y-4 animate-fade-in">
        
        {/* Header Summary */}
        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mx-auto border border-teal-100">
          <ShieldCheck className="w-6 h-6 text-teal-700" />
        </div>
        <div>
          <h3 className="text-base font-black text-gray-900">Secure UPI Payment</h3>
          <p className="text-xs text-gray-400 mt-0.5">Paying for: <span className="font-bold text-gray-700">{orderType}</span></p>
        </div>

        {/* Dynamic Amount Display */}
        <div className="bg-teal-50 border border-teal-100 rounded-xl py-3 px-4 w-fit mx-auto">
          <span className="block text-[10px] uppercase font-bold text-teal-700 tracking-wider">Amount to Pay</span>
          <span className="text-2xl font-black text-teal-900">₹{amount}</span>
        </div>

        {/* --- OPTION A: FOR MOBILE USERS (DIRECT INTENT LAUNCH) --- */}
        <div className="block space-y-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">👉 Click to Pay via Mobile Apps</p>
          <a 
            href={upiUrl}
            className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-sm"
          >
            <Smartphone className="w-4 h-4" /> Open GPay / PhonePe / Paytm
          </a>
        </div>

        <div className="flex items-center my-2 text-gray-300 text-xs before:flex-1 before:border-t before:mr-2 after:flex-1 after:border-t after:ml-2">OR</div>

        {/* --- OPTION B: MANUAL UPI ID TRANSFER --- */}
        <div className="text-left bg-gray-50 p-3 rounded-xl border space-y-1.5">
          <span className="block text-[10px] font-bold text-gray-400 uppercase">Seller UPI ID</span>
          <div className="flex items-center justify-between gap-2 bg-white border p-2 rounded-lg">
            <span className="text-xs font-mono font-bold text-gray-700 select-all">{SELLER_UPI_ID}</span>
            <button onClick={handleCopyUpi} className="text-teal-600 hover:text-teal-800 transition">
              {copied ? <span className="text-[10px] font-bold text-emerald-600">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* --- TRANSACTION ID ENTRY FOR VERIFICATION --- */}
        <form onSubmit={(e) => { e.preventDefault(); if(transactionId) onPaymentSuccess(transactionId); }} className="space-y-3 pt-2 text-left">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase">Enter UPI Ref No. / UTR No. after payment</label>
            <input 
              type="number" 
              placeholder="e.g., 4123XXXXXXXX"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="w-full mt-1 p-2.5 border rounded-xl text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-600 font-mono tracking-wider"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-2.5 text-xs font-bold text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-xl shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-3.5 h-3.5" /> Submit Order
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

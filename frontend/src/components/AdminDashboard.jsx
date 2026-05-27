// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Plus, Phone, Upload, Check } from 'lucide-react';
import axios from 'axios'; // <-- ADD THIS DATA CONFINEMENT LAYER IMPORT
import { fetchLiveProducts } from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('classes');
  const [dressForm, setDressForm] = useState({ title: '', size: 'M', price: '150' });
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Replace the mock function inside AdminDashboard.jsx with this live connection handler
  const [selectedFile, setSelectedFile] = useState(null);

  // --- Dynamic Inventory States ---
  const [liveInventory, setLiveInventory] = useState([]);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  const mockStudents = [
    { id: 'ENR_01', name: 'Anitha Raj',   phone: '+919443212345', type: 'Offline',    paid: 500,  status: 'Advance_Paid' },
    { id: 'ENR_02', name: 'Meena Suresh', phone: '+919841276543', type: 'Online Live', paid: 3000, status: 'Fully_Paid'   },
    { id: 'ENR_03', name: 'Kavitha M.',   phone: '+919789054321', type: 'Offline',    paid: 0,    status: 'Unpaid'        },
  ];

  const loadLiveInventory = async () => {
    setIsLoadingStock(true);
    try {
      const result = await fetchLiveProducts();
      if (result.success) {
        setLiveInventory(result.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingStock(false);
  };

  useEffect(() => {
    if (activeTab === 'shop') {
      loadLiveInventory();
    }
  }, [activeTab]);

  const handlePublishDress = async (e) => {
    e.preventDefault();
    if (!dressForm.title) return alert("Please type a dress title!");
    if (!selectedFile) return alert("Please capture or select an item image first!");

    try {
      // Package payload parameters into standard multi-part data arrays
      const dataPayload = new FormData();
      dataPayload.append('title', dressForm.title);
      dataPayload.append('size', dressForm.size);
      dataPayload.append('price', dressForm.price);
      dataPayload.append('dressImage', selectedFile); // Tied to incoming Multer receiver key

      setUploadSuccess(true);

      // Execute network transaction to Node.js backend
      const response = await axios.post('http://localhost:5000/api/admin/add-product', dataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert("✨ Unique item uploaded successfully to database!");
        setDressForm({ title: '', size: 'M', price: '150' });
        setSelectedFile(null);
        loadLiveInventory(); // Reload live inventory automatically!
      }
    } catch (err) {
      console.error("Upload process crash tracking:", err);
      alert("❌ Upload failed. Ensure your backend node server is running.");
    } finally {
      setUploadSuccess(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mt-6">
 
      {/* ── Dashboard Header ── */}
      <div className="bg-gradient-to-br from-teal-800 to-teal-950 p-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black flex items-center gap-2">👸 Seller Control Studio</h2>
          <p className="text-teal-200 text-xs mt-0.5">Manage your home business accounts smoothly from your smartphone.</p>
        </div>
        <div className="flex gap-4 bg-teal-900 bg-opacity-40 p-3 rounded-xl border border-teal-700">
          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold text-teal-300">Total Classes</span>
            <span className="text-base font-black text-yellow-300">₹6,500</span>
          </div>
          <div className="w-px bg-teal-700 self-stretch"></div>
          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold text-teal-300">Dress Sales</span>
            <span className="text-base font-black text-yellow-300">₹{liveInventory.reduce((acc, curr) => curr.status === 'Sold_Out' ? acc + curr.price : acc, 0) || 1800}</span>
          </div>
        </div>
      </div>
 
      {/* ── Tab Bar ── */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('classes')}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'classes'
              ? 'border-teal-700 text-teal-800 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Aari Classes ({mockStudents.length})
        </button>
        <button
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'shop'
              ? 'border-teal-700 text-teal-800 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Dress Shop ({isLoadingStock ? '...' : liveInventory.length})
        </button>
      </div>
 
      {/* ── Panel Body ── */}
      <div className="p-4 sm:p-6">
 
        {/* ══ PANEL A: STUDENT REGISTRY ══ */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-wide">
              Course Enrollment Ledger (₹3,000 Flat)
            </h3>
 
            <div className="space-y-3">
              {mockStudents.map((student) => (
                <div
                  key={student.id}
                  className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{student.name}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      Batch: {student.type} &nbsp;|&nbsp; Reg ID: {student.id}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-600">Collected: ₹{student.paid}</span>
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                        Owed: ₹{3000 - student.paid}
                      </span>
                    </div>
                  </div>
 
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${
                      student.status === 'Fully_Paid'   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      student.status === 'Advance_Paid' ? 'bg-amber-50   text-amber-700   border-amber-200'   :
                                                          'bg-rose-50    text-rose-700     border-rose-200'
                    }`}>
                      {student.status.replace('_', ' ')}
                    </span>
                    <a
                      href={`tel:${student.phone}`}
                      className="p-2 bg-white hover:bg-gray-100 border rounded-lg text-gray-600 transition shadow-sm"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
 
            {/* Add New Enrollment CTA */}
            <button className="w-full mt-2 py-2.5 border-2 border-dashed border-teal-300 rounded-xl text-xs font-bold text-teal-700 hover:bg-teal-50 transition flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Enroll New Student
            </button>
          </div>
        )}
 
        {/* ══ PANEL B: DRESS SHOP & UPLOAD ══ */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
 
            {/* Camera Upload Form */}
            <form onSubmit={handlePublishDress} className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-black text-teal-900 flex items-center gap-1.5">
                ⚡ Fast Dress Camera Upload
              </h3>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Camera Tap Slot */}
                <div className="border-2 border-dashed border-teal-300 rounded-xl bg-white p-4 flex flex-col items-center justify-center text-center relative hover:bg-teal-50 transition min-h-[120px]">
                  <Upload className="w-6 h-6 text-teal-600 mb-1" />
                  <span className="text-xs font-bold text-teal-900">
                    {selectedFile ? `📸 Selected: ${selectedFile.name.substring(0, 15)}...` : 'Tap to Snap Photo'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Opens smartphone camera immediately</span>
                  
                  {/* The invisible file system input tracker */}
                  <input 
                    type="file" 
                    accept="image/*" 
                    capture="environment" 
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
 
                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">Dress Title</label>
                    <input
                      type="text"
                      placeholder="e.g., Summer Floral Top"
                      value={dressForm.title}
                      onChange={(e) => setDressForm({ ...dressForm, title: e.target.value })}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-600"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase">Size</label>
                      <select
                        value={dressForm.size}
                        onChange={(e) => setDressForm({ ...dressForm, size: e.target.value })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                      >
                        <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase">Price (₹)</label>
                      <input
                        type="number"
                        value={dressForm.price}
                        onChange={(e) => setDressForm({ ...dressForm, price: e.target.value })}
                        className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                  uploadSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-teal-700 text-white hover:bg-teal-800'
                }`}
              >
                {uploadSuccess ? (
                  <><Check className="w-3.5 h-3.5" /> Live! Automatically set Stock = 1</>
                ) : (
                  <><Plus className="w-3.5 h-3.5" /> Publish Unique Dress Live</>
                )}
              </button>
            </form>
 
            {/* Inventory List */}
            <div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-wide mb-3">
                Current Boutique Stock ({liveInventory.length})
              </h3>
              <div className="space-y-2">
                {isLoadingStock ? (
                  <div className="text-center py-6 text-xs text-gray-400 animate-pulse">
                    Refreshing inventory records...
                  </div>
                ) : liveInventory.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400 border border-dashed rounded-xl">
                    No listed items. snaps some pictures and upload above!
                  </div>
                ) : (
                  liveInventory.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-gray-50 shadow-sm"
                    >
                      {/* Dress Icon/Thumbnail */}
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center text-xl flex-shrink-0 border border-teal-100 overflow-hidden">
                        {item.image_url ? (
                          <img src={`http://localhost:5000${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          '👗'
                        )}
                      </div>
 
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          ID: {item._id} &nbsp;|&nbsp; Fit: Size {item.size}
                        </p>
                      </div>
 
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        <span className="text-sm font-black text-gray-900">₹{item.price}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-bold text-gray-400">Qty: {item.stock || 1}</span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                            item.status === 'Available'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-gray-100   text-gray-400   border-gray-200'
                          }`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
 
          </div>
        )}
      </div>
    </div>
  );
}

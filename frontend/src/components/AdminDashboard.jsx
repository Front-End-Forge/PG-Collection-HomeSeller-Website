// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Plus, Phone, Upload, Check, Trash, Image, Layout, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { 
  fetchLiveProducts,
  fetchPortfolioItems,
  uploadPortfolioItem,
  deletePortfolioItem,
  fetchCategories,
  uploadCategoryImage,
  fetchHeroSlides,
  uploadHeroSlide,
  deleteHeroSlide,
  fetchEnrollments,
  addEnrollment
} from '../services/api';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('classes');
  
  // --- Live Products States ---
  const [dressForm, setDressForm] = useState({ title: '', size: 'M', price: '150' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [liveInventory, setLiveInventory] = useState([]);
  const [isLoadingStock, setIsLoadingStock] = useState(false);

  // --- Dynamic Student Registry States ---
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isEnrollFormOpen, setIsEnrollFormOpen] = useState(false);
  const [enrollForm, setEnrollForm] = useState({
    name: '',
    phone: '',
    type: 'Offline',
    paid: 0,
    status: 'Unpaid'
  });

  // --- Website Content Editor States ---
  const [webSubTab, setWebSubTab] = useState('portfolio');
  
  // Stitching Portfolio
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [portForm, setPortForm] = useState({ title: '', desc: '', type: 'SIMPLE' });
  const [portFile, setPortFile] = useState(null);
  const [isPortUploading, setIsPortUploading] = useState(false);

  // Category Bubbles
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState('₹150 டாப்ஸ்');
  const [categoryFile, setCategoryFile] = useState(null);
  const [isCategoryUploading, setIsCategoryUploading] = useState(false);

  // Hero Carousel Banners
  const [heroSlides, setHeroSlides] = useState([]);
  const [isLoadingHero, setIsLoadingHero] = useState(false);
  const [heroForm, setHeroForm] = useState({ title: '', desc: '', badge: 'முக்கிய அறிவிப்பு', btnText: 'இப்போதே வாங்க', tab: 'shop' });
  const [heroFile, setHeroFile] = useState(null);
  const [isHeroUploading, setIsHeroUploading] = useState(false);

  // --- Load Data Helpers ---

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

  const loadStudents = async () => {
    setIsLoadingStudents(true);
    try {
      const result = await fetchEnrollments();
      if (result.success) {
        setStudents(result.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingStudents(false);
  };

  const loadPortfolio = async () => {
    setIsLoadingPortfolio(true);
    try {
      const result = await fetchPortfolioItems();
      if (result.success) {
        setPortfolioItems(result.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingPortfolio(false);
  };

  const loadCategoriesData = async () => {
    setIsLoadingCategories(true);
    try {
      const result = await fetchCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingCategories(false);
  };

  const loadHeroSlides = async () => {
    setIsLoadingHero(true);
    try {
      const result = await fetchHeroSlides();
      if (result.success) {
        setHeroSlides(result.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsLoadingHero(false);
  };

  // React to tab switching
  useEffect(() => {
    if (activeTab === 'classes') {
      loadStudents();
    } else if (activeTab === 'shop') {
      loadLiveInventory();
    } else if (activeTab === 'website') {
      loadPortfolio();
      loadCategoriesData();
      loadHeroSlides();
    }
  }, [activeTab]);

  // --- Form Submission Handlers ---

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    if (!enrollForm.name || !enrollForm.phone) return alert("Please fill all student details!");

    try {
      const payload = {
        studentName: enrollForm.name,
        phone: enrollForm.phone,
        classType: enrollForm.type,
        amountPaid: Number(enrollForm.paid) || 0,
        paymentStatus: enrollForm.status
      };

      const response = await addEnrollment(payload);
      if (response.success) {
        alert(`🎉 "${enrollForm.name}" has been enrolled successfully!`);
        setIsEnrollFormOpen(false);
        setEnrollForm({
          name: '',
          phone: '',
          type: 'Offline',
          paid: 0,
          status: 'Unpaid'
        });
        loadStudents();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Enrollment failed.");
    }
  };

  const handlePublishDress = async (e) => {
    e.preventDefault();
    if (!dressForm.title) return alert("Please type a dress title!");
    if (!selectedFile) return alert("Please capture or select an item image first!");

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', dressForm.title);
      dataPayload.append('size', dressForm.size);
      dataPayload.append('price', dressForm.price);
      dataPayload.append('dressImage', selectedFile);

      setUploadSuccess(true);

      const response = await axios.post(`${BASE_URL}/api/admin/add-product`, dataPayload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert("✨ Unique item uploaded successfully to database!");
        setDressForm({ title: '', size: 'M', price: '150' });
        setSelectedFile(null);
        loadLiveInventory();
      }
    } catch (err) {
      console.error("Upload process error:", err);
      alert("❌ Upload failed. Ensure your backend server is running.");
    } finally {
      setUploadSuccess(false);
    }
  };

  const handlePublishPortfolio = async (e) => {
    e.preventDefault();
    if (!portForm.title || !portForm.desc) return alert("Please fill portfolio details!");
    if (!portFile) return alert("Please select a portfolio image first!");

    try {
      setIsPortUploading(true);
      const dataPayload = new FormData();
      dataPayload.append('title', portForm.title);
      dataPayload.append('desc', portForm.desc);
      dataPayload.append('type', portForm.type);
      dataPayload.append('portfolioImage', portFile);

      const response = await uploadPortfolioItem(dataPayload);
      if (response.success) {
        alert("✨ Stitching portfolio item added!");
        setPortForm({ title: '', desc: '', type: 'SIMPLE' });
        setPortFile(null);
        loadPortfolio();
      } else {
        alert("❌ Portfolio upload failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPortUploading(false);
    }
  };

  const handleDeletePortfolio = async (id) => {
    if (!window.confirm("Are you sure you want to delete this portfolio item?")) return;
    try {
      const res = await deletePortfolioItem(id);
      if (res.success) {
        alert("Portfolio item deleted");
        loadPortfolio();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!categoryFile) return alert("Please select a category image!");

    try {
      setIsCategoryUploading(true);
      const dataPayload = new FormData();
      dataPayload.append('name', selectedCategoryName);
      dataPayload.append('categoryImage', categoryFile);

      const response = await uploadCategoryImage(dataPayload);
      if (response.success) {
        alert("✨ Category customized!");
        setCategoryFile(null);
        loadCategoriesData();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Category update failed.");
    } finally {
      setIsCategoryUploading(false);
    }
  };

  const handlePublishHero = async (e) => {
    e.preventDefault();
    if (!heroForm.title || !heroForm.desc) return alert("Please fill hero details!");
    if (!heroFile) return alert("Please select a banner image!");

    try {
      setIsHeroUploading(true);
      const dataPayload = new FormData();
      dataPayload.append('title', heroForm.title);
      dataPayload.append('desc', heroForm.desc);
      dataPayload.append('badge', heroForm.badge);
      dataPayload.append('btnText', heroForm.btnText);
      dataPayload.append('tab', heroForm.tab);
      dataPayload.append('heroImage', heroFile);

      const response = await uploadHeroSlide(dataPayload);
      if (response.success) {
        alert("✨ Hero banner slide listed!");
        setHeroForm({ title: '', desc: '', badge: 'முக்கிய அறிவிப்பு', btnText: 'இப்போதே வாங்க', tab: 'shop' });
        setHeroFile(null);
        loadHeroSlides();
      }
    } catch (err) {
      console.error(err);
      alert("❌ Banner upload failed.");
    } finally {
      setIsHeroUploading(false);
    }
  };

  const handleDeleteHero = async (id) => {
    if (!window.confirm("Are you sure you want to delete this slide?")) return;
    try {
      const res = await deleteHeroSlide(id);
      if (res.success) {
        alert("Hero slide deleted");
        loadHeroSlides();
      }
    } catch (err) {
      console.error(err);
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
            <span className="text-base font-black text-yellow-300">
              ₹{students.reduce((acc, curr) => acc + (curr.amountPaid || curr.paid || 0), 0).toLocaleString()}
            </span>
          </div>
          <div className="w-px bg-teal-700 self-stretch"></div>
          <div className="text-center">
            <span className="block text-[10px] uppercase font-bold text-teal-300">Dress Sales</span>
            <span className="text-base font-black text-yellow-300">
              ₹{liveInventory.reduce((acc, curr) => curr.status === 'Sold_Out' ? acc + curr.price : acc, 0) || 1800}
            </span>
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
          <BookOpen className="w-4 h-4" /> Aari Classes ({students.length})
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
        <button
          onClick={() => setActiveTab('website')}
          className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-all ${
            activeTab === 'website'
              ? 'border-teal-700 text-teal-800 bg-white'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layout className="w-4 h-4" /> Website Editor
        </button>
      </div>
 
      {/* ── Panel Body ── */}
      <div className="p-4 sm:p-6 text-left">
 
        {/* ══ PANEL A: STUDENT REGISTRY ══ */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <h3 className="text-sm font-black text-gray-500 uppercase tracking-wide">
              Course Enrollment Ledger (₹3,000 Flat)
            </h3>
 
            <div className="space-y-3">
              {isLoadingStudents ? (
                <div className="text-center py-6 text-xs text-gray-400">Loading enrollment records...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-400 border border-dashed rounded-xl">
                  No enrolled students found.
                </div>
              ) : (
                students.map((student) => (
                  <div
                    key={student._id || student.id}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{student.studentName || student.name}</h4>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        Batch: {student.classType || student.type} &nbsp;|&nbsp; Reg ID: {(student._id || student.id).substring(0, 10)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-600">Collected: ₹{student.amountPaid || student.paid}</span>
                        <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                          Owed: ₹{3000 - (student.amountPaid || student.paid)}
                        </span>
                      </div>
                    </div>
 
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${
                        student.paymentStatus === 'Fully_Paid' || student.status === 'Fully_Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        student.paymentStatus === 'Advance_Paid' || student.status === 'Advance_Paid' ? 'bg-amber-50   text-amber-700   border-amber-200'   :
                                                            'bg-rose-50    text-rose-700     border-rose-200'
                      }`}>
                        {(student.paymentStatus || student.status || '').replace('_', ' ')}
                      </span>
                      <a
                        href={`tel:${student.phone}`}
                        className="p-2 bg-white hover:bg-gray-100 border rounded-lg text-gray-600 transition shadow-sm"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
 
            {/* Add New Enrollment CTA Form */}
            {isEnrollFormOpen ? (
              <form onSubmit={handleEnrollSubmit} className="bg-teal-50 border border-teal-100 rounded-xl p-5 space-y-4 animate-fade-in text-left">
                <h4 className="text-sm font-black text-teal-900 flex items-center gap-1.5">
                  📝 புதிய சேர்க்கை விவரங்கள் (Student Details)
                </h4>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">மாணவர் பெயர் (Student Name)</label>
                    <input
                      type="text"
                      required
                      placeholder="எ.கா., பிரியா தேவி"
                      value={enrollForm.name}
                      onChange={(e) => setEnrollForm({ ...enrollForm, name: e.target.value })}
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
 
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">தொலைபேசி எண் (Phone Number)</label>
                    <input
                      type="tel"
                      required
                      placeholder="எ.கா., +91 9876543210"
                      value={enrollForm.phone}
                      onChange={(e) => setEnrollForm({ ...enrollForm, phone: e.target.value })}
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none"
                    />
                  </div>
 
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">வகுப்பு முறை (Batch Mode)</label>
                    <select
                      value={enrollForm.type}
                      onChange={(e) => setEnrollForm({ ...enrollForm, type: e.target.value })}
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-xl text-xs bg-white"
                    >
                      <option value="Offline">🏡 ஹோம் ஸ்டு튜디오 (Offline)</option>
                      <option value="Online">💻 ஆன்லைன் வகுப்பு (Online)</option>
                    </select>
                  </div>
 
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">கட்டண நிலை (Payment Status)</label>
                    <select
                      value={enrollForm.status}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        let newPaid = enrollForm.paid;
                        if (newStatus === 'Fully_Paid') newPaid = 3000;
                        else if (newStatus === 'Unpaid') newPaid = 0;
                        setEnrollForm({ ...enrollForm, status: newStatus, paid: newPaid });
                      }}
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-xl text-xs bg-white"
                    >
                      <option value="Unpaid">🔴 கட்டணம் செலுத்தவில்லை (Unpaid)</option>
                      <option value="Advance_Paid">🟡 முன்பதிவு கட்டணம் செலுத்தியது (Advance Paid)</option>
                      <option value="Fully_Paid">🟢 முழுமையாக செலுத்தியது (Fully Paid)</option>
                    </select>
                  </div>
 
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">செலுத்திய கட்டணம் (Amount Collected - ₹)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      max="3000"
                      disabled={enrollForm.status === 'Fully_Paid' || enrollForm.status === 'Unpaid'}
                      value={enrollForm.paid}
                      onChange={(e) => setEnrollForm({ ...enrollForm, paid: Number(e.target.value) })}
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-xl text-xs bg-white font-bold"
                    />
                  </div>
 
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">மீதமுள்ள கட்டணம் (Amount Owed - ₹)</label>
                    <input
                      type="text"
                      disabled
                      value={`₹${3000 - enrollForm.paid}`}
                      className="w-full mt-1 p-2.5 border border-gray-300 rounded-xl text-xs bg-gray-100 text-teal-700 font-bold"
                    />
                  </div>
                </div>
 
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" /> சேர்க்கையை உறுதிசெய்
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEnrollFormOpen(false)}
                    className="py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-bold text-xs rounded-xl"
                  >
                    ரத்துசெய்
                  </button>
                </div>
              </form>
            ) : (
              <button 
                onClick={() => setIsEnrollFormOpen(true)}
                className="w-full mt-2 py-2.5 border-2 border-dashed border-teal-300 rounded-xl text-xs font-bold text-teal-700 hover:bg-teal-50 transition flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Enroll New Student
              </button>
            )}
          </div>
        )}
 
        {/* ══ PANEL B: DRESS SHOP & UPLOAD ══ */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
 
            {/* Camera/File Upload Form */}
            <form onSubmit={handlePublishDress} className="bg-teal-50 border border-teal-100 rounded-xl p-4 space-y-4">
              <h3 className="text-sm font-black text-teal-900 flex items-center gap-1.5">
                ⚡ Dress Image Upload (Camera or Gallery)
              </h3>
 
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Camera / Storage Slot (Removing restrictive capture parameter) */}
                <div className="border-2 border-dashed border-teal-300 rounded-xl bg-white p-4 flex flex-col items-center justify-center text-center relative hover:bg-teal-50 transition min-h-[120px]">
                  <Upload className="w-6 h-6 text-teal-600 mb-1" />
                  <span className="text-xs font-bold text-teal-900">
                    {selectedFile ? `📸 Selected: ${selectedFile.name.substring(0, 15)}...` : 'Tap to Snap Photo or Choose File'}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">Supports instant camera snap OR file library selection</span>
                  
                  <input 
                    type="file" 
                    accept="image/*" 
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
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
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
                  <div className="text-center py-6 text-xs text-gray-400">Refreshing inventory records...</div>
                ) : liveInventory.length === 0 ? (
                  <div className="text-center py-6 text-xs text-gray-400 border border-dashed rounded-xl">
                    No listed items. Snaps some pictures and upload above!
                  </div>
                ) : (
                  liveInventory.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-gray-50 shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center text-xl flex-shrink-0 border border-teal-100 overflow-hidden">
                        {item.image_url ? (
                          <img src={`${BASE_URL}${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
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

        {/* ══ PANEL C: WEBSITE EDITOR (DYNAMIC MEDIA SECTIONS) ══ */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            
            {/* Website Content Sub-Tabs Selector */}
            <div className="flex gap-2 p-1.5 bg-gray-100 rounded-xl">
              <button 
                onClick={() => setWebSubTab('portfolio')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  webSubTab === 'portfolio' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Stitching Portfolio ({portfolioItems.length})
              </button>
              <button 
                onClick={() => setWebSubTab('categories')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  webSubTab === 'categories' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Category Images
              </button>
              <button 
                onClick={() => setWebSubTab('hero')}
                className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
                  webSubTab === 'hero' ? 'bg-white text-teal-800 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Hero Banners ({heroSlides.length})
              </button>
            </div>

            {/* SUB-SECTION 1: STITCHING PORTFOLIO EDITOR */}
            {webSubTab === 'portfolio' && (
              <div className="space-y-6">
                
                {/* Upload Form */}
                <form onSubmit={handlePublishPortfolio} className="bg-sky-50 border border-sky-100 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-black text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                    🪡 Add Designer Gown or Stitched Clothing Showcase
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Multi-option Image Input */}
                    <div className="border-2 border-dashed border-sky-300 rounded-xl bg-white p-4 flex flex-col items-center justify-center text-center relative hover:bg-sky-50 transition min-h-[120px]">
                      <Upload className="w-6 h-6 text-sky-700 mb-1" />
                      <span className="text-xs font-bold text-sky-950">
                        {portFile ? `📸 Selected: ${portFile.name.substring(0, 15)}...` : 'Select Gown Image'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Camera snap or browse file gallery</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setPortFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    {/* Meta Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Showcase Title (English or Tamil)</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. பிரீமியம் பிரைடல் கவுன்"
                          value={portForm.title}
                          onChange={(e) => setPortForm({ ...portForm, title: e.target.value })}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Short description</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. கனமான கைவினை ஆரி எம்பிராய்டரி"
                          value={portForm.desc}
                          onChange={(e) => setPortForm({ ...portForm, desc: e.target.value })}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Stitching Complexity Style</label>
                        <select 
                          value={portForm.type}
                          onChange={(e) => setPortForm({ ...portForm, type: e.target.value })}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        >
                          <option value="SIMPLE">சாதாரண தையல் (Simple Stitching)</option>
                          <option value="AARI_FUSED">ஆரி எம்பிராய்டரி கவுன் (Aari Fused Gown)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isPortUploading}
                    className="w-full py-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs rounded-lg transition"
                  >
                    {isPortUploading ? 'Uploading and optimizing image via Sharp...' : '+ Add to Stitching Portfolio Gallery'}
                  </button>
                </form>

                {/* Existing Items List */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                    Active Portfolio Designs ({portfolioItems.length})
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {isLoadingPortfolio ? (
                      <div className="text-center py-6 text-xs text-gray-400 col-span-full">Loading...</div>
                    ) : portfolioItems.length === 0 ? (
                      <div className="text-center py-6 text-xs text-gray-400 border border-dashed rounded-xl col-span-full">
                        No portfolio custom gown items uploaded yet. Displays dynamic defaults.
                      </div>
                    ) : (
                      portfolioItems.map((item) => (
                        <div key={item._id} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
                          <img src={`${BASE_URL}${item.image_url}`} alt={item.title} className="w-12 h-12 object-cover rounded-lg border" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-800 truncate">{item.title}</p>
                            <p className="text-[10px] text-gray-400 truncate">{item.desc}</p>
                            <span className="inline-block text-[9px] bg-slate-100 text-gray-600 px-1 py-0.2 mt-0.5 rounded font-black">
                              {item.type === 'SIMPLE' ? 'Stitching' : 'Aari Gown'}
                            </span>
                          </div>
                          <button 
                            onClick={() => handleDeletePortfolio(item._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* SUB-SECTION 2: HOMEPAGE CATEGORIES CUSTOMIZER */}
            {webSubTab === 'categories' && (
              <div className="space-y-6">
                
                {/* Upload Form */}
                <form onSubmit={handleUpdateCategory} className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                    👚 Customize Category Circle Image (Replaces Default Emoji)
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selector */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Select Target Homepage Circle</label>
                        <select 
                          value={selectedCategoryName}
                          onChange={(e) => setSelectedCategoryName(e.target.value)}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        >
                          <option>₹150 டாப்ஸ்</option>
                          <option>நைட்டிகள்</option>
                          <option>இன்னர்வேர்</option>
                          <option>குழந்தை ஆடைகள்</option>
                        </select>
                      </div>

                      <div className="bg-white border rounded-xl p-3 text-xs text-gray-500 space-y-1">
                        <span className="font-bold text-[10px] text-gray-400 block uppercase">Active Mapping Details:</span>
                        <p>Target Category: <strong className="text-amber-800">{selectedCategoryName}</strong></p>
                        <p>Currently configured cover override images will render in the dynamic navigation rounds.</p>
                      </div>
                    </div>

                    {/* Multi-option Image Picker */}
                    <div className="border-2 border-dashed border-amber-300 rounded-xl bg-white p-4 flex flex-col items-center justify-center text-center relative hover:bg-amber-50 transition min-h-[120px]">
                      <Upload className="w-6 h-6 text-amber-700 mb-1" />
                      <span className="text-xs font-bold text-amber-950">
                        {categoryFile ? `📸 Selected: ${categoryFile.name.substring(0, 15)}...` : 'Select Circle Image'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Dual Mode: Camera click or select image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setCategoryFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isCategoryUploading}
                    className="w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-lg transition"
                  >
                    {isCategoryUploading ? 'Optimizing category asset...' : 'Upload & Customize Category Bubble Image'}
                  </button>
                </form>

                {/* Previews List */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                    Homepage Circles Status Check
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categories.map((c) => (
                      <div key={c._id} className="border border-gray-200 rounded-xl p-3 bg-white shadow-sm flex flex-col items-center text-center gap-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden border bg-gray-50 flex items-center justify-center text-2xl">
                          {c.image_url ? (
                            <img src={`${BASE_URL}${c.image_url}`} alt={c.name} className="w-full h-full object-cover" />
                          ) : (
                            c.icon
                          )}
                        </div>
                        <span className="text-[11px] font-black text-gray-700">{c.name}</span>
                        <span className="text-[8px] font-bold text-gray-400">
                          {c.image_url ? '✨ Custom Image Active' : 'Default Emoji'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* SUB-SECTION 3: HERO CAROUSEL BANNER EDITOR */}
            {webSubTab === 'hero' && (
              <div className="space-y-6">
                
                {/* Upload Form */}
                <form onSubmit={handlePublishHero} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-4">
                  <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    🖼️ Add Custom Homepage Hero Banner Carousel Slide
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Multi-option Image Picker */}
                    <div className="border-2 border-dashed border-emerald-300 rounded-xl bg-white p-4 flex flex-col items-center justify-center text-center relative hover:bg-emerald-50 transition min-h-[120px]">
                      <Upload className="w-6 h-6 text-emerald-700 mb-1" />
                      <span className="text-xs font-bold text-emerald-950">
                        {heroFile ? `📸 Selected: ${heroFile.name.substring(0, 15)}...` : 'Select Hero Banner Image'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Camera snap or local gallery selection</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => setHeroFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    {/* Metadata Fields */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Banner Headline (Tamil preferred)</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. பிரீமியம் தையல் கலை"
                          value={heroForm.title}
                          onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Subtext Description</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. சரியான அளவிற்கு கச்சிதமாக தைத்து தரப்படும்"
                          value={heroForm.desc}
                          onChange={(e) => setHeroForm({ ...heroForm, desc: e.target.value })}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Gold Badge Pill</label>
                          <input 
                            type="text" 
                            placeholder="e.g. முக்கிய அறிவிப்பு"
                            value={heroForm.badge}
                            onChange={(e) => setHeroForm({ ...heroForm, badge: e.target.value })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-gray-500 uppercase">Button Text</label>
                          <input 
                            type="text" 
                            placeholder="e.g. இப்போதே வாங்க"
                            value={heroForm.btnText}
                            onChange={(e) => setHeroForm({ ...heroForm, btnText: e.target.value })}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase">Navigation Target tab</label>
                        <select 
                          value={heroForm.tab}
                          onChange={(e) => setHeroForm({ ...heroForm, tab: e.target.value })}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                        >
                          <option value="shop">ஆடை ஸ்டோர் (Shop)</option>
                          <option value="stitching">டிசைனர் கவுன்கள் (Stitching Portfolio)</option>
                          <option value="classes">ஆரி வகுப்புகள் (Aari Classes)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isHeroUploading}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
                  >
                    {isHeroUploading ? 'Uploading slide banner asset...' : '+ Publish Homepage Hero Carousel Banner'}
                  </button>
                </form>

                {/* Slides List */}
                <div>
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-3">
                    Active Home Banners ({heroSlides.length})
                  </h4>

                  <div className="space-y-2.5">
                    {isLoadingHero ? (
                      <div className="text-center py-6 text-xs text-gray-400">Loading...</div>
                    ) : heroSlides.length === 0 ? (
                      <div className="text-center py-6 text-xs text-gray-400 border border-dashed rounded-xl">
                        No customized hero banners active. Default templates will be loaded.
                      </div>
                    ) : (
                      heroSlides.map((slide) => (
                        <div key={slide._id} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3 bg-white shadow-sm">
                          <img src={`${BASE_URL}${slide.image_url}`} alt={slide.title} className="w-14 h-10 object-cover rounded border" />
                          <div className="flex-1 min-w-0">
                            <span className="inline-block text-[8px] bg-amber-100 text-amber-800 px-1 py-0.2 rounded font-black uppercase">
                              {slide.badge}
                            </span>
                            <p className="text-xs font-black text-gray-800 truncate">{slide.title}</p>
                            <p className="text-[9px] text-gray-400 truncate">{slide.desc}</p>
                          </div>
                          <button 
                            onClick={() => handleDeleteHero(slide._id)}
                            className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

// frontend/src/components/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { BookOpen, ShoppingBag, Plus, Phone, Upload, Check, Trash, Image, Layout, ArrowRight, Edit } from 'lucide-react';
import axios from 'axios';
import { 
  fetchLiveProducts,
  fetchPortfolioItems,
  uploadPortfolioItem,
  deletePortfolioItem,
  fetchCategories,
  uploadCategoryImage,
  fetchEnrollments,
  addEnrollment,
  updateProductStatus,
  deleteProduct
} from '../services/api';

const BASE_URL = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('classes');
  
  // --- Live Products States ---
  const [dressForm, setDressForm] = useState({ 
    title: '', 
    size: 'M', 
    price: '150',
    fabricType: '',
    stitchingQuality: '',
    guaranteeNote: ''
  });
  const [primaryFile, setPrimaryFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [liveInventory, setLiveInventory] = useState([]);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState([]);

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

  // React to tab switching
  useEffect(() => {
    if (activeTab === 'classes') {
      loadStudents();
    } else if (activeTab === 'shop') {
      loadLiveInventory();
    } else if (activeTab === 'website') {
      loadPortfolio();
      loadCategoriesData();
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
    if (!editingProductId && !primaryFile && !existingImageUrl) {
      return alert("Please select a primary dress image first!");
    }

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', dressForm.title);
      dataPayload.append('size', dressForm.size);
      dataPayload.append('price', dressForm.price);
      dataPayload.append('fabricType', dressForm.fabricType);
      dataPayload.append('stitchingQuality', dressForm.stitchingQuality);
      dataPayload.append('guaranteeNote', dressForm.guaranteeNote);

      if (primaryFile) {
        dataPayload.append('dressImage', primaryFile);
      }
      extraFiles.forEach((file) => {
        dataPayload.append('additionalImages', file);
      });

      if (editingProductId) {
        dataPayload.append('existingImageUrl', existingImageUrl || '');
        dataPayload.append('existingAdditionalImages', JSON.stringify(existingAdditionalImages));
      }

      setUploadSuccess(true);

      let response;
      if (editingProductId) {
        response = await axios.put(`${BASE_URL}/api/admin/products/${editingProductId}`, dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await axios.post(`${BASE_URL}/api/admin/add-product`, dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      if (response.data.success) {
        alert(editingProductId ? "✏️ Dress listing updated successfully!" : "✨ Unique item uploaded successfully to database!");
        handleClearForm();
        loadLiveInventory();
      }
    } catch (err) {
      console.error("Upload/Update process error:", err);
      alert("❌ Operation failed. Ensure your backend server is running.");
    } finally {
      setUploadSuccess(false);
    }
  };

  const handleClearForm = () => {
    setDressForm({ 
      title: '', 
      size: 'M', 
      price: '150',
      fabricType: '',
      stitchingQuality: '',
      guaranteeNote: ''
    });
    setPrimaryFile(null);
    setExtraFiles([]);
    setEditingProductId(null);
    setExistingImageUrl(null);
    setExistingAdditionalImages([]);
  };

  const handleStartEditProduct = (item) => {
    setDressForm({
      title: item.title,
      size: item.size,
      price: String(item.price),
      fabricType: item.fabricType || '',
      stitchingQuality: item.stitchingQuality || '',
      guaranteeNote: item.guaranteeNote || ''
    });
    setPrimaryFile(null);
    setExtraFiles([]);
    setEditingProductId(item._id);
    setExistingImageUrl(item.image_url);
    setExistingAdditionalImages(item.additional_images || []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    handleClearForm();
  };

  const handleToggleProductStatus = async (productId, currentStatus) => {
    const nextStatus = currentStatus === 'Available' ? 'Sold_Out' : 'Available';
    try {
      const response = await updateProductStatus(productId, nextStatus);
      if (response.success) {
        alert(`✏️ Availability status updated successfully to ${nextStatus.replace('_', ' ')}!`);
        loadLiveInventory();
      } else {
        alert(`❌ Failed to update status: ${response.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Status update failed.");
    }
  };

  const handleDeleteProductListing = async (productId) => {
    if (!window.confirm("⚠️ Are you sure you want to permanently delete this dress listing? This will also delete the uploaded picture from disk storage.")) return;
    try {
      const response = await deleteProduct(productId);
      if (response.success) {
        alert("🗑️ Listed dress permanently deleted from boutique!");
        loadLiveInventory();
      } else {
        alert(`❌ Failed to delete product: ${response.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Deletion process failed.");
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
                {/* Multi-Image Upload Grid Manager */}
                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Dress Images (1 Primary + Up to 8 Views)
                  </label>
                  
                  <div className="grid grid-cols-2 xs:grid-cols-3 gap-3">
                    
                    {/* SLOT 1: PRIMARY IMAGE */}
                    <div className="relative aspect-[3/4] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex flex-col items-center justify-center text-center shadow-inner group min-h-[140px]">
                      {primaryFile ? (
                        <>
                          <img 
                            src={URL.createObjectURL(primaryFile)} 
                            alt="Primary preview" 
                            className="absolute inset-0 w-full h-full object-cover" 
                          />
                          <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-gray-900 font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded shadow-sm z-10">
                            ⭐ Primary
                          </div>
                          <button 
                            type="button"
                            onClick={() => setPrimaryFile(null)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm z-10 transition hover:scale-110"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </>
                      ) : existingImageUrl ? (
                        <>
                          <img 
                            src={`${BASE_URL}${existingImageUrl}`} 
                            alt="Existing primary" 
                            className="absolute inset-0 w-full h-full object-cover" 
                          />
                          <div className="absolute top-1.5 left-1.5 bg-yellow-400 text-gray-900 font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded shadow-sm z-10">
                            ⭐ Primary
                          </div>
                          <button 
                            type="button"
                            onClick={() => setExistingImageUrl(null)}
                            className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm z-10 transition hover:scale-110"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-2 text-center h-full relative cursor-pointer hover:bg-teal-50/50 transition w-full">
                          <Upload className="w-5 h-5 text-teal-600 mb-1" />
                          <span className="text-[10px] font-black text-teal-950 leading-tight">Primary Image</span>
                          <span className="text-[8px] text-gray-400 mt-0.5">(Required)</span>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setPrimaryFile(e.target.files[0])}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>

                    {/* ADDITIONAL SLOTS (EXISTING EXTRA IMAGES) */}
                    {existingAdditionalImages.map((imgUrl, idx) => (
                      <div key={`exist-extra-${idx}`} className="relative aspect-[3/4] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center text-center shadow-inner group min-h-[140px]">
                        <img 
                          src={`${BASE_URL}${imgUrl}`} 
                          alt="Existing extra" 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                        <div className="absolute top-1.5 left-1.5 bg-sky-500 text-white font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded shadow-sm z-10">
                          View {idx + 2}
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setExistingAdditionalImages(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm z-10 transition hover:scale-110"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* ADDITIONAL SLOTS (NEW EXTRA FILES PREVIEW) */}
                    {extraFiles.map((file, idx) => (
                      <div key={`new-extra-${idx}`} className="relative aspect-[3/4] rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center text-center shadow-inner group min-h-[140px]">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt="New extra preview" 
                          className="absolute inset-0 w-full h-full object-cover" 
                        />
                        <div className="absolute top-1.5 left-1.5 bg-emerald-500 text-white font-extrabold text-[8px] uppercase px-1.5 py-0.5 rounded shadow-sm z-10">
                          New Extra
                        </div>
                        <button 
                          type="button"
                          onClick={() => {
                            setExtraFiles(prev => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-sm z-10 transition hover:scale-110"
                        >
                          <Trash className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* SLOT + : ADD NEW VIEWS BUTTON */}
                    {(1 + existingAdditionalImages.length + extraFiles.length < 9) && (
                      <div className="relative aspect-[3/4] rounded-xl border-2 border-dashed border-teal-300 bg-white hover:bg-teal-50 transition overflow-hidden flex flex-col items-center justify-center text-center cursor-pointer shadow-sm min-h-[140px]">
                        <Plus className="w-5 h-5 text-teal-600 mb-1" />
                        <span className="text-[10px] font-black text-teal-900 leading-tight">Add View Image</span>
                        <span className="text-[8px] text-gray-400 mt-0.5">Camera / Gallery</span>
                        <input 
                          type="file" 
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            setExtraFiles(prev => [...prev, ...files]);
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}

                  </div>
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
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">Fabric Type (துணி வகை)</label>
                    <input
                      type="text"
                      placeholder="e.g., Premium Export Cotton (Optional)"
                      value={dressForm.fabricType}
                      onChange={(e) => setDressForm({ ...dressForm, fabricType: e.target.value })}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">Stitching Quality (தையல் வேலைப்பாடு)</label>
                    <input
                      type="text"
                      placeholder="e.g., கச்சிதமான தையல் வடிவமைப்பு (Optional)"
                      value={dressForm.stitchingQuality}
                      onChange={(e) => setDressForm({ ...dressForm, stitchingQuality: e.target.value })}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-500 uppercase">Guarantee Note (உத்திரவாதம்)</label>
                    <input
                      type="text"
                      placeholder="e.g., தனித்துவ உத்திரவாதம் (Optional)"
                      value={dressForm.guaranteeNote}
                      onChange={(e) => setDressForm({ ...dressForm, guaranteeNote: e.target.value })}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-lg text-xs bg-white"
                    />
                  </div>
                </div>
              </div>
 
              <div className="flex gap-2">
                <button
                  type="submit"
                  className={`flex-1 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                    uploadSuccess
                      ? 'bg-emerald-600 text-white'
                      : editingProductId
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-500/20'
                        : 'bg-teal-700 text-white hover:bg-teal-800'
                  }`}
                >
                  {uploadSuccess ? (
                    <><Check className="w-3.5 h-3.5" /> Saved!</>
                  ) : editingProductId ? (
                    <>✏️ Save Changes</>
                  ) : (
                    <><Plus className="w-3.5 h-3.5" /> Publish Unique Dress Live</>
                  )}
                </button>
                {editingProductId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 bg-gray-150 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-lg transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
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
                      className="flex flex-col sm:flex-row sm:items-center gap-3 border border-gray-200 rounded-xl p-3 bg-gray-50 shadow-sm hover:shadow transition"
                    >
                      {/* Top section: Image + Details (Title, ID, Size) */}
                      <div className="flex items-center gap-3 flex-1 min-w-0 w-full">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-50 to-emerald-100 flex items-center justify-center text-xl flex-shrink-0 border border-teal-100 overflow-hidden">
                          {item.image_url ? (
                            <img src={`${BASE_URL}${item.image_url}`} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            '👗'
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-black text-gray-800 truncate" title={item.title}>
                            {item.title}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap sm:whitespace-normal overflow-hidden text-ellipsis">
                            <span className="hidden sm:inline">ID: {item._id} &nbsp;|&nbsp; </span>Fit: Size {item.size}
                          </p>
                          <p className="text-[9px] text-gray-400 sm:hidden mt-0.5 truncate">
                            ID: {item._id}
                          </p>
                        </div>
                      </div>

                      {/* Bottom/Right section: Price, Status & Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 sm:flex-shrink-0 w-full sm:w-auto">
                        {/* Price, Qty, and Status badge */}
                        <div className="flex items-center sm:flex-col sm:items-end gap-2 sm:gap-1">
                          <span className="text-sm font-black text-gray-900">₹{item.price}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-gray-400">Qty: {item.stock || 1}</span>
                            <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded border ${
                              item.status === 'Available'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100   text-gray-400   border-gray-200'
                            }`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons (Status Toggle & Permanent Delete) */}
                        <div className="flex items-center gap-1.5 pl-2 sm:border-l border-gray-200">
                          <button
                            onClick={() => handleToggleProductStatus(item._id, item.status)}
                            className={`px-2 py-1 text-[9px] font-black uppercase rounded-lg border transition ${
                              item.status === 'Available'
                                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                                : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                            }`}
                          >
                            {item.status === 'Available' ? 'Mark Sold' : 'Restock'}
                          </button>
                          <button
                            onClick={() => handleStartEditProduct(item)}
                            className="p-1.5 text-sky-600 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-lg transition active:scale-95"
                            title="Edit Dress Listing"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProductListing(item._id)}
                            className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition active:scale-95"
                            title="Delete Dress Listing"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
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



          </div>
        )}
      </div>
    </div>
  );
}

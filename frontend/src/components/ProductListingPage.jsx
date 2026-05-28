// frontend/src/components/ProductListingPage.jsx
import React, { useState } from 'react';
import { Heart, X, ShoppingCart, ShieldCheck, Zap, ChevronLeft, ChevronRight, Maximize2, SlidersHorizontal } from 'lucide-react';
import { sampleProducts } from '../mockData';

const BASE_URL = process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`;

export default function ProductListingPage({ products, categories = [], isLoading, searchQuery, selectedCategoryProp, onAddToCart, onBuyNow }) {
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPriceRange, setSelectedPriceRange] = useState('ALL');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [imgErrors, setImgErrors] = useState({});

  // --- DYNAMIC MODAL INTERACTION STATES ---
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0); // Tracks multi-image thumbs
  const [isZoomOpen, setIsZoomOpen] = useState(false);       // Enlarged lightbox overlay

  const activeProducts = products && products.length > 0 ? products : sampleProducts;

  // Keep the selectedProduct details updated if the products array changes in the background (e.g., real-time sold out status or edits)
  React.useEffect(() => {
    if (selectedProduct) {
      const latest = activeProducts.find(p => (p._id || p.id) === (selectedProduct._id || selectedProduct.id));
      if (latest && JSON.stringify(latest) !== JSON.stringify(selectedProduct)) {
        setSelectedProduct(latest);
      }
    }
  }, [activeProducts, selectedProduct]);

  // Simulates custom image galleries for front, back, and tape guidelines
  const getProductImageGallery = (product) => {
    if (!product) return [];
    const gallery = [];
    if (product.image_url) {
      gallery.push({ id: 'FRONT', label: '🎥 முன்பக்கம் (Front View)', url: product.image_url, view: product.price === 150 ? '👚' : '👗' });
    }
    if (product.additional_images && Array.isArray(product.additional_images)) {
      product.additional_images.forEach((imgUrl, index) => {
        gallery.push({ 
          id: `EXTRA_${index}`, 
          label: `🖼️ வியூ ${index + 2} (View ${index + 2})`, 
          url: imgUrl, 
          view: product.price === 150 ? '👚' : '👗' 
        });
      });
    }
    if (gallery.length === 0) {
      gallery.push({ id: 'FRONT', label: '🎥 முன்பக்கம் (Front View)', view: product.price === 150 ? '👚' : '-[#e0f2fe]' });
    }
    return gallery;
  };

  // Filter strategy layout matching your Tamil sidebar selection configurations
  // Custom mapping helper function to determine key identifiers dynamically
  const getCategoryKey = (catName) => {
    if (catName.includes('150')) return '150_Tops';
    if (catName.includes('நைட்டி') || catName.toLowerCase().includes('nightie')) return 'Nighties';
    if (catName.includes('கவுன்') || catName.toLowerCase().includes('gown')) return 'Gowns';
    if (catName.includes('இன்னர்') || catName.toLowerCase().includes('inner')) return 'Innerwear';
    return catName.replace(/\s+/g, '_'); // Fallback: turns "Kids Wear" into "Kids_Wear" automatically for new items!
  };

  // --- THE FILTER MATCHING LOGIC LOOP TRACKER ---
  const filteredProducts = activeProducts.filter((product) => {
    // 1. Evaluate clean size parameters constraints match entries first
    const matchesSize = selectedSize === 'ALL' || product.size === selectedSize;
    
    // 2. Map structural values for type categorization arrays matching our keys definitions strings
    let productGroup = 'Others';
    if (product.price === 150) productGroup = '150_Tops';
    else if (product.title.toLowerCase().includes('nightie') || product.title.includes('நைட்டி')) productGroup = 'Nighties';
    else if (product.title.toLowerCase().includes('inner') || product.title.includes('இன்னர்')) productGroup = 'Innerwear';
    else if (product.title.toLowerCase().includes('kid') || product.title.includes('குழந்')) productGroup = 'Kids_Wear';
    else if (product.title.toLowerCase().includes('gown') || product.title.toLowerCase().includes('frock')) productGroup = 'Gowns';

    const matchesLocalCategory = selectedCategory === 'ALL' || productGroup === selectedCategory;
    const matchesBubbleCategory = !selectedCategoryProp || selectedCategoryProp === 'ALL' || productGroup === selectedCategoryProp;

    let matchesPrice = true;
    if (selectedPriceRange === 'under200') matchesPrice = product.price < 200;
    else if (selectedPriceRange === '200-500') matchesPrice = product.price >= 200 && product.price <= 500;
    else if (selectedPriceRange === 'above500') matchesPrice = product.price > 500;

    const matchesSearch = !searchQuery || product.title.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSize && matchesLocalCategory && matchesBubbleCategory && matchesPrice && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 select-none text-left">
      
      {/* 🚀 UPGRADED SIDEBAR: 100% AUTOMATED & DYNAMIC FROM CLOUD DATA STREAMS */}
      <aside className="hidden md:block bg-white p-5 rounded-2xl border border-gray-200 shadow-sm h-fit space-y-6 text-sm font-bold text-gray-700">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider border-b pb-2">வகைப்பாடு வடிகட்டி</h3>
        
        {/* Dynamic Category Group */}
        <div className="space-y-2">
          <span className="block text-xs font-black text-gray-900">ஆடை வகைகள்</span>
          
          {/* Static Reset All Option Button */}
          <label className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-sky-600 transition">
            <input 
              type="radio" 
              name="asideCategory"
              checked={selectedCategory === 'ALL'} 
              onChange={() => setSelectedCategory('ALL')} 
              className="text-sky-600 focus:ring-sky-500 w-4 h-4" 
            />
            <span>அனைத்தும்</span>
          </label>

          {/* 🆕 THE AUTOMATIC LOOP: Generates new filtering checkmarks instantly for any added items! */}
          {categories.map((cat) => {
            const currentMapKey = getCategoryKey(cat.name);
            return (
              <label key={cat._id || cat.id} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-sky-600 transition">
                <input 
                  type="radio" 
                  name="asideCategory"
                  checked={selectedCategory === currentMapKey} 
                  onChange={() => setSelectedCategory(currentMapKey)} 
                  className="text-sky-600 focus:ring-sky-500 w-4 h-4" 
                />
                <span className="capitalize">{cat.name}</span>
              </label>
            );
          })}
        </div>
        <div className="space-y-2 pt-3 border-t">
          <span className="block text-xs font-black text-gray-900">விலை வரம்பு</span>
          {[['ALL', 'அனைத்து விலைகளும்'], ['under200', '₹200-க்கு கீழ்'], ['200-500', '₹200 - ₹500 வரை'], ['above500', '₹500-க்கு மேல்']].map(([val, label]) => (
            <label key={val} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-sky-600 transition">
              <input type="radio" checked={selectedPriceRange === val} onChange={() => setSelectedPriceRange(val)} className="text-sky-600 focus:ring-sky-500 w-4 h-4" />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </aside>

      {/* 2. MAIN PRODUCTS CARD DISPLAY GRID */}
      <div className="md:col-span-3 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide border-l-4 border-sky-600 pl-2">
            பொட்டிக் ஆடைப் பட்டியல் ({filteredProducts.length} ஆடைகள் உள்ளன)
          </h3>
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 bg-white border rounded-lg text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" /> Filters
          </button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
            {[1, 2, 3, 4, 5, 6].map((pId) => (
              <div key={pId} className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col justify-between animate-pulse">
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                </div>
                <div className="mt-3 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2.5 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-y-2.5 pt-2">
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded-lg w-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-6 text-gray-400">
            <span className="text-3xl">🔍</span>
            <p className="font-semibold text-sm mt-2">No matching unique pieces found.</p>
            <p className="text-xs text-gray-400 mt-1">Try resetting or broadening your filters!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredProducts.map((product) => {
              const isSoldOut = product.status === 'Sold_Out';
              const originalPrice = product.originalPrice || Math.round(product.price * 1.4);
              const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

              return (
                <div key={product._id || product.id} className="bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between p-0 relative group hover:shadow-md transition duration-200">
                  
                  {/* IMAGE HOVER TRIGGER PORT */}
                  <div 
                    onClick={() => { setSelectedProduct(product); setActiveImgIndex(0); }}
                    className={`relative aspect-[3/4] bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-t-[23px] overflow-hidden flex items-center justify-center cursor-pointer shadow-inner ${isSoldOut ? 'opacity-80' : ''}`}
                  >
                    <button onClick={(e) => e.stopPropagation()} className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-400 hover:text-red-500 shadow-sm z-10 transition duration-150 hover:scale-105 active:scale-95">
                      <Heart className="w-4 h-4" />
                    </button>
                    
                    {product.image_url && !imgErrors[product._id || product.id] ? (
                      <img 
                        src={`${BASE_URL}${product.image_url}`} 
                        alt={product.title} 
                        loading="lazy"
                        className="w-full h-full object-cover animate-fade-in group-hover:scale-105 transition duration-200" 
                        onError={() => setImgErrors(prev => ({ ...prev, [product._id || product.id]: true }))}
                      />
                    ) : (
                      <span className="text-5xl filter drop-shadow-sm group-hover:scale-105 transition duration-200">
                        {product.price === 150 ? '👚' : '👗'}
                      </span>
                    )}

                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center z-10">
                        <span className="bg-red-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg rotate-12 shadow-md">விற்றுவிட்டது</span>
                      </div>
                    )}
                  </div>

                  {/* CARD LABELS METRICS INFO */}
                  <div className="p-4 pt-3 flex-1 flex flex-col justify-between">
                    <div onClick={() => { setSelectedProduct(product); setActiveImgIndex(0); }} className="cursor-pointer space-y-1.5">
                      <h4 className="text-xs sm:text-sm font-bold text-gray-800 line-clamp-1 hover:text-sky-600 transition-colors capitalize leading-snug">{product.title}</h4>
                      
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-bold bg-slate-50 px-2 py-1 rounded-md border border-slate-100 w-fit">
                        <span>அளவு (Size):</span>
                        <span className="text-sky-600 font-black ml-1.5 text-xs">{product.size}</span>
                      </div>
                      
                      <div className="flex items-baseline gap-2 pt-1 flex-wrap">
                        <span className="text-base font-extrabold text-gray-950">₹{product.price}</span>
                        <span className="text-xs text-gray-400 line-through font-medium">₹{originalPrice}</span>
                        <span className="text-xs text-red-600 font-black font-mono">{discountPercent}% OFF</span>
                      </div>
                    </div>

                    {/* DUAL ACTION SWITCH STRIP ROW BUTTONS (FLIPKART STYLE) */}
                    <div className="grid grid-cols-1 gap-1.5 pt-3">
                      <button 
                        disabled={isSoldOut}
                        onClick={() => onAddToCart(product)}
                        className="w-full py-2.5 bg-white border border-sky-600 text-sky-700 text-xs font-bold rounded-xl uppercase transition hover:bg-sky-50 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transform duration-150"
                      >
                        கார்ட்டில் சேர்க்க
                      </button>
                      <button 
                        disabled={isSoldOut}
                        onClick={() => onBuyNow(product)} // Instant checkout pipeline bypass trigger
                        className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-xl uppercase tracking-wide flex items-center justify-center gap-1 shadow-md hover:from-orange-600 disabled:opacity-40 active:scale-95 transform duration-150"
                      >
                        <Zap className="w-3.5 h-3.5 fill-white text-orange-500 border-none" /> உடனே வாங்க
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* --- 👑 AMAZON/FLIPKART STYLE NATIVE FULL-SCREEN RESPONSIVE MODAL OVERLAY --- */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center sm:p-6 animate-fade-in backdrop-blur-[2px]" 
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white w-full h-full sm:h-auto sm:max-w-4xl border border-gray-100 p-4 sm:p-6 space-y-4 text-xs font-bold text-gray-700 mx-auto animate-scale-up overflow-y-auto fixed inset-0 sm:relative sm:rounded-3xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Container wrapper block to separate header elements */}
            <div className="space-y-4 flex-1">
              
              {/* Modal Exit Header Bar Banner (Taller Padding on Mobile for Thumb Access) */}
              <div className="flex justify-between items-center border-b pb-3 pt-2 sm:pt-0">
                <span className="text-[10px] font-black tracking-widest text-sky-700 uppercase bg-sky-50 px-2.5 py-1 rounded-md border border-sky-100">
                  பிஜி கலெக்ஷன் பொட்டிக் • ஆடை விவரம்
                </span>
                <button 
                  onClick={() => setSelectedProduct(null)} 
                  aria-label="நெருக்கமான (Close)"
                  className="p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition active:scale-90"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* RESPONSIVE 2-COLUMN SPLIT GRID LAYOUT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 items-start pt-1">
                
                {/* ==================== LEFT COLUMN: IMAGE DISPLAY STAGE & THUMBNAILS ==================== */}
                <div className="space-y-4 w-full">
                  
                  {/* Main Portrait Swipe Frame Stage */}
                  <div className="relative aspect-square bg-gray-50 border border-gray-200 rounded-2xl overflow-hidden flex items-center justify-center text-8xl select-none group shadow-inner">
                    {getProductImageGallery(selectedProduct)[activeImgIndex]?.url && !imgErrors[`${selectedProduct._id || selectedProduct.id}-${activeImgIndex}`] ? (
                      <img 
                        src={`${BASE_URL}${getProductImageGallery(selectedProduct)[activeImgIndex].url}`} 
                        alt={selectedProduct.title} 
                        className="w-full h-full object-contain transition duration-300 transform group-hover:scale-105 animate-fade-in" 
                        onError={() => setImgErrors(prev => ({ ...prev, [`${selectedProduct._id || selectedProduct.id}-${activeImgIndex}`]: true }))}
                      />
                    ) : (
                      <span className="filter drop-shadow-md">
                        {getProductImageGallery(selectedProduct)[activeImgIndex]?.view || '👗'}
                      </span>
                    )}

                    {/* Lightbox Zoom Indicator Trigger */}
                    <button onClick={() => setIsZoomOpen(true)} aria-label="முழுத்திரை பெரிதாக்கு (Zoom Fullscreen)" className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-xl shadow-md"><Maximize2 className="w-4 h-4 text-gray-700" /></button>

                    {/* Slider Arrow Navigation Controls */}
                    <button disabled={activeImgIndex === 0 || getProductImageGallery(selectedProduct).length <= 1} onClick={() => setActiveImgIndex(p => p - 1)} aria-label="முந்தைய படம் (Previous Image)" className="absolute left-2 p-1.5 bg-white rounded-full text-gray-800 disabled:opacity-20 shadow"><ChevronLeft className="w-4 h-4" /></button>
                    <button disabled={activeImgIndex >= getProductImageGallery(selectedProduct).length - 1 || getProductImageGallery(selectedProduct).length <= 1} onClick={() => setActiveImgIndex(p => p + 1)} aria-label="அடுத்த படம் (Next Image)" className="absolute right-2 p-1.5 bg-white rounded-full text-gray-800 disabled:opacity-20 shadow"><ChevronRight className="w-4 h-4" /></button>
 
                    <span className="absolute bottom-3 right-4 bg-black bg-opacity-70 text-white font-mono text-[10px] px-2.5 py-0.5 rounded-md font-black">
                      {activeImgIndex + 1} / {getProductImageGallery(selectedProduct).length} வியூஸ்
                    </span>
                  </div>
 
                  {/* Thumbnail Selection Buttons Row (Fully Standard Labels System) */}
                  {getProductImageGallery(selectedProduct).length > 1 && (
                    <div className="grid grid-cols-3 gap-3">
                      {getProductImageGallery(selectedProduct).map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setActiveImgIndex(idx)}
                          className={`border-2 p-2 rounded-xl flex flex-col items-center justify-center transition-all ${
                            activeImgIndex === idx 
                              ? 'border-sky-600 bg-sky-50 ring-1 ring-sky-500 shadow-sm' 
                              : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          {img.url ? (
                            <img src={`${BASE_URL}${img.url}`} alt={img.id} className="w-8 h-8 object-cover rounded-md" />
                          ) : (
                            <span className="text-xl">{img.view}</span>
                          )}
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-wide block mt-1 leading-none">
                            {img.id === 'FRONT' ? 'FRONT' : img.id === 'BACK' ? 'BACK' : img.id === 'MEASURE' ? 'MEASURE' : `VIEW ${idx + 1}`}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
 
                  {/* Dynamic Current Display View Indicator Status Bar */}
                  {getProductImageGallery(selectedProduct).length > 1 && (
                    <div className="bg-sky-50 border border-sky-100 py-2 px-3 rounded-xl text-center text-[10px] font-black text-sky-800 uppercase tracking-wide shadow-sm">
                      👀 தற்போதைய பார்வை: {getProductImageGallery(selectedProduct)[activeImgIndex]?.label}
                    </div>
                  )}
                </div>

                {/* ==================== RIGHT COLUMN: SPECS, PRICING, & DESCRIPTIONS ==================== */}
                <div className="space-y-4 w-full text-left">
                  
                  <div className="space-y-1.5 border-b pb-3">
                    <h3 className="text-base sm:text-lg font-black text-gray-900 capitalize tracking-tight leading-tight">
                      {selectedProduct.title}
                    </h3>
                    {(() => {
                      const hasFabric = selectedProduct.fabricType && 
                        selectedProduct.fabricType.trim() !== '' && 
                        selectedProduct.fabricType !== 'உயர்தர தூய பருத்தி (Premium Export Cotton Pure Canvas Quality)';

                      const hasStitching = selectedProduct.stitchingQuality && 
                        selectedProduct.stitchingQuality.trim() !== '' && 
                        selectedProduct.stitchingQuality !== 'கச்சிதமான இன்டர்லாக் தையல்களுடன் கூடிய மிக நேர்த்தியான ஹோம் பினிஷிங்';

                      const hasGuarantee = selectedProduct.guaranteeNote && 
                        selectedProduct.guaranteeNote.trim() !== '' && 
                        selectedProduct.guaranteeNote !== 'இது ஒரு பிரத்யேக சிங்கிள்-பீஸ் ஆடை மட்டுமே! சேலத்தில் வேறு எங்கும் கிடைக்காது';

                      if (!hasFabric && !hasStitching && !hasGuarantee) return null;

                      return (
                        <div className="space-y-2 animate-fade-in">
                          <span className="block text-[10px] uppercase text-gray-400 tracking-wider font-extrabold">
                            ஆடை தையல் விவரக்குறிப்பு
                          </span>
                          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 text-xs text-gray-600 font-semibold space-y-2.5 leading-relaxed shadow-inner">
                            {hasFabric && (
                              <p className="flex items-start gap-2">
                                <span className="text-sm leading-none">✨</span>
                                <span>
                                  <strong>ஆடை துணி வகை:</strong>{' '}
                                  {selectedProduct.fabricType}
                                </span>
                              </p>
                            )}
                            {hasStitching && (
                              <p className="flex items-start gap-2">
                                <span className="text-sm leading-none">🪡</span>
                                <span>
                                  <strong>தையல் வேலைப்பாடு:</strong>{' '}
                                  {selectedProduct.stitchingQuality}
                                </span>
                              </p>
                            )}
                            {hasGuarantee && (
                              <p className="flex items-start gap-2">
                                <span className="text-sm leading-none">💥</span>
                                <span>
                                  <strong>தனித்துவ உத்திரவாதம்:</strong>{' '}
                                  {selectedProduct.guaranteeNote}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-3 flex flex-row items-center justify-between">
                    <div className="text-left">
                      <span className="block text-[9px] uppercase font-black text-gray-400 tracking-wider">மொத்த தள்ளுபடி விலை</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-xl font-black text-gray-950 tracking-tight">₹{selectedProduct.price}</span>
                        <span className="text-xs text-gray-400 line-through font-bold">₹{Math.round(selectedProduct.price * 1.4)}</span>
                      </div>
                    </div>
                    <div className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-1 uppercase">
                      ✓ 29% தள்ளுபடி
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* --- BOTTOM STICKY FLOATING ACTION BUTTONS ROW (IMMERSIVE MOBILE EXPERIENCE) --- */}
            <div className="sticky bottom-0 bg-white z-20 border-t pt-3 pb-3 -mx-4 -mb-4 px-4 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-5 sm:rounded-b-[24px] shadow-[0_-8px_24px_rgba(15,23,42,0.06)] mt-auto select-none">
              <div className="grid grid-cols-2 gap-3 pb-2 sm:pb-0">
                <button
                  disabled={selectedProduct.status === 'Sold_Out'}
                  onClick={() => { onAddToCart(selectedProduct); setSelectedProduct(null); }}
                  className="py-3.5 bg-white border-2 border-sky-600 hover:bg-sky-50 text-sky-700 font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <ShoppingCart className="w-4 h-4" /> கார்ட்டில் சேர்க்க
                </button>
                <button
                  disabled={selectedProduct.status === 'Sold_Out'}
                  onClick={() => { onBuyNow(selectedProduct); setSelectedProduct(null); }}
                  className="py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 text-white font-black text-xs uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-md transition transform active:scale-95 animate-pulse-subtle"
                >
                  <Zap className="w-4 h-4 fill-white text-orange-500 border-none" /> உடனே வாங்க
                </button>
              </div>
              
              {/* Support seal anchor tracking description */}
              <div className="text-[9px] text-gray-400 font-black flex items-center gap-1 justify-center pt-2 select-none">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> 
                <span>இன்ஸ்பெக்ட் செய்யப்பட்டு சான்றளிக்கப்பட்டது — சேலம் பிஜி கலெக்ஷன் ஹப்</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* LIGHTBOX FULL SCREEN ZOOM ACCENT MODAL */}
      {isZoomOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex flex-col items-center justify-center p-4" onClick={() => setIsZoomOpen(false)}>
          <button onClick={() => setIsZoomOpen(false)} aria-label="நெருக்கமான (Close)" className="absolute top-4 right-4 p-2 bg-white bg-opacity-10 text-white rounded-full hover:bg-opacity-20 transition">
            <X className="w-6 h-6" />
          </button>
          
          <div className="w-full max-w-lg aspect-square bg-gray-900 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-800">
            {getProductImageGallery(selectedProduct)[activeImgIndex]?.url && !imgErrors[`${selectedProduct._id || selectedProduct.id}-${activeImgIndex}-zoom`] ? (
              <img 
                src={`${BASE_URL}${getProductImageGallery(selectedProduct)[activeImgIndex].url}`} 
                alt={selectedProduct.title} 
                className="w-full h-full object-contain" 
                onError={() => setImgErrors(prev => ({ ...prev, [`${selectedProduct._id || selectedProduct.id}-${activeImgIndex}-zoom`]: true }))}
              />
            ) : (
              <span className="text-[120px] filter drop-shadow-md">
                {getProductImageGallery(selectedProduct)[activeImgIndex]?.view || '👗'}
              </span>
            )}
          </div>
          
          <p className="text-white mt-6 font-bold tracking-wide">
            {getProductImageGallery(selectedProduct)[activeImgIndex].label}
          </p>
        </div>
      )}

      {/* --- MOBILE SMOOTH BOTTOM SHEET OVERLAY SLIDER --- */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-end justify-center md:hidden animate-fade-in" onClick={() => setIsMobileFilterOpen(false)}>
          <div className="w-full bg-white rounded-t-2xl p-5 space-y-6 max-h-[80vh] overflow-y-auto shadow-2xl border-t" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">வகைப்பாடு வடிகட்டி</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 bg-gray-100 rounded-full text-gray-500"><X className="w-4 h-4" /></button>
            </div>
            
            {/* Category Filter */}
            <div className="space-y-3">
              <span className="block text-xs font-black text-gray-400 uppercase tracking-wide">ஆடை வகைகள்</span>
              <div className="flex flex-wrap gap-2">
                {[['ALL', 'அனைத்தும்'], ['150_Tops', '₹150 டாப்ஸ்'], ['Nighties', 'நைட்டிகள்'], ['Gowns', 'கவுன்கள்']].map(([val, label]) => (
                  <button 
                    key={val} 
                    onClick={() => { setSelectedCategory(val); setIsMobileFilterOpen(false); }} 
                    className={`px-3 py-1.5 border text-xs font-bold rounded-lg ${
                      selectedCategory === val ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price options */}
            <div className="space-y-3 pt-3 border-t">
              <span className="block text-xs font-black text-gray-400 uppercase tracking-wide">விலை வரம்பு</span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'அனைத்து விலைகளும்', val: 'ALL' },
                  { label: '₹200-க்கு கீழ்', val: 'under200' },
                  { label: '₹200 - ₹500 வரை', val: '200-500' },
                  { label: '₹500-க்கு மேல்', val: 'above500' }
                ].map(range => (
                  <button 
                    key={range.val} 
                    onClick={() => { setSelectedPriceRange(range.val); setIsMobileFilterOpen(false); }} 
                    className={`px-3 py-1.5 border text-xs font-bold rounded-lg ${
                      selectedPriceRange === range.val ? 'bg-sky-600 text-white border-sky-600 shadow-sm' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

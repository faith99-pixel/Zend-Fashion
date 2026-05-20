/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, Category } from '../types';
import { X, Check, Camera, Image as ImageIcon } from 'lucide-react';

interface AddListingModalProps {
  onClose: () => void;
  onAddListing: (newListing: Omit<Listing, 'id' | 'sellerId' | 'sellerName' | 'sellerUsername' | 'sellerAvatar' | 'sellerRating' | 'sellerSalesCount' | 'sellerVerified' | 'dateAdded' | 'likes' | 'views'>) => void;
}

const STOCK_LOOKBOOK_CHOICES = [
  {
    url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
    label: 'Modern Retro Sneakers'
  },
  {
    url: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    label: 'Black Streetwear Tee'
  },
  {
    url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    label: 'Classic Leather Bag'
  },
  {
    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
    label: 'Vintage Heavy Jeans'
  }
];

export const AddListingModal: React.FC<AddListingModalProps> = ({ onClose, onAddListing }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState<Category>('Tops');
  const [size, setSize] = useState('UK 10 / M');
  const [condition, setCondition] = useState('Like New');
  const [location, setLocation] = useState('Ikeja, Lagos');
  const [description, setDescription] = useState('');
  const [selectedStockImg, setSelectedStockImg] = useState(STOCK_LOOKBOOK_CHOICES[0].url);

  // AI optimizer states
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementStep, setEnhancementStep] = useState('');
  const [isEnhanced, setIsEnhanced] = useState(false);

  const handleEnhanceWithAI = () => {
    setIsEnhancing(true);
    setIsEnhanced(false);
    
    const steps = [
      '🔍 Analyzing backdrop and focal depth...',
      '✂️ Isolating garment fibers & removing backgrounds...',
      '💡 Configuring dual soft-box overhead lighting...',
      '✨ Re-rendering with high-fidelity studio textures...'
    ];

    let currentStep = 0;
    setEnhancementStep(steps[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setEnhancementStep(steps[currentStep]);
      } else {
        clearInterval(interval);
        setIsEnhancing(false);
        setIsEnhanced(true);
      }
    }, 550);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedPrice = parseInt(price, 10);
    const parsedOriginalPrice = parseInt(originalPrice, 10) || parsedPrice * 2.5;

    if (!title.trim()) {
      alert('Please enter a listing title.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      alert('Please enter a valid listing price.');
      return;
    }

    // append stylized prefix description if enhanced
    const finalDescription = isEnhanced
      ? `✨ Verified [AI Studio Shot Optimized] background-free listing.\n\n${description.trim() || `Authentic pre-loved ${title.toLowerCase()} in premium shape. Dry-cleaned and ready for shipping.`}`
      : description.trim() || `Authentic pre-loved ${title.toLowerCase()} in premium shape. Dry-cleaned and ready for shipping.`;

    onAddListing({
      title: title.trim(),
      price: parsedPrice,
      originalPrice: parsedOriginalPrice,
      description: finalDescription,
      images: [selectedStockImg],
      category,
      size,
      condition,
      location,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-xs animate-fadeIn font-sans text-xs">
      <div className="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* Header bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100 mb-4">
          <div>
            <h3 className="font-serif font-bold text-base text-dark-charcoal">Sell Premium Wardrobe Item</h3>
            <p className="text-[9px] text-zinc-400 font-sans mt-0.5">List and secure with Zend Escrow Assurance</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 rounded-full text-zinc-400 hover:text-dark-charcoal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Cover Selector */}
          <div>
            <label className="block text-zinc-500 font-semibold mb-2">Select Lookbook Aesthetic Image</label>
            <div className="grid grid-cols-4 gap-2">
              {STOCK_LOOKBOOK_CHOICES.map((img) => {
                const isSelected = img.url === selectedStockImg;
                return (
                  <div
                    key={img.url}
                    onClick={() => {
                      setSelectedStockImg(img.url);
                      setIsEnhanced(false); // Reset optimization if image changes
                    }}
                    className={`aspect-square rounded-lg border-2 overflow-hidden cursor-pointer relative ${
                      isSelected ? 'border-primary shadow-xs scale-[1.03]' : 'border-zinc-200'
                    }`}
                  >
                    <img 
                      src={img.url} 
                      alt={img.label} 
                      className={`w-full h-full object-cover transition-all duration-300 ${isEnhanced && isSelected ? 'scale-110 brightness-[1.08] contrast-[1.05]' : ''}`}
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <span className="bg-primary text-white p-0.5 rounded-full">
                          <Check size={8} className="stroke-[3]" />
                        </span>
                      </div>
                    )}
                    {isEnhanced && isSelected && (
                      <div className="absolute bottom-1 right-1 bg-yellow-400 text-neutral-900 px-1 py-0.5 rounded-xs text-[7px] font-bold tracking-wider animate-bounce">
                        AI OPTIMIZED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Interactive AI Instant Photo enhancement */}
            <div className="mt-3.5 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 rounded-xl p-3 border border-purple-100">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] font-bold text-indigo-950 font-serif">ZendStudio™ AI Photo Enhancer</span>
                    <span className="bg-indigo-600 text-[8px] text-white px-1 py-0.2 rounded-full font-bold uppercase scale-90">PRO</span>
                  </div>
                  <p className="text-[9px] text-indigo-700 font-light leading-snug">
                    Instantly strip noisy background clutter, fix lightning, and enhance details to a premium catalog-grade studio shot.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleEnhanceWithAI}
                  disabled={isEnhancing}
                  className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-2.5 py-1.5 font-sans font-bold text-[10px] shadow-sm transform transition duration-100 hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isEnhancing ? 'Tuning...' : 'Enhance Video/Photo ✨'}
                </button>
              </div>

              {/* Loader widget */}
              {isEnhancing && (
                <div className="mt-2.5 pt-2 border-t border-indigo-200/40 animate-pulse text-[9px] font-medium text-indigo-900 flex items-center justify-between">
                  <span>{enhancementStep}</span>
                  <span className="h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
                </div>
              )}

              {isEnhanced && (
                <div className="mt-2.5 pt-2 border-t border-indigo-200/40 text-[9px] text-emerald-800 font-semibold flex items-center gap-1.5 animate-fadeIn">
                  <span>✨ Studio quality achieved! background removed and soft overhead shadows added back dynamically.</span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-zinc-500 font-semibold mb-1">Garment Or Label Name</label>
            <input
              type="text"
              required
              maxLength={40}
              placeholder="e.g. Vintage Silk Slip Dress"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none font-sans"
            />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-500 font-semibold mb-1">Your Selling Price (₦)</label>
              <input
                type="text"
                required
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="25000"
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none font-sans"
              />
            </div>
            <div>
              <label className="block text-zinc-500 font-semibold mb-1">Original Price (₦)</label>
              <input
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                placeholder="60000"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none font-sans"
              />
            </div>
          </div>

          {/* Grid fields for Category, size, location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-500 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none"
              >
                <option value="Tops">Tops 👕</option>
                <option value="Bags">Bags 👜</option>
                <option value="Shoes">Shoes 👟</option>
                <option value="Bottoms">Bottoms 👖</option>
                <option value="Dresses">Dresses 👗</option>
                <option value="Accessories">Accessories 🕶️</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-500 font-semibold mb-1">Garment Size</label>
              <input
                type="text"
                required
                placeholder="e.g. UK 10 / M"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none font-sans"
              />
            </div>
          </div>

          {/* Condition and Dispatch Origin */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-500 font-semibold mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal"
              >
                <option value="New with tags">New with tags 🏷️</option>
                <option value="Like New">Like New ✨</option>
                <option value="Gently Used">Gently Used 👌</option>
                <option value="Fair">Fair 👗</option>
              </select>
            </div>
            <div>
              <label className="block text-zinc-500 font-semibold mb-1">Dispatch State / Origin</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal"
              >
                <option value="Ikeja, Lagos">Ikeja, Lagos</option>
                <option value="Lekki, Lagos">Lekki, Lagos</option>
                <option value="Lagos Island, Lagos">Lagos Island, Lagos</option>
                <option value="Wuse II, Abuja">Wuse II, Abuja</option>
                <option value="Port Harcourt, Rivers">Port Harcourt, Rivers</option>
                <option value="Surulere, Lagos">Surulere, Lagos</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-zinc-500 font-semibold mb-1">Notes / Fabric details</label>
            <textarea
              rows={2}
              placeholder="e.g. Silk composition, pristine vintage item, worn once for a shoot."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2 text-xs text-dark-charcoal outline-none font-sans resize-none"
            />
          </div>

          {/* Active List Trigger button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary text-white hover:brightness-110 py-3.5 rounded-xl font-sans font-bold text-xs cursor-pointer text-center transition-all select-none duration-150 active:scale-95 shadow-sm"
            >
              Expose on Zend Market
            </button>
            <p className="text-[9px] text-zinc-400 text-center font-sans mt-2">
              All uploads are subject to physical review at Zend central sorting before shipping.
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

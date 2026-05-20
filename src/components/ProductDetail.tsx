/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, Seller } from '../types';
import { ArrowLeft, Heart, ShieldCheck, MapPin, Tag, Star, Calendar, MessageSquare, ShoppingBag } from 'lucide-react';

interface ProductDetailProps {
  listing: Listing;
  onBack: () => void;
  onSelectSeller: (sellerId: string) => void;
  onBuyNow: (listing: Listing) => void;
  onMakeOffer: (listing: Listing) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  listing,
  onBack,
  onSelectSeller,
  onBuyNow,
  onMakeOffer,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(listing.likes > 50);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDiscountPercent = () => {
    const diff = listing.originalPrice - listing.price;
    const ratio = diff / listing.originalPrice;
    return Math.round(ratio * 100);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Detail Sticky Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-zinc-50 active:scale-90 transition-all text-dark-charcoal"
        >
          <ArrowLeft size={20} className="stroke-[2.5]" />
        </button>
        <span className="font-serif font-semibold text-sm text-dark-charcoal">Curated Detail</span>
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="p-2 -mr-2 rounded-full hover:bg-zinc-50 transition-all text-dark-charcoal"
        >
          <Heart 
            size={20} 
            className={`transition-all ${isLiked ? 'fill-rose-500 stroke-rose-500 scale-110' : 'stroke-dark-charcoal'}`} 
          />
        </button>
      </div>

      {/* Main detail content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Swiper / Images Row */}
        <div className="relative w-full aspect-[4/5] bg-zinc-50 border-b border-zinc-100">
          <img 
            src={listing.images[activeImageIndex]} 
            alt={listing.title} 
            className="w-full h-full object-cover object-top filter contrast-[1.02]"
            referrerPolicy="no-referrer"
          />

          {/* Multiple Image Thumbs Row */}
          {listing.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-xs">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    idx === activeImageIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Short info indicators */}
        <div className="px-5 pt-5 pb-1 flex flex-wrap gap-2">
          <span className="text-[10px] uppercase font-sans font-medium tracking-wider bg-primary-soft text-primary px-2.5 py-1 rounded-sm">
            {listing.category}
          </span>
          <span className="text-[10px] uppercase font-sans font-medium tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-sm">
            Condition: {listing.condition}
          </span>
          <span className="text-[10px] uppercase font-sans font-medium tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-1 rounded-sm">
            Size: {listing.size}
          </span>
        </div>

        {/* Listing Titles and Pricing */}
        <div className="px-5 pt-3 pb-4">
          <h1 className="text-xl font-serif text-dark-charcoal font-bold leading-tight mb-2">
            {listing.title}
          </h1>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-2xl font-sans font-extrabold text-primary">
              {formatNaira(listing.price)}
            </span>
            <span className="text-sm font-sans text-zinc-400 line-through">
              {formatNaira(listing.originalPrice)}
            </span>
            <span className="text-[11px] font-sans font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs">
              Save {calculateDiscountPercent()}%
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-soft-clay font-medium pb-4 border-b border-zinc-100">
            <MapPin size={13} className="text-primary-light" />
            <span>Ships in Nigeria from {listing.location}</span>
          </div>
        </div>

        {/* Seller Info Drawer Block */}
        <div className="px-5 py-4 border-b border-zinc-100 bg-offwhite-bg/40">
          <div className="flex items-center justify-between">
            <div 
              onClick={() => onSelectSeller(listing.sellerId)}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative">
                <img 
                  src={listing.sellerAvatar} 
                  alt={listing.sellerName} 
                  className="w-12 h-12 rounded-full object-cover border border-zinc-200"
                  referrerPolicy="no-referrer"
                />
                {listing.sellerVerified && (
                  <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-600 text-white rounded-full p-0.5 border border-white">
                    <ShieldCheck size={10} className="fill-white text-emerald-600" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-sans font-bold text-dark-charcoal group-hover:text-primary leading-snug">
                    {listing.sellerName}
                  </span>
                  {listing.sellerVerified && (
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded-xs font-sans font-semibold border border-emerald-100 uppercase">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-sans text-zinc-400">@{listing.sellerUsername}</span>
                  <span className="text-zinc-300 text-[10px]">•</span>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star size={10} className="fill-amber-500 stroke-amber-500" />
                    <span className="text-[10px] font-sans font-bold text-zinc-600">{listing.sellerRating}</span>
                  </div>
                  <span className="text-zinc-300 text-[10px]">•</span>
                  <span className="text-[10px] font-sans text-zinc-500">{listing.sellerSalesCount} sales</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onSelectSeller(listing.sellerId)}
              className="border border-zinc-200 hover:border-primary text-primary hover:bg-primary-soft text-[10px] font-sans font-semibold px-3 py-1.5 rounded-lg transition-all"
            >
              View Wardrobe
            </button>
          </div>
        </div>

        {/* Specification Grid */}
        <div className="px-5 py-4 border-b border-zinc-100">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-soft-clay mb-3">Item Specifics</h3>
          <div className="grid grid-cols-2 gap-y-3 gap-x-6">
            <div className="flex items-center gap-2">
              <Tag size={13} className="text-soft-clay" />
              <div>
                <div className="text-[9px] uppercase tracking-wide text-zinc-400 font-medium">Condition</div>
                <div className="text-xs font-sans text-dark-charcoal font-semibold">{listing.condition}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star size={13} className="text-soft-clay" />
              <div>
                <div className="text-[9px] uppercase tracking-wide text-zinc-400 font-medium">Authenticity</div>
                <div className="text-xs font-sans text-emerald-700 font-semibold flex items-center gap-0.5">
                  🛡️ Zend Passed
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={13} className="text-soft-clay" />
              <div>
                <div className="text-[9px] uppercase tracking-wide text-zinc-400 font-medium">Listed Date</div>
                <div className="text-xs font-sans text-dark-charcoal font-semibold">{listing.dateAdded}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ShoppingBag size={13} className="text-soft-clay" />
              <div>
                <div className="text-[9px] uppercase tracking-wide text-zinc-400 font-medium">Courier Deliver</div>
                <div className="text-xs font-sans text-dark-charcoal font-semibold">2 - 3 working days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Long Description and Transparency Manifesto */}
        <div className="px-5 py-4">
          <h3 className="text-xs uppercase tracking-wider font-semibold text-soft-clay mb-2">Editor’s Notes</h3>
          <p className="text-xs text-soft-clay leading-relaxed font-sans font-light">
            {listing.description}
          </p>
          
          {/* Transparency Card */}
          <div className="bg-primary-soft/80 border border-primary-soft p-4 rounded-xl mt-6 relative overflow-hidden">
            <div className="relative z-10 flex gap-2.5">
              <span className="text-lg">📦</span>
              <div>
                <h4 className="text-[11px] uppercase tracking-wider font-semibold text-primary mb-0.5">Our Authenticity Guarantee</h4>
                <p className="text-[10px] text-zinc-600 font-sans leading-relaxed font-light">
                  All garments go through physical checks at our central Lagos verification hub prior to final delivery. In case of discrepancies, we offer quick total refund payouts directly to your primary bank.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Tab */}
      <div className="px-5 py-4 border-t border-zinc-100 bg-white/95 backdrop-blur-md sticky bottom-0 z-40 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onMakeOffer(listing)}
            className="flex-1 bg-white border border-primary text-primary hover:bg-primary-soft py-3.5 rounded-xl font-sans font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <MessageSquare size={14} className="stroke-[2.5]" /> Make Offer
          </button>
          
          <button 
            onClick={() => onBuyNow(listing)}
            className="flex-1 bg-primary text-white hover:brightness-115 py-3.5 rounded-xl font-sans font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm"
          >
            <ShoppingBag size={14} /> Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

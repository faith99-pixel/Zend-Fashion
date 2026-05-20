/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Seller, Listing } from '../types';
import { ArrowLeft, ShieldCheck, Star, ShoppingBag, MapPin, CheckCircle2, MessageSquare } from 'lucide-react';

interface SellerProfileViewProps {
  seller: Seller;
  listings: Listing[];
  onBack: () => void;
  onSelectListing: (listing: Listing) => void;
  onMessageSeller?: (seller: Seller) => void;
}

export const SellerProfileView: React.FC<SellerProfileViewProps> = ({
  seller,
  listings,
  onBack,
  onSelectListing,
  onMessageSeller,
}) => {
  // Filter listings by this seller
  const sellerListings = listings.filter((item) => item.sellerId === seller.id);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-offwhite-bg">
      {/* Search Bar Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100 bg-white/95 backdrop-blur-md sticky top-0 z-30">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-zinc-50 active:scale-90 transition-all text-dark-charcoal"
        >
          <ArrowLeft size={20} className="stroke-[2.5]" />
        </button>
        <span className="font-serif font-semibold text-sm text-dark-charcoal">Seller Profile</span>
        <div className="w-8 h-8" /> {/* Balance placeholder */}
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile Card Banner */}
        <div className="bg-white px-5 pt-6 pb-6 border-b border-zinc-100 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="relative">
              <img 
                src={seller.avatar} 
                alt={seller.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-soft"
                referrerPolicy="no-referrer"
              />
              {seller.verified && (
                <span className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border border-white shadow-sm">
                  <ShieldCheck size={12} className="fill-white text-emerald-600" />
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="text-base font-sans font-bold text-dark-charcoal">{seller.name}</h2>
                {seller.verified && (
                  <span className="bg-emerald-50 text-emerald-700 text-[8px] font-sans font-semibold border border-emerald-100 uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                    Verified Reseller
                  </span>
                )}
              </div>
              <p className="text-xs font-sans text-zinc-400 mt-0.5">@{seller.username}</p>

              {/* Badges/Ratings */}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50/50 px-2 py-0.5 rounded-sm border border-amber-100/50">
                  <Star size={10} className="fill-amber-500 stroke-amber-500" />
                  <span className="text-[10px] font-sans font-bold text-zinc-700">{seller.rating}</span>
                </div>
                <span className="text-zinc-300 text-xs">•</span>
                <span className="text-[10px] font-sans font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-sm">
                  {seller.salesCount} Sales
                </span>
                <span className="text-zinc-300 text-xs">•</span>
                <span className="text-[10px] font-sans font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-sm">
                  {seller.location.split(',')[0]}
                </span>
              </div>
            </div>
          </div>

          {/* Biography Block */}
          <div className="mt-4 pt-4 border-t border-zinc-50">
            <p className="text-xs text-soft-clay leading-relaxed font-sans font-light">
              {seller.bio}
            </p>
            <div className="mt-3.5 flex items-center gap-2 text-[11px] font-sans text-zinc-400">
              <CheckCircle2 size={12} className="text-emerald-500" />
              <span>Response: {seller.responseRate}</span>
              <span className="text-zinc-200">|</span>
              <MapPin size={12} className="text-zinc-400" />
              <span>Ships from {seller.location}</span>
            </div>
          </div>

          {/* Message seller button */}
          {onMessageSeller && seller.id !== 'me' && (
            <div className="mt-4 pt-2">
              <button
                onClick={() => onMessageSeller(seller)}
                className="w-full bg-primary-soft hover:bg-primary-soft/90 text-primary border border-primary/10 rounded-xl py-2.5 text-xs font-sans font-semibold flex items-center justify-center gap-1.5 transition-all outline-none"
              >
                <MessageSquare size={13} className="stroke-[2.5]" /> Chat with {seller.name.split(' ')[0]}
              </button>
            </div>
          )}
        </div>

        {/* Catalog segment */}
        <div className="px-5 py-4">
          <div className="flex items-center gap-1.5 mb-4">
            <ShoppingBag size={14} className="text-primary-light" />
            <h3 className="text-xs uppercase tracking-wider font-semibold text-zinc-500">
              Active Listings ({sellerListings.length})
            </h3>
          </div>

          {sellerListings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-zinc-200">
              <p className="text-xs font-sans text-soft-clay font-medium">Currently no items listed for sale.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {sellerListings.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onSelectListing(item)}
                  className="bg-white rounded-xl overflow-hidden border border-zinc-100 shadow-xs cursor-pointer hover:border-primary-light group transition-all"
                >
                  <div className="aspect-square w-full bg-zinc-50 relative overflow-hidden">
                    <img 
                      src={item.images[0]} 
                      alt={item.title} 
                      className="w-full h-full object-cover object-top transition-transform duration-200 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-xs text-white text-[9px] px-1.5 py-0.5 rounded-sm font-sans">
                      {item.condition}
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="text-[9px] font-sans text-zinc-400 mb-0.5">Size {item.size}</div>
                    <div className="text-xs font-sans font-bold text-dark-charcoal truncate mb-1 group-hover:text-primary">
                      {item.title}
                    </div>
                    <div className="text-xs font-sans font-bold text-primary">{formatNaira(item.price)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

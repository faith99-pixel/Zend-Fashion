/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, Category } from '../types';
import { Search, Heart, Sparkles, MapPin, Plus, TrendingUp, SlidersHorizontal } from 'lucide-react';

interface HomepageProps {
  listings: Listing[];
  onSelectListing: (listing: Listing) => void;
  onOpenAddListing: () => void;
}

const CATEGORIES: { name: Category; count: number; icon: string }[] = [
  { name: 'Tops', count: 124, icon: '👕' },
  { name: 'Bags', count: 85, icon: '👜' },
  { name: 'Shoes', count: 98, icon: '👟' },
  { name: 'Bottoms', count: 142, icon: '👖' },
  { name: 'Dresses', count: 64, icon: '👗' },
  { name: 'Accessories', count: 73, icon: '🕶️' },
];

export const Homepage: React.FC<HomepageProps> = ({ listings, onSelectListing, onOpenAddListing }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'priceLowHigh' | 'priceHighLow' | 'popular'>('default');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Search Logic
  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    if (sortBy === 'priceLowHigh') return a.price - b.price;
    if (sortBy === 'priceHighLow') return b.price - a.price;
    if (sortBy === 'popular') return b.likes - a.likes;
    return 0; // default (recent/order)
  });

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
      {/* Editorial Banner Section */}
      <div className="px-5 pt-4 pb-2">
        <div className="relative bg-primary text-white p-6 rounded-2xl overflow-hidden editorial-shadow">
          <div className="relative z-10 max-w-[70%]">
            <span className="text-[10px] font-sans tracking-wide uppercase bg-white/20 px-2 py-0.5 rounded-full inline-block mb-2 font-medium">
              Zend Curated
            </span>
            <h2 className="text-xl font-serif leading-snug mb-1">The New Standard of Pre-Owned</h2>
            <p className="text-[11px] text-zinc-300 font-sans font-light leading-relaxed mb-3">
              Radical authenticity checks & fast inland logistics from Lagos to nationwide.
            </p>
            <button 
              onClick={onOpenAddListing}
              className="bg-white text-primary text-xs px-3.5 py-1.5 rounded-full font-sans font-semibold flex items-center gap-1 cursor-pointer hover:bg-zinc-100 transition-all active:scale-95 shadow-sm"
            >
              <Plus size={12} className="stroke-[3]" /> List an Item
            </button>
          </div>
          <div className="absolute right-0 bottom-0 top-0 w-[42%] overflow-hidden rounded-r-2xl">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG2ayRXiqQnIlyJF3VjDH1k01Sddju0_ESGON58OWVLm6wAd9lZqkKOkv8SgY3AOeR_BM8QMhvf0e6zG1D8ZOpuZCQzqDloHouLQF8oK7RLDWM8MHFV4FkPJE1tc6hxcBGGG7YRAFkfcmVM030kI1-yavwdZuY6AK2he7qHW0waFCdGkv1-fbDhiLPftpRHZ8z6voyLEUXZUxFtJc2zgtlJ_IE18yoO_scJ7FxL4RGQywL8oWuiS--Guw1kyNQqWj-41qPaSbaVUFC" 
              alt="Vintage Fashion Blazer"
              className="w-full h-full object-cover object-top filter contrast-[1.05]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="px-5 py-2 sticky top-0 bg-offwhite-bg z-20">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-soft-clay w-4 h-4 pointer-events-none" />
            <input 
              type="text" 
              placeholder="Search labels, bags, sneakers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-primary rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none font-sans text-dark-charcoal transition-all placeholder:text-zinc-400 font-normal shadow-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-dark-charcoal uppercase tracking-wider font-semibold"
              >
                clear
              </button>
            )}
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${
              showFilters || sortBy !== 'default' 
                ? 'bg-primary border-primary text-white' 
                : 'bg-white border-zinc-200 text-dark-charcoal hover:border-zinc-300'
            }`}
          >
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Dropdown filters block */}
        {showFilters && (
          <div className="mt-2.5 p-3.5 bg-white rounded-xl border border-zinc-100 shadow-lg flex flex-col gap-2.5 animate-fadeIn">
            <div className="text-[11px] uppercase tracking-wider font-semibold text-soft-clay">
              Sort listings by
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setSortBy('default')}
                className={`py-1.5 px-3 rounded-lg text-xs font-sans font-medium text-left transition-colors ${
                  sortBy === 'default' ? 'bg-primary-soft text-primary font-semibold' : 'hover:bg-zinc-50 text-dark-charcoal'
                }`}
              >
                ✨ Just Landed
              </button>
              <button 
                onClick={() => setSortBy('popular')}
                className={`py-1.5 px-3 rounded-lg text-xs font-sans font-medium text-left transition-colors ${
                  sortBy === 'popular' ? 'bg-primary-soft text-primary font-semibold' : 'hover:bg-zinc-50 text-dark-charcoal'
                }`}
              >
                🔥 High Interest
              </button>
              <button 
                onClick={() => setSortBy('priceLowHigh')}
                className={`py-1.5 px-3 rounded-lg text-xs font-sans font-medium text-left transition-colors ${
                  sortBy === 'priceLowHigh' ? 'bg-primary-soft text-primary font-semibold' : 'hover:bg-zinc-50 text-dark-charcoal'
                }`}
              >
                📈 Price: Low to High
              </button>
              <button 
                onClick={() => setSortBy('priceHighLow')}
                className={`py-1.5 px-3 rounded-lg text-xs font-sans font-medium text-left transition-colors ${
                  sortBy === 'priceHighLow' ? 'bg-primary-soft text-primary font-semibold' : 'hover:bg-zinc-50 text-dark-charcoal'
                }`}
              >
                📉 Price: High to Low
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Horizontal Category Pill Scroll */}
      <div className="py-2.5">
        <div className="flex gap-2 overflow-x-auto px-5 no-scrollbar py-0.5">
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap border transition-all pointer-events-auto cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-primary border-primary text-white font-semibold'
                : 'bg-white border-zinc-200 text-soft-clay hover:border-zinc-300'
            }`}
          >
            All Items
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap border flex items-center gap-1.5 transition-all pointer-events-auto cursor-pointer ${
                selectedCategory === cat.name
                  ? 'bg-primary border-primary text-white font-semibold'
                  : 'bg-white border-zinc-200 text-soft-clay hover:border-zinc-300'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Browse Section */}
      <div className="flex-1 px-5 pb-24 overflow-y-auto">
        {/* Subheader Title */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <div className="flex items-center gap-1.5">
            <Sparkles size={16} className="text-primary-light fill-primary-light" />
            <h3 className="text-base font-serif font-semibold text-dark-charcoal">
              {selectedCategory === 'All' ? 'Trending Collective' : `${selectedCategory} Wardrobes`}
            </h3>
          </div>
          <span className="text-xs font-sans text-soft-clay font-medium">
            {sortedListings.length} {sortedListings.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Empty State */}
        {sortedListings.length === 0 && (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-dashed border-zinc-200">
            <p className="text-sm font-sans text-soft-clay font-semibold mb-2">No listings match your search.</p>
            <p className="text-xs font-sans text-zinc-400 mb-4 max-w-xs mx-auto">
              Our wardrobes in Nigeria update daily. Try adjusting or clearing search details.
            </p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="text-xs font-sans font-semibold text-primary underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 gap-x-3.5 gap-y-5">
          {sortedListings.map((item) => (
            <div 
              key={item.id} 
              onClick={() => onSelectListing(item)}
              className="group flex flex-col bg-white rounded-xl overflow-hidden cursor-pointer border border-zinc-100 editorial-shadow transition-transform duration-200 hover:-translate-y-1 relative"
            >
              <div className="w-full aspect-square bg-zinc-100 relative overflow-hidden">
                <img 
                  src={item.images[0]} 
                  alt={item.title}
                  className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                {/* Badges Overlay */}
                {item.isTrending && (
                  <div className="absolute top-2 left-2 bg-primary/95 text-white font-sans font-medium text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-0.5">
                    <TrendingUp size={8} /> Trending
                  </div>
                )}
                
                <div className="absolute right-2 top-2 bg-black/45 backdrop-blur-xs text-white p-1.5 rounded-full hover:bg-black/60 transition-colors">
                  <Heart size={11} className={`${item.likes > 50 ? 'fill-rose-500 stroke-rose-500' : 'stroke-white'}`} />
                </div>

                <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-xs text-zinc-800 font-sans text-[9px] px-1.5 py-0.5 rounded-sm font-semibold">
                  {item.condition}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-sans text-zinc-400 font-medium">Size: {item.size}</span>
                    <div className="flex items-center gap-0.5 text-[10px] text-zinc-400">
                      <MapPin size={9} className="text-zinc-400" />
                      <span className="truncate max-w-[50px]">{item.location.split(',')[0]}</span>
                    </div>
                  </div>
                  <h4 className="text-xs font-sans text-dark-charcoal font-semibold line-clamp-2 leading-snug mb-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                </div>
                <div>
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm font-sans font-bold text-primary">{formatNaira(item.price)}</span>
                    <span className="text-[10px] font-sans text-zinc-400 line-through">
                      {formatNaira(item.originalPrice)}
                    </span>
                  </div>
                  {/* Miniature Seller Info */}
                  <div className="flex items-center gap-1.5 border-t border-zinc-50 pt-2 mt-2">
                    <div className="w-4 h-4 rounded-full bg-zinc-200 overflow-hidden">
                      <img src={item.sellerAvatar} alt="Seller" className="w-[100%] h-[100%] object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-sans text-zinc-500 truncate">@{item.sellerUsername}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

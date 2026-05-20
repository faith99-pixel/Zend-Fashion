/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Listing, Seller, ChatThread, WalletState, Category, ChatMessage } from './types';
import { 
  MOCK_LISTINGS, 
  MOCK_SELLERS, 
  INITIAL_CHAT_THREADS, 
  INITIAL_WALLET, 
  SELLER_ME 
} from './data';

import { Homepage } from './components/Homepage';
import { ProductDetail } from './components/ProductDetail';
import { SellerProfileView } from './components/SellerProfileView';
import { ChatBargainView } from './components/ChatBargainView';
import { WalletScreen } from './components/WalletScreen';
import { AddListingModal } from './components/AddListingModal';

import { 
  ChevronRight, 
  Check, 
  BookOpen, 
  Flame, 
  Layers, 
  ShieldAlert, 
  Users, 
  Heart, 
  Compass, 
  MessageSquare, 
  PlusSquare, 
  Sparkles,
  Wallet, 
  User, 
  Smartphone,
  Send
} from 'lucide-react';

export default function App() {
  // Mobile app state managers
  const [listings, setListings] = useState<Listing[]>(MOCK_LISTINGS);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_CHAT_THREADS);
  const [wallet, setWallet] = useState<WalletState>(INITIAL_WALLET);
  
  // Navigation states inside mobile shell
  const [currentTab, setCurrentTab] = useState<'feed' | 'messages' | 'wallet' | 'profile'>('feed');
  const [detailListing, setDetailListing] = useState<Listing | null>(null);
  const [detailSeller, setDetailSeller] = useState<Seller | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  
  // Custom Listing and waitlist triggers
  const [showAddListing, setShowAddListing] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(2542);
  const [notification, setNotification] = useState<string | null>(null);
  const [userPersona, setUserPersona] = useState<'buyer' | 'seller'>('buyer');

  // Trigger floating alert
  const triggerNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // 1. Add Listing logic
  const handleAddNewListing = (newItem: Omit<Listing, 'id' | 'sellerId' | 'sellerName' | 'sellerUsername' | 'sellerAvatar' | 'sellerRating' | 'sellerSalesCount' | 'sellerVerified' | 'dateAdded' | 'likes' | 'views'>) => {
    const listingId = `list_${listings.length + 1}`;
    const formattedItem: Listing = {
      ...newItem,
      id: listingId,
      sellerId: SELLER_ME.id,
      sellerName: SELLER_ME.name,
      sellerUsername: SELLER_ME.username,
      sellerAvatar: SELLER_ME.avatar,
      sellerRating: SELLER_ME.rating,
      sellerSalesCount: SELLER_ME.salesCount,
      sellerVerified: SELLER_ME.verified,
      dateAdded: 'Just listed',
      likes: 0,
      views: 1
    };

    setListings([formattedItem, ...listings]);
    triggerNotification(`🎉 "${newItem.title}" was successfully posted to your wardrobe listing grid!`);
    
    // Auto preview listed item
    setDetailListing(formattedItem);
  };

  // 2. Buy Now logic
  const handleBuyNow = (item: Listing) => {
    if (wallet.balance < item.price) {
      triggerNotification(`❌ Insufficient balance to buy instantly. Top up your Zend Wallet first!`);
      return;
    }

    // Deduct and Append transaction row
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - item.price,
      transactions: [
        {
          id: `tx_${Date.now()}`,
          type: 'purchase',
          title: `Bought: ${item.title}`,
          amount: -item.price,
          date: 'Today',
          status: 'completed',
          reference: `ZEND-BUY-${Math.floor(Math.random() * 9000 + 1000)}`
        },
        ...prev.transactions
      ]
    }));

    // Increment seller rating or count in local listings helper
    setListings(prev => prev.map(l => {
      if (l.id === item.id) {
        return { ...l, sellerSalesCount: l.sellerSalesCount + 1 };
      }
      return l;
    }));

    triggerNotification(`📦 Order Lock Successful! ₦${item.price.toLocaleString()} secured in Escrow. Shipping underway!`);
    
    // Switch to wallet screen to confirm
    setCurrentTab('wallet');
    setDetailListing(null);
    setDetailSeller(null);
  };

  // 3. Make Offer (Price negotiation) logic
  const handleMakeOffer = (item: Listing) => {
    // Generate default offer amount (10% discount)
    const suggestedAmt = Math.round(item.price * 0.9);
    
    // Find if chat thread with this seller / listing exists
    const existingThread = threads.find(t => t.listingId === item.id && t.sellerId === item.sellerId);
    
    if (existingThread) {
      setActiveThreadId(existingThread.id);
      setCurrentTab('messages');
      setDetailListing(null);
      setDetailSeller(null);
      return;
    }

    // Create custom new chat session
    const threadId = `chat_${Date.now()}`;
    const newOffer: ChatThread['messages'][0]['offer'] = {
      id: `off_${Date.now()}`,
      amount: suggestedAmt,
      currency: 'NGN',
      status: 'pending',
      listingId: item.id,
      listingTitle: item.title,
      listingImage: item.images[0],
      listingPrice: item.price,
      initiator: 'buyer'
    };

    const newThread: ChatThread = {
      id: threadId,
      listingId: item.id,
      buyerName: SELLER_ME.name,
      sellerId: item.sellerId,
      sellerName: item.sellerName,
      sellerAvatar: item.sellerAvatar,
      lastMessage: `Offered ₦${suggestedAmt.toLocaleString()} for "${item.title.split(' ')[0]}"`,
      lastTimestamp: 'Just now',
      unreadCount: 0,
      messages: [
        {
          id: `msg_init_${Date.now()}`,
          senderId: 'buyer',
          senderName: SELLER_ME.name,
          text: `Hello ${item.sellerName.split(' ')[0]}! I really love this piece of yours. Can we lock a bargain deal at ₦${suggestedAmt.toLocaleString()}?`,
          timestamp: 'Just now'
        },
        {
          id: `msg_off_${Date.now()}`,
          senderId: 'buyer',
          senderName: SELLER_ME.name,
          offer: newOffer,
          timestamp: 'Just now'
        }
      ]
    };

    setThreads([newThread, ...threads]);
    setActiveThreadId(threadId);
    setCurrentTab('messages');
    setDetailListing(null);
    setDetailSeller(null);
    triggerNotification(`🤝 Bargain ticket submitted! Negotiating ₦${suggestedAmt.toLocaleString()} with ${item.sellerName.split(' ')[0]}`);
  };

  // 4. Send Message inside chat thread
  const handleSendMessage = (threadId: string, text: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const newMsg: ChatMessage = {
          id: `msg_${Date.now()}`,
          senderId: 'buyer',
          senderName: SELLER_ME.name,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        return {
          ...t,
          lastMessage: text,
          lastTimestamp: 'Just now',
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));
  };

  // 5. Update Offer Status (Accept / Counter / Decline)
  const handleUpdateOffer = (threadId: string, offerId: string, status: 'accepted' | 'declined' | 'countered', counterAmount?: number) => {
    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        const updatedMessages = t.messages.map(m => {
          if (m.offer && m.offer.id === offerId) {
            return {
              ...m,
              offer: {
                ...m.offer,
                status,
                counterAmount
              }
            };
          }
          return m;
        });

        let systemLogText = '';
        if (status === 'accepted') {
          systemLogText = 'Offer Accepted! Secure checkout processed.';
        } else if (status === 'declined') {
          systemLogText = 'Offer declined.';
        } else if (status === 'countered' && counterAmount) {
          systemLogText = `Counter offered ₦${counterAmount.toLocaleString()}`;
        }

        // Add automated bot responder simulation to make negotiations feel live!
        const autoMsg: ChatMessage = {
          id: `msg_sys_${Date.now()}`,
          senderId: 'seller',
          senderName: t.sellerName,
          text: status === 'accepted' 
            ? `That sounds absolutely amazing, Zoe! Payout of ₦${m_amount(updatedMessages, offerId).toLocaleString()} has logged successfully inside your Zen escrow. Packaging and dispatch scheduled immediately.`
            : status === 'countered'
            ? `I looked over your counter offer of ₦${counterAmount?.toLocaleString()}. Let me think about that, but feel free to purchase directly if you are in a rush!`
            : `No worries at all! Let's explore other pieces in my wardrobe directory. Feel free to shoot through any query!`,
          timestamp: 'Just now'
        };

        return {
          ...t,
          lastMessage: systemLogText,
          lastTimestamp: 'Just now',
          messages: [...updatedMessages, autoMsg]
        };
      }
      return t;
    }));

    // If accepted, execute balance deduction
    if (status === 'accepted') {
      const parsedAmount = findOfferAmount(threadId, offerId) || 30000;
      if (wallet.balance < parsedAmount) {
        triggerNotification(`❌ Insufficient available balance inside your Zend wallet to accept the offer!`);
        return;
      }

      setWallet(prev => ({
        ...prev,
        balance: prev.balance - parsedAmount,
        transactions: [
          {
            id: `tx_${Date.now()}`,
            type: 'purchase',
            title: `Bargain Win: ${findOfferTitle(threadId, offerId)}`,
            amount: -parsedAmount,
            date: 'Today',
            status: 'completed',
            reference: `ZEND-EST-${Math.floor(Math.random() * 9000 + 1000)}`
          },
          ...prev.transactions
        ]
      }));

      triggerNotification(`💚 Offer Accepted! Paid ₦${parsedAmount.toLocaleString()} safely. Escrow verified.`);
    } else {
      triggerNotification(`🔄 Offer status updated to: ${status.toUpperCase()}`);
    }
  };

  const findOfferAmount = (threadId: string, offerId: string): number => {
    const thread = threads.find(t => t.id === threadId);
    const msg = thread?.messages.find(m => m.offer && m.offer.id === offerId);
    return msg?.offer?.amount || 0;
  };

  const findOfferTitle = (threadId: string, offerId: string): string => {
    const thread = threads.find(t => t.id === threadId);
    const msg = thread?.messages.find(m => m.offer && m.offer.id === offerId);
    return msg?.offer?.listingTitle || 'Curated resold garment';
  };

  const m_amount = (messages: ChatMessage[], offerId: string): number => {
    const found = messages.find(m => m.offer && m.offer.id === offerId);
    return found?.offer?.amount || 0;
  };

  // 6. Withdraw money payout logic
  const handleWithdrawal = (amount: number, bank: string, accountNum: string) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [
        {
          id: `tx_withdraw_${Date.now()}`,
          type: 'withdrawal',
          title: `Transferred to ${bank} (A/C: ${accountNum.slice(-4)})`,
          amount: -amount,
          date: 'Just now',
          status: 'completed',
          reference: `ZEND-NIP-${Math.floor(Math.random() * 800000 + 100000)}`
        },
        ...prev.transactions
      ]
    }));
    triggerNotification(`💸 Payout request for ₦${amount.toLocaleString()} dispatched successfully to your bank!`);
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }
    setWaitlistSubmitted(true);
    setWaitlistCount(prev => prev + 1);
  };

  // Switch display to custom seller details
  const triggerSellerSelect = (sellerId: string) => {
    // If selecting me
    if (sellerId === SELLER_ME.id) {
      setDetailSeller(SELLER_ME);
      setDetailListing(null);
      return;
    }

    const sellerObj = MOCK_SELLERS.find(s => s.id === sellerId);
    if (sellerObj) {
      setDetailSeller(sellerObj);
      setDetailListing(null);
    }
  };

  // Setup live message with seller directly from profile
  const handleMessageSellerFromProfile = (seller: Seller) => {
    // Search if active thread exists
    const existing = threads.find(t => t.sellerId === seller.id);
    if (existing) {
      setActiveThreadId(existing.id);
      setCurrentTab('messages');
      setDetailSeller(null);
      setDetailListing(null);
    } else {
      // Create fresh custom thread
      const threadId = `chat_${Date.now()}`;
      const newThread: ChatThread = {
        id: threadId,
        listingId: 'none',
        buyerName: SELLER_ME.name,
        sellerId: seller.id,
        sellerName: seller.name,
        sellerAvatar: seller.avatar,
        lastMessage: 'Started a new conversation',
        lastTimestamp: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg_fresh_${Date.now()}`,
            senderId: 'buyer',
            senderName: SELLER_ME.name,
            text: `Hi ${seller.name.split(' ')[0]}, I was browsing your wardrobe collection on Zend and love your aesthetics. Just dropping a line!`,
            timestamp: 'Just now'
          }
        ]
      };
      setThreads([newThread, ...threads]);
      setActiveThreadId(threadId);
      setCurrentTab('messages');
      setDetailSeller(null);
      setDetailListing(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-dark-charcoal font-sans antialiased overflow-x-hidden relative selection:bg-primary-soft selection:text-primary">
      
      {/* Floating Interactive Toast notifications */}
      {notification && (
        <div id="toast-notify" className="fixed top-6 left-1/2 -translate-x-1/2 bg-zinc-900 border border-zinc-800 text-white font-sans text-xs font-semibold py-3.5 px-6 rounded-full shadow-2xl z-50 flex items-center gap-2.5 animate-scaleUp max-w-sm text-center">
          <span className="shrink-0">📢</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Modern Top Header Nav as requested in public HTML reference */}
      <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-100">
        <nav className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="font-serif text-2xl font-black text-primary tracking-wide cursor-pointer flex items-center gap-1.5" onClick={() => { setDetailListing(null); setDetailSeller(null); setCurrentTab('feed'); }}>
            Zend
            <span className="text-[10px] font-sans font-bold bg-primary-soft text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Marketplace</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="font-sans text-xs font-bold uppercase tracking-wider text-soft-clay hover:text-primary transition-colors duration-200" href="#hero">Shop Collective</a>
            <a className="font-sans text-xs font-bold uppercase tracking-wider text-soft-clay hover:text-primary transition-colors duration-200" href="#philosophy">The Philosophy</a>
            <a className="font-sans text-xs font-bold uppercase tracking-wider text-soft-clay hover:text-primary transition-colors duration-200" href="#payouts">Secure Payouts</a>
            <a className="font-sans text-xs font-bold uppercase tracking-wider text-soft-clay hover:text-primary transition-colors duration-200" href="#waitlist">Waitlist</a>
          </div>
          <a href="#waitlist" className="bg-primary text-white border-2 border-primary hover:bg-neutral-900 hover:border-neutral-900 px-6 py-2.5 rounded-full font-sans text-xs font-bold cursor-pointer transition-all duration-200 shadow-sm active:scale-95 leading-none">
            Join Waitlist
          </a>
        </nav>
      </header>

      {/* Main Section: Dynamic Dual Columns */}
      <main className="max-w-7xl mx-auto px-6 py-8" id="hero">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT 7 COLS: Elegant High-fidelity Brand Manifesto (Screenshot mimicry) */}
          <div className="lg:col-span-7 space-y-16 py-4">
            
            {/* Hero details */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary-soft text-primary font-sans text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                <Sparkles size={11} className="fill-primary" /> Curating Nigerian Streetwear Luxury
              </div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary font-extrabold leading-[1.08] tracking-tight">
                The New Standard of <span className="italic font-normal">Pre-Owned</span> Luxury.
              </h1>
              <p className="font-sans text-zinc-600 text-sm md:text-base font-light leading-relaxed max-w-lg">
                Nigeria's premier resale destination for authenticated Gen-Z streetwear and luxury garments. We bridge the gap between heritage design house archives and modern circular fashion.
              </p>
              
              <div className="flex flex-wrap gap-4 pt-2">
                <a href="#waitlist" className="bg-primary hover:bg-neutral-950 text-white px-8 py-4 rounded-xl font-sans text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0">
                  Join 2,500+ waitlisted
                </a>
                <a href="#philosophy" className="border border-zinc-200 hover:bg-zinc-50 text-soft-clay hover:text-dark-charcoal px-8 py-4 rounded-xl font-sans text-xs font-bold transition-all">
                  Read Philosophy
                </a>
              </div>
            </div>

            {/* Philosophy segment as seen in mock */}
            <div className="space-y-8 pt-4 border-t border-zinc-100" id="philosophy">
              <div className="text-left">
                <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#9c273e]">The Collective Values</span>
                <h2 className="font-serif text-2xl text-primary font-bold mt-1">The Zend Resale Paradigm</h2>
                <div className="w-12 h-0.5 bg-primary mt-2"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div id="pillar-curated" className="bg-white p-5 rounded-xl border border-zinc-100 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary">
                    🌸
                  </div>
                  <h4 className="font-serif font-bold text-sm text-dark-charcoal">Curated Selection</h4>
                  <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                    Every garment is hand-screened by our catalog selectors to ensure premium vintage representation.
                  </p>
                </div>

                <div id="pillar-verified" className="bg-white p-5 rounded-xl border border-zinc-100 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary">
                    🛡️
                  </div>
                  <h4 className="font-serif font-bold text-sm text-dark-charcoal">Verified Authenticity</h4>
                  <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                    Physical sorting locks. No post-purchase query, fully backed by double escrow payouts.
                  </p>
                </div>

                <div id="pillar-community" className="bg-white p-5 rounded-xl border border-zinc-100 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary">
                    🌍
                  </div>
                  <h4 className="font-serif font-bold text-sm text-dark-charcoal">Community Driven</h4>
                  <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                    Made of creators and fashion advocates across Lekki, Ikeja, Abuja, and Port Harcourt.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Buyer/Seller Value Proposition Segment */}
            <div className="space-y-8 pt-6 border-t border-zinc-100 font-sans" id="checkout-experience">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="text-left space-y-1">
                  <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#9c273e]">Interactive Platforms</span>
                  <h2 className="font-serif text-3xl text-primary font-bold">Simple for buyers.<br />Powerful for sellers.</h2>
                  <div className="w-12 h-0.5 bg-primary mt-2"></div>
                </div>

                {/* Persona Switch Control Panel */}
                <div className="flex bg-zinc-100 p-1 rounded-xl self-start md:self-end border border-zinc-200 shadow-inner">
                  <button
                    onClick={() => setUserPersona('buyer')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all ${
                      userPersona === 'buyer'
                        ? 'bg-white text-primary shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <span>🛍️</span> I'm a Buyer
                  </button>
                  <button
                    onClick={() => setUserPersona('seller')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-[11px] font-bold transition-all ${
                      userPersona === 'seller'
                        ? 'bg-[#9c273e] text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    <span>🏷️</span> I'm a Seller
                  </button>
                </div>
              </div>

              {/* Dynamic Value Display Container */}
              <div className="animate-fadeIn transition-all duration-305">
                {userPersona === 'buyer' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Buyer Step 1 */}
                    <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-xs hover:shadow-sm transition-all flex gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 font-bold text-sm">
                        🔍
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-serif font-bold text-sm text-dark-charcoal">Discover items you love</h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                          Browse thousands of second-hand fashion items — filtered by category, brand, size, condition, and price range. Find the exact thing you've been looking for.
                        </p>
                      </div>
                    </div>

                    {/* Buyer Step 2 */}
                    <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-xs hover:shadow-sm transition-all flex gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 font-bold text-sm">
                        💬
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-serif font-bold text-sm text-dark-charcoal">Make your offer</h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                          See a price you like — but want it lower? Tap <b>"Make Offer"</b> and name your price. No awkward DMs. No guesswork. Just a clear, direct offer.
                        </p>
                      </div>
                    </div>

                    {/* Buyer Step 3 */}
                    <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-xs hover:shadow-sm transition-all flex gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold text-sm">
                        🤝
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-serif font-bold text-sm text-dark-charcoal">Negotiate in real time</h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                          The seller accepts, declines, or counters. You respond. Back and forth until you both agree — or move on. Clean, fast, no pressure.
                        </p>
                      </div>
                    </div>

                    {/* Buyer Step 4 */}
                    <div className="bg-white p-5 rounded-xl border border-zinc-100 shadow-xs hover:shadow-sm transition-all flex gap-3.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-sm">
                        ✅
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-serif font-bold text-sm text-dark-charcoal">Buy with confidence</h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                          Pay securely through Zend. Your money is protected until you confirm you received exactly what was listed. Then rate your seller.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Seller Benefit 1 */}
                    <div className="bg-[#fdfafb] p-5 rounded-xl border border-pink-100 shadow-xs hover:shadow-sm transition-all flex flex-col gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-sm">
                        🤝
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-serif font-bold text-sm text-dark-charcoal">Negotiate directly in-app</h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                          Make offers, counter-offers, and close deals inside Zend. Every price is a conversation — not a take-it-or-leave-it ultimatum.
                        </p>
                      </div>
                    </div>

                    {/* Seller Benefit 2 */}
                    <div className="bg-[#fafafc] p-5 rounded-xl border border-purple-100 shadow-xs hover:shadow-sm transition-all flex flex-col gap-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-indigo-600 text-[7px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse scale-90">
                        ZendStudio AI
                      </div>
                      <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-750 flex items-center justify-center font-bold text-sm">
                        ✨
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-serif font-bold text-sm text-dark-charcoal">AI transforms your photos</h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                          Upload any photo. AI removes the background, fixes the lighting, and makes your second-hand item look like a studio shot instantly.
                        </p>
                      </div>
                    </div>

                    {/* Seller Benefit 3 */}
                    <div className="bg-[#fafdfa] p-5 rounded-xl border border-emerald-100 shadow-xs hover:shadow-sm transition-all flex flex-col gap-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2 bg-emerald-600 text-[7px] text-white px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider scale-90">
                        AUTO PILOT
                      </div>
                      <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                        🤖
                      </div>
                      <div className="space-y-1.5 text-left">
                        <h4 className="font-serif font-bold text-sm text-dark-charcoal">AI responds to buyers for you</h4>
                        <p className="font-sans text-[11px] text-zinc-500 leading-relaxed font-light">
                          Your AI agent handles inquiries, suggests counteroffers, and follows up on interested buyers while you sleep automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Waitlist Sign Up Form container */}
            <div className="bg-zinc-100 p-8 rounded-2xl relative overflow-hidden" id="waitlist">
              <div className="relative z-10 max-w-lg space-y-4">
                <h3 className="font-serif text-2xl text-primary font-bold">Be the First to Know</h3>
                <p className="font-sans text-xs text-soft-clay leading-relaxed">
                  We are launching soon to a limited community of collectors. Join our VIP list for exclusive early access to the premium collection drop.
                </p>

                {waitlistSubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-semibold">
                    <span>✔️</span>
                    <span>Fantastic! Your spot is secured. You are #{waitlistCount} in line. Look out for our welcome drop email shortly!</span>
                  </div>
                ) : (
                  <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="email" 
                      placeholder="Enter your email address" 
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="flex-1 bg-white border border-zinc-200 focus:border-primary px-4 py-3 text-xs outline-none rounded-xl"
                    />
                    <button 
                      type="submit"
                      className="bg-primary text-white py-3 px-6 rounded-xl font-sans text-xs font-bold transition-all hover:bg-neutral-900"
                    >
                      Notify me
                    </button>
                  </form>
                )}
                <p className="text-[10px] text-zinc-400">Join {waitlistCount} luxury fashion enthusiasts already waitlisted.</p>
              </div>
            </div>

          </div>

          {/* RIGHT 5 COLS: Immersive, Live Smartphone Emulator detailing requested screens */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex justify-center py-4">
            
            {/* Phone Emulator Body */}
            <div className="w-[360px] h-[720px] bg-neutral-950 rounded-[44px] p-3 p-b-4 border-[6px] border-neutral-900 shadow-2xl relative overflow-hidden flex flex-col glow-selected">
              
              {/* Phone Dynamic Island top bar */}
              <div className="absolute top-0 left-0 right-0 h-9 bg-neutral-950 flex items-center justify-between px-6 z-50 text-[10px] text-white font-semibold">
                <span>12:30</span>
                <div className="w-20 h-4.5 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full absolute right-2" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📶</span>
                  <span>🔋</span>
                </div>
              </div>

              {/* Dynamic Notification Dropdown Alert Banner within Phone */}
              {notification && (
                <div className="absolute top-10 left-3 right-3 bg-zinc-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl text-[9px] font-sans z-50 border border-zinc-800 animate-fadeIn flex items-center justify-between gap-1 shadow-lg">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">💬</span>
                    <p className="truncate max-w-[220px]">{notification}</p>
                  </div>
                  <span className="text-emerald-500 font-bold tracking-wide uppercase shrink-0">Open</span>
                </div>
              )}

              {/* Main Phone Screens Container Routing */}
              <div className="flex-1 rounded-[34px] overflow-hidden bg-[#fcf9f8] relative flex flex-col pt-8">
                
                {/* Router view */}
                <div className="flex-1 overflow-hidden">
                  {detailListing ? (
                    <ProductDetail 
                      listing={detailListing}
                      onBack={() => setDetailListing(null)}
                      onSelectSeller={triggerSellerSelect}
                      onBuyNow={handleBuyNow}
                      onMakeOffer={handleMakeOffer}
                    />
                  ) : detailSeller ? (
                    <SellerProfileView 
                      seller={detailSeller}
                      listings={listings}
                      onBack={() => setDetailSeller(null)}
                      onSelectListing={(l) => { setDetailListing(l); setDetailSeller(null); }}
                      onMessageSeller={handleMessageSellerFromProfile}
                    />
                  ) : currentTab === 'feed' ? (
                    <Homepage 
                      listings={listings}
                      onSelectListing={(l) => setDetailListing(l)}
                      onOpenAddListing={() => setShowAddListing(true)}
                    />
                  ) : currentTab === 'messages' ? (
                    <ChatBargainView 
                      threads={threads}
                      activeThreadId={activeThreadId}
                      onSelectThread={(tId) => setActiveThreadId(tId)}
                      onSendMessage={handleSendMessage}
                      onUpdateOffer={handleUpdateOffer}
                      onGoBackFeed={() => setCurrentTab('feed')}
                    />
                  ) : currentTab === 'wallet' ? (
                    <WalletScreen 
                      wallet={wallet}
                      onWithdraw={handleWithdrawal}
                    />
                  ) : currentTab === 'profile' ? (
                    <SellerProfileView 
                      seller={SELLER_ME}
                      listings={listings}
                      onBack={() => setCurrentTab('feed')}
                      onSelectListing={(l) => setDetailListing(l)}
                    />
                  ) : null}
                </div>

                {/* Simulated Phone Bottom Nav Bar as requested */}
                <div className="h-14 bg-white/95 backdrop-blur-md border-t border-zinc-100 flex items-center justify-around px-4 z-40 sticky bottom-0">
                  <button 
                    onClick={() => { setDetailListing(null); setDetailSeller(null); setCurrentTab('feed'); }}
                    className={`flex flex-col items-center justify-center p-1.5 ${
                      currentTab === 'feed' && !detailListing && !detailSeller ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <Compass size={16} />
                    <span className="text-[8px] font-sans font-bold mt-0.5">Explore</span>
                  </button>

                  <button 
                    onClick={() => { setDetailListing(null); setDetailSeller(null); setCurrentTab('messages'); }}
                    className={`flex flex-col items-center justify-center p-1.5 relative ${
                      currentTab === 'messages' && !detailListing && !detailSeller ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <MessageSquare size={16} />
                    <span className="text-[8px] font-sans font-bold mt-0.5">Messages</span>
                    <span className="absolute top-1 right-1 px-1 bg-primary text-white font-sans text-[7px] font-extrabold rounded-full scale-90">2</span>
                  </button>

                  <button 
                    onClick={() => setShowAddListing(true)}
                    className="flex flex-col items-center justify-center p-1.5 text-zinc-400 hover:text-zinc-600"
                  >
                    <PlusSquare size={20} className="text-[#9c273e]" />
                    <span className="text-[8px] font-sans font-bold mt-0.5 text-[#9c273e]">Sell</span>
                  </button>

                  <button 
                    onClick={() => { setDetailListing(null); setDetailSeller(null); setCurrentTab('wallet'); }}
                    className={`flex flex-col items-center justify-center p-1.5 ${
                      currentTab === 'wallet' && !detailListing && !detailSeller ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <Wallet size={16} />
                    <span className="text-[8px] font-sans font-bold mt-0.5">Wallet</span>
                  </button>

                  <button 
                    onClick={() => { setDetailListing(null); setDetailSeller(null); setCurrentTab('profile'); }}
                    className={`flex flex-col items-center justify-center p-1.5 ${
                      currentTab === 'profile' && !detailListing && !detailSeller ? 'text-primary' : 'text-zinc-400 hover:text-zinc-600'
                    }`}
                  >
                    <User size={16} />
                    <span className="text-[8px] font-sans font-bold mt-0.5">Profile</span>
                  </button>
                </div>

                {/* iPhone Home Swipe Bar styling */}
                <div className="h-4 bg-white flex justify-center items-center pb-1">
                  <div className="w-24 h-1 bg-zinc-300 rounded-full" />
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      {/* Sell overlay modal inside website wrapper */}
      {showAddListing && (
        <AddListingModal 
          onClose={() => setShowAddListing(false)} 
          onAddListing={handleAddNewListing} 
        />
      )}

      {/* Majestic Footer matching the design philosophy */}
      <footer className="bg-white border-t border-zinc-100 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2">
            <h3 className="font-serif text-2xl font-black text-primary tracking-wider">Zend</h3>
            <p className="font-sans text-xs text-soft-clay max-w-xs leading-relaxed">
              Redefining luxury fashion through conscious circulation. Hand-curated in Lagos, serving sustainable style nationwide.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-soft-clay font-bold uppercase tracking-wider">
            <a className="hover:text-primary transition-colors underline underline-offset-4" href="#">Terms of Service</a>
            <a className="hover:text-primary transition-colors underline underline-offset-4" href="#">Privacy Guidelines</a>
            <a className="hover:text-primary transition-colors underline underline-offset-4" href="#">Zend Guard Escrow</a>
            <a className="hover:text-primary transition-colors underline underline-offset-4" href="#">Contact Lagos Hub</a>
          </div>
          <p className="text-xs text-soft-clay">
            © 2026 Zend Marketplace. Beautifully archived in Nigeria.
          </p>
        </div>
      </footer>

    </div>
  );
}

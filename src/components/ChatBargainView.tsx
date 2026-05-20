/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChatThread, ChatMessage, Offer, Listing } from '../types';
import { Send, Check, X, RefreshCw, ChevronLeft, ShieldCheck, ShoppingBag, Banknote, HelpCircle } from 'lucide-react';

interface ChatBargainViewProps {
  threads: ChatThread[];
  activeThreadId: string;
  onSelectThread: (threadId: string) => void;
  onSendMessage: (threadId: string, text: string) => void;
  onUpdateOffer: (threadId: string, offerId: string, status: Offer['status'], counterAmount?: number) => void;
  onGoBackFeed: () => void;
  activeListing?: Listing; // optionally trigger chat from detail offer
}

export const ChatBargainView: React.FC<ChatBargainViewProps> = ({
  threads,
  activeThreadId,
  onSelectThread,
  onSendMessage,
  onUpdateOffer,
  onGoBackFeed,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedThreadId, setSelectedThreadId] = useState(activeThreadId || (threads[0] ? threads[0].id : ''));
  const [isCountering, setIsCountering] = useState(false);
  const [counterValue, setCounterValue] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fallback safe selected thread helper
  const activeThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  useEffect(() => {
    if (activeThreadId) {
      setSelectedThreadId(activeThreadId);
    }
  }, [activeThreadId]);

  // Auto scroll chats
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeThread?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(activeThread.id, inputText.trim());
    setInputText('');
  };

  const handleCounterSubmit = (e: React.FormEvent, offer: Offer) => {
    e.preventDefault();
    const parsedAmount = parseInt(counterValue.replace(/[^0-9]/g, ''), 10);
    if (!parsedAmount || isNaN(parsedAmount)) return;
    
    onUpdateOffer(activeThread.id, offer.id, 'countered', parsedAmount);
    setIsCountering(false);
    setCounterValue('');
  };

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Dynamic Shell Grid Layout */}
      <div className="flex flex-1 h-full overflow-hidden">
        
        {/* Left Side: Conversational Hub Selection list (collapsed dynamically on small heights) */}
        <div className={`w-full md:w-3/12 border-r border-zinc-100 bg-offwhite-bg overflow-y-auto ${activeThread ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 bg-white sticky top-0 border-b border-zinc-100">
            <h2 className="font-serif font-bold text-lg text-dark-charcoal">Negotiations</h2>
            <p className="text-[10px] font-sans text-zinc-400 mt-0.5">Zend Multi-party Escrow Protected</p>
          </div>
          
          <div className="divide-y divide-zinc-100">
            {threads.length === 0 ? (
              <div className="p-6 text-center text-xs font-sans text-soft-clay">
                No bargain histories found. Make offers on browse listings to start!
              </div>
            ) : (
              threads.map((thread) => {
                const isActive = thread.id === selectedThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      setSelectedThreadId(thread.id);
                      onSelectThread(thread.id);
                    }}
                    className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                      isActive ? 'bg-primary-soft/90 border-l-4 border-primary' : 'bg-white hover:bg-zinc-50/50'
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={thread.sellerAvatar} 
                        alt={thread.sellerName} 
                        className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                        referrerPolicy="no-referrer"
                      />
                      {thread.unreadCount > 0 && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-primary rounded-full border border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-sans font-bold text-dark-charcoal truncate">
                          {thread.sellerName}
                        </span>
                        <span className="text-[9px] font-sans text-zinc-400">
                          {thread.lastTimestamp}
                        </span>
                      </div>
                      <p className="text-[10px] font-sans text-zinc-500 truncate mt-0.5">
                        {thread.lastMessage}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Primary Chat Feed Frame */}
        {activeThread ? (
          <div className="flex-1 flex flex-col h-full bg-white relative">
            
            {/* Thread Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 bg-white z-20 sticky top-0 shadow-xs">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onGoBackFeed()}
                  className="p-1.5 md:hidden text-zinc-600 hover:bg-zinc-50 rounded-full"
                >
                  <ChevronLeft size={20} className="stroke-[2.5]" />
                </button>
                <div className="relative">
                  <img 
                    src={activeThread.sellerAvatar} 
                    alt={activeThread.sellerName} 
                    className="w-9 h-9 rounded-full object-cover border border-zinc-100"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                </div>
                <div>
                  <h3 className="text-xs font-sans font-bold text-dark-charcoal leading-snug">
                    {activeThread.sellerName}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-sans text-zinc-400">Verified Wardrobe Seller</span>
                    <ShieldCheck size={9} className="text-emerald-600 fill-emerald-100" />
                  </div>
                </div>
              </div>
              
              {/* Escape shortcut */}
              <button 
                onClick={() => onGoBackFeed()}
                className="text-[10px] font-sans font-semibold text-primary select-none hover:underline"
              >
                Browse Marketplace
              </button>
            </div>

            {/* Chat Messages Log Scrollable Container */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-zinc-50/50">
              {activeThread.messages.map((msg) => {
                const isMe = msg.senderId === 'buyer';
                
                return (
                  <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    
                    {/* Timestamp / Sender line */}
                    <div className="text-[9px] text-zinc-400 font-sans mb-1 px-1 flex items-center gap-1">
                      <span>{isMe ? 'You' : msg.senderName}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Standard Text Chat Bubble */}
                    {msg.text && (
                      <div 
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-sans leading-relaxed shadow-xs ${
                          isMe 
                            ? 'bg-primary text-white rounded-br-none' 
                            : 'bg-white text-dark-charcoal border border-zinc-100 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}

                    {/* Highly Interactive Bargaining Offer Card ticket */}
                    {msg.offer && (
                      <div className="w-[85%] md:w-[70%] bg-white rounded-2xl border border-zinc-200 shadow-md p-4 mt-2 mb-2 animate-fadeIn">
                        <div className="flex gap-3 pb-3 border-b border-zinc-100">
                          <img 
                            src={msg.offer.listingImage} 
                            alt={msg.offer.listingTitle} 
                            className="w-12 h-12 rounded-lg object-cover bg-zinc-50 border border-zinc-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[9px] font-sans font-semibold text-zinc-400 tracking-wider uppercase block">
                              Active Counter Offer
                            </span>
                            <h4 className="text-[11px] font-sans font-bold text-dark-charcoal truncate leading-snug">
                              {msg.offer.listingTitle}
                            </h4>
                            <div className="text-[10px] font-sans text-zinc-400 mt-0.5">
                              Marketplace price: {formatNaira(msg.offer.listingPrice)}
                            </div>
                          </div>
                        </div>

                        {/* Middle status & price details */}
                        <div className="py-3 text-center bg-offwhite-bg/70 rounded-xl my-3">
                          <div className="text-[10px] font-sans text-soft-clay uppercase tracking-wide font-medium">Bargained Offer Amount</div>
                          <div className="text-xl font-sans font-extrabold text-primary mt-0.5">
                            {formatNaira(msg.offer.amount)}
                          </div>
                          
                          {/* Inner badge depending on status */}
                          <div className="mt-2 inline-flex items-center gap-1 justify-center">
                            {msg.offer.status === 'pending' && (
                              <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                                ⏳ Pending Review
                              </span>
                            )}
                            {msg.offer.status === 'accepted' && (
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1">
                                <Check size={10} className="stroke-[3]" /> Offer Accepted
                              </span>
                            )}
                            {msg.offer.status === 'declined' && (
                              <span className="text-[9px] bg-zinc-100 text-zinc-500 border border-zinc-200 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                                ❌ Offer Declined
                              </span>
                            )}
                            {msg.offer.status === 'countered' && (
                              <span className="text-[9px] bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
                                🔄 Counter Offer Pending
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Interactive state actions */}
                        {msg.offer.status === 'pending' && (
                          <div className="space-y-2">
                            {/* Actions buttons */}
                            {!isCountering ? (
                              <div className="flex gap-2.5">
                                <button
                                  onClick={() => onUpdateOffer(activeThread.id, msg.offer!.id, 'declined')}
                                  className="flex-1 border border-zinc-200 hover:bg-zinc-50 py-2 rounded-lg text-[11px] font-sans font-bold text-zinc-500 transition-all flex items-center justify-center gap-1 select-none"
                                >
                                  <X size={12} className="stroke-[2.5]" /> Decline
                                </button>
                                <button
                                  onClick={() => setIsCountering(true)}
                                  className="flex-1 bg-white border border-primary text-primary hover:bg-primary-soft py-2 rounded-lg text-[11px] font-sans font-bold transition-all flex items-center justify-center gap-1 select-none"
                                >
                                  <RefreshCw size={11} /> Counter
                                </button>
                                <button
                                  onClick={() => onUpdateOffer(activeThread.id, msg.offer!.id, 'accepted')}
                                  className="flex-1 bg-primary text-white hover:brightness-110 py-2 rounded-lg text-[11px] font-sans font-bold transition-all flex items-center justify-center gap-1 select-none shadow-sm"
                                >
                                  <Check size={12} className="stroke-[3]" /> Accept
                                </button>
                              </div>
                            ) : (
                              /* Counter inputs block */
                              <form onSubmit={(e) => handleCounterSubmit(e, msg.offer!)} className="flex items-center gap-2 animate-fadeIn">
                                <span className="text-sm font-bold text-primary">₦</span>
                                <input
                                  type="text"
                                  pattern="[0-9]*"
                                  inputMode="numeric"
                                  placeholder="Enter counter amount"
                                  value={counterValue}
                                  onChange={(e) => setCounterValue(e.target.value.replace(/[^0-9]/g, ''))}
                                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs outline-none text-dark-charcoal focus:border-primary"
                                />
                                <button
                                  type="submit"
                                  className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold"
                                >
                                  Send
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setIsCountering(false)}
                                  className="border border-zinc-200 px-3 py-1.5 rounded-lg text-xs"
                                >
                                  Cancel
                                </button>
                              </form>
                            )}
                          </div>
                        )}

                        {/* Interactive Checkout shortcut if accepted */}
                        {msg.offer.status === 'accepted' && (
                          <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-lg text-[10px] font-sans flex items-center justify-between">
                            <span className="font-light">Safe Escrow secured inside Zend Wallet.</span>
                            <div className="flex items-center gap-1 font-bold text-primary text-[10px] select-none">
                              <Banknote size={12} /> Paid & Locked
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticky Chat input form tray */}
            <div className="p-3 border-t border-zinc-100 bg-white sticky bottom-0 z-10 shadow-xs">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder={`Write message to ${activeThread.sellerName.split(' ')[0]}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 bg-zinc-100 border-none rounded-xl px-4 py-3 text-xs outline-none font-sans text-dark-charcoal focus:bg-zinc-50 focus:ring-1 focus:ring-primary transition-all placeholder:text-zinc-400"
                />
                <button 
                  type="submit"
                  className="bg-primary text-on-primary p-3 rounded-xl hover:brightness-115 transition-all flex items-center justify-center cursor-pointer active:scale-95 shadow-sm"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>

          </div>
        ) : (
          /* Selection Fallback panel on large monitors */
          <div className="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-zinc-50">
            <HelpCircle size={40} className="text-zinc-300" />
            <h3 className="text-sm font-sans font-bold text-dark-charcoal mt-3">Select a bargaining conversation</h3>
            <p className="text-xs font-sans text-soft-clay mt-1.5 max-w-xs leading-relaxed">
              Click any active list on the left column sidebar to see product info, size stats, and negotiate in real-time.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

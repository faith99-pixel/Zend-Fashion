/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WalletState, Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, Wallet, ShieldEllipsis, Building2, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';

interface WalletScreenProps {
  wallet: WalletState;
  onWithdraw: (amount: number, bank: string, accountNum: string) => void;
}

const NIGERIAN_BANKS = [
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank',
  'Access Bank (Diamond)',
  'United Bank for Africa (UBA)',
  'Kuda Microfinance Bank',
  'Opay Digital Services',
  'Stanbic IBTC Bank',
  'Wema Bank / ALAT'
];

export const WalletScreen: React.FC<WalletScreenProps> = ({ wallet, onWithdraw }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState(NIGERIAN_BANKS[0]);
  const [accountNumber, setAccountNumber] = useState('');
  const [isVerifyingAccount, setIsVerifyingAccount] = useState(false);
  const [verifiedAccountName, setVerifiedAccountName] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  const formatNaira = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Simulates Flutterwave's resolve NUBAN account service
  const handleAccountNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 10) {
      setAccountNumber(val);
      
      if (val.length === 10) {
        setIsVerifyingAccount(true);
        setVerifiedAccountName('');
        // Mock API Look Up Latency
        setTimeout(() => {
          setIsVerifyingAccount(false);
          setVerifiedAccountName(wallet.accountName); // Resolves to owner's name
        }, 1200);
      } else {
        setVerifiedAccountName('');
      }
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(withdrawAmount, 10);
    
    if (!parsedAmount || isNaN(parsedAmount)) {
      alert('Please enter a valid numeric amount to withdraw.');
      return;
    }
    if (parsedAmount > wallet.balance) {
      alert('Insufficient wallet funds for this withdrawal.');
      return;
    }
    if (accountNumber.length !== 10) {
      alert('Please enter a valid 10-digit Nigerian NUBAN account number.');
      return;
    }

    onWithdraw(parsedAmount, selectedBank, accountNumber);
    setWithdrawalSuccess(true);
    
    // Quick success animation reset
    setTimeout(() => {
      setWithdrawalSuccess(false);
      setShowWithdrawModal(false);
      setWithdrawAmount('');
      setAccountNumber('');
      setVerifiedAccountName('');
    }, 2500);
  };

  return (
    <div className="flex flex-col h-full bg-offwhite-bg">
      {/* Wallet Shell Header */}
      <div className="px-5 py-4 border-b border-zinc-100 bg-white sticky top-0 z-30 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-primary" />
            <h2 className="font-serif font-bold text-lg text-dark-charcoal">Zend Payouts</h2>
          </div>
          <span className="text-[10px] font-sans font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase border border-emerald-100">
            Escrow Secured
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pb-24 space-y-4">
        
        {/* Core Wallet Display Widget card */}
        <div className="bg-primary text-white p-6 rounded-2xl relative overflow-hidden editorial-shadow">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Wallet size={16} className="text-zinc-300" />
                <span className="text-xs font-sans text-zinc-300 font-medium">Zend Available Balance</span>
              </div>
              <h1 className="text-3xl font-sans font-extrabold tracking-tight">
                {formatNaira(wallet.balance)}
              </h1>
            </div>

            {/* Split Metrics */}
            <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-zinc-300 uppercase tracking-wider mb-0.5">Pending Earnings</div>
                <div className="text-sm font-sans font-bold flex items-center gap-1">
                  <span>{formatNaira(wallet.pendingEarnings)}</span>
                  <ShieldEllipsis size={13} className="text-zinc-300" />
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={wallet.balance <= 0}
                  className={`px-4 py-2 rounded-lg text-xs font-sans font-bold transition-all inline-block ${
                    wallet.balance > 0 
                      ? 'bg-white text-primary hover:bg-zinc-100 cursor-pointer active:scale-95' 
                      : 'bg-white/20 text-white/40 cursor-not-allowed'
                  }`}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>

          {/* Abstract backdrop designs */}
          <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -translate-y-6 translate-x-6" />
          <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
        </div>

        {/* Flutterwave Security Tagline */}
        <div className="bg-white px-4 py-3 rounded-xl border border-zinc-100 flex items-center gap-2.5 shadow-xs">
          <span className="text-lg">🛡️</span>
          <div>
            <h4 className="text-[11px] font-sans font-bold text-dark-charcoal uppercase tracking-wider">Lagos Escrow Cleansing</h4>
            <p className="text-[9px] text-zinc-500 font-sans leading-relaxed">
              Upon buyer checkout, funds are locked in Escrow. Once courier delivers and the physical checks pass without query, earnings transition instantly to available status.
            </p>
          </div>
        </div>

        {/* Transaction Histories */}
        <div>
          <h3 className="text-xs uppercase tracking-wider font-semibold text-soft-clay mb-3 pl-1">
            Transaction Activity
          </h3>

          <div className="bg-white rounded-xl divide-y divide-zinc-50 border border-zinc-100 overflow-hidden shadow-xs">
            {wallet.transactions.length === 0 ? (
              <div className="p-8 text-center text-xs font-sans text-soft-clay font-medium">
                No recent transaction transactions recorded.
              </div>
            ) : (
              wallet.transactions.map((tx) => {
                const isCredit = tx.amount > 0;
                
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-zinc-50/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'withdrawal' 
                          ? 'bg-rose-50 text-rose-700' 
                          : tx.type === 'sale_earnings'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-zinc-100 text-zinc-600'
                      }`}>
                        {tx.type === 'withdrawal' ? (
                          <ArrowUpRight size={14} className="stroke-[2.5]" />
                        ) : (
                          <ArrowDownLeft size={14} className="stroke-[2.5]" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-sans font-bold text-dark-charcoal truncate">
                          {tx.title}
                        </h4>
                        <div className="text-[9px] font-sans text-zinc-400 mt-0.5 flex items-center gap-1.5">
                          <span>{tx.date}</span>
                          <span>•</span>
                          <span className="font-mono text-[8px] uppercase">{tx.reference}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-xs font-sans font-bold ${
                        isCredit ? 'text-emerald-700' : 'text-zinc-800'
                      }`}>
                        {isCredit ? '+' : ''}{formatNaira(tx.amount)}
                      </div>
                      <span className="text-[8px] font-sans font-semibold text-zinc-400 bg-zinc-100 px-1.5 py-0.2 rounded-xs uppercase tracking-wide">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Withdraw overlay modal (M Nuban resolve) */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/65 z-50 flex items-end md:items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-2xl md:rounded-2xl shadow-2xl p-6 relative overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Success Micro Screen */}
            {withdrawalSuccess ? (
              <div className="text-center py-12 flex flex-col items-center justify-center space-y-4 animate-scaleUp">
                <CheckCircle2 size={48} className="text-emerald-600 fill-emerald-100" />
                <h3 className="text-base font-serif font-bold text-dark-charcoal">Payout Request Dispatched</h3>
                <p className="text-xs font-sans text-soft-clay max-w-xs leading-relaxed">
                  ₦{withdrawAmount} is on its way to your {selectedBank} account. Settlement generally completes via instant NIP within 5 minutes.
                </p>
                <div className="text-[10px] font-mono text-zinc-400">REF: TRANS-PAYOUT-{Math.floor(Math.random() * 9000 + 1000)}</div>
              </div>
            ) : (
              /* Core withdrawal form options */
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                  <h3 className="font-serif font-bold text-base text-dark-charcoal">Payout to Bank Account</h3>
                  <button 
                    onClick={() => setShowWithdrawModal(false)}
                    className="text-zinc-400 hover:text-dark-charcoal text-xs font-bold"
                  >
                    Cancel
                  </button>
                </div>

                <form onSubmit={handleWithdrawSubmit} className="space-y-4 font-sans text-xs">
                  {/* Info balance */}
                  <div className="bg-primary-soft text-primary p-3 rounded-lg flex justify-between items-center">
                    <span>Available Available balance:</span>
                    <strong className="font-bold">{formatNaira(wallet.balance)}</strong>
                  </div>

                  {/* Selected Bank dropdown */}
                  <div>
                    <label className="block text-zinc-500 font-semibold mb-1">Select Nigerian Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none"
                    >
                      {NIGERIAN_BANKS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-zinc-500 font-semibold mb-1">10-Digit NUBAN Account Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={10}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        placeholder="e.g. 0123456789"
                        value={accountNumber}
                        onChange={handleAccountNumberChange}
                        className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none font-mono"
                      />
                      {isVerifyingAccount && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2">
                          <RefreshCw size={12} className="text-primary animate-spin" />
                        </span>
                      )}
                    </div>
                    {verifiedAccountName && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-sm width-fit font-bold border border-emerald-100">
                        <CheckCircle2 size={10} /> Account Validated: {verifiedAccountName}
                      </div>
                    )}
                  </div>

                  {/* Input amount */}
                  <div>
                    <label className="block text-zinc-500 font-semibold mb-1">Amount to Payout (₦)</label>
                    <input
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="e.g. 20000"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ''))}
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-primary rounded-xl px-3 py-2.5 text-xs text-dark-charcoal outline-none font-sans"
                    />
                  </div>

                  {/* Withdrawal CTAs */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!verifiedAccountName || !withdrawAmount || parseInt(withdrawAmount, 10) > wallet.balance}
                      className={`w-full py-3.5 rounded-xl font-sans font-bold text-xs cursor-pointer text-center transitions-all ${
                        verifiedAccountName && withdrawAmount && parseInt(withdrawAmount, 10) <= wallet.balance
                          ? 'bg-primary text-white hover:brightness-110 active:scale-95'
                          : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      }`}
                    >
                      Process Instant Payout
                    </button>
                    <p className="text-[9px] text-zinc-400 text-center font-sans mt-2 Leading-relaxed">
                      Powered by Flutterwave NIP settlement logs. Security certified under PCI-DSS.
                    </p>
                  </div>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

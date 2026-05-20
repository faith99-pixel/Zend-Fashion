/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Shoes' | 'Bags' | 'Tops' | 'Bottoms' | 'Accessories' | 'Dresses';

export interface Seller {
  id: string;
  name: string;
  username: string;
  avatar: string;
  rating: number;
  salesCount: number;
  listingsCount: number;
  responseRate: string;
  verified: boolean;
  bio: string;
  joinedDate: string;
  location: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number; // in NGN (₦)
  originalPrice: number; // in NGN (₦)
  description: string;
  images: string[];
  category: Category;
  size: string;
  condition: string;
  sellerId: string;
  sellerName: string;
  sellerUsername: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerSalesCount: number;
  sellerVerified: boolean;
  location: string;
  dateAdded: string;
  likes: number;
  views: number;
  isTrending?: boolean;
}

export interface Offer {
  id: string;
  amount: number;
  currency: string; // NGN ₦
  status: 'pending' | 'accepted' | 'declined' | 'countered';
  counterAmount?: number;
  listingId: string;
  listingTitle: string;
  listingImage: string;
  listingPrice: number;
  initiator: 'buyer' | 'seller';
}

export interface ChatMessage {
  id: string;
  senderId: 'buyer' | 'seller';
  senderName: string;
  text?: string;
  timestamp: string;
  offer?: Offer;
}

export interface ChatThread {
  id: string;
  listingId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Transaction {
  id: string;
  type: 'sale_earnings' | 'purchase' | 'withdrawal' | 'refund';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

export interface WalletState {
  balance: number;
  pendingEarnings: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  transactions: Transaction[];
}

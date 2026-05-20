/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Seller, Listing, ChatThread, WalletState } from './types';

export const SELLER_ME: Seller = {
  id: 'me',
  name: 'Zoe Zebedee',
  username: 'zoezeb',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  rating: 4.9,
  salesCount: 14,
  listingsCount: 4,
  responseRate: '100% within 1 hour',
  verified: true,
  bio: 'Curating archival pieces & 90s vintage. Ship nationwide from Ikeja, Lagos. Eco-fashion activist 🌿',
  joinedDate: 'Joined Nov 2024',
  location: 'Ikeja, Lagos'
};

export const MOCK_SELLERS: Seller[] = [
  {
    id: 'seller1',
    name: 'Kemi Adebayo',
    username: 'kemithrifted',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    rating: 4.8,
    salesCount: 142,
    listingsCount: 18,
    responseRate: 'Fast responder (10 mins)',
    verified: true,
    bio: 'Premium streetwear and archival silhouettes. 🌟 Specializing in reconstructed Nigerian fashion and luxury footwear. Lagos Island.',
    joinedDate: 'Joined March 2023',
    location: 'Lekki Phase 1, Lagos'
  },
  {
    id: 'seller2',
    name: 'Tunde Alao',
    username: 'tundexvntg',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.9,
    salesCount: 89,
    listingsCount: 12,
    responseRate: 'Within 2 hours',
    verified: true,
    bio: 'Handpicked retro blazers, luxury workwear & tailoring. Everything is professionally steamed and dry-cleaned. Cargo fan.',
    joinedDate: 'Joined Jan 2024',
    location: 'Ikeja Gra, Lagos'
  },
  {
    id: 'seller3',
    name: 'Amara Nwachukwu',
    username: 'amaras_closet',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80',
    rating: 4.7,
    salesCount: 34,
    listingsCount: 6,
    responseRate: 'Within a day',
    verified: false,
    bio: 'Selling pre-loved items from high street to designer. Decluttering my luxury bag and shoe collection! Next day delivery in Abuja.',
    joinedDate: 'Joined Aug 2024',
    location: 'Wuse II, Abuja'
  },
  {
    id: 'seller4',
    name: 'Chidi Okafor',
    username: 'archival_chidi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5.0,
    salesCount: 202,
    listingsCount: 25,
    responseRate: 'Extremely fast',
    verified: true,
    bio: 'Collector of Japanese denim, archive boots, and unisex designer accessories. Worldwide shipping, priority Lagos delivery.',
    joinedDate: 'Joined June 2022',
    location: 'Port Harcourt, Rivers'
  }
];

export const MOCK_LISTINGS: Listing[] = [
  {
    id: 'list1',
    title: 'Vintage Structured Burgundy Blazer',
    price: 35000,
    originalPrice: 85000,
    description: "Premium vintage structured wool-blend blazer in a rich burgundy shade, beautifully tailored with structured shoulders and a cinched waist. This exquisite piece serves as contemporary luxury clothing. Fits warm in air-conditioned office and stylish on a night out in Ikoyi.",
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCG2ayRXiqQnIlyJF3VjDH1k01Sddju0_ESGON58OWVLm6wAd9lZqkKOkv8SgY3AOeR_BM8QMhvf0e6zG1D8ZOpuZCQzqDloHouLQF8oK7RLDWM8MHFV4FkPJE1tc6hxcBGGG7YRAFkfcmVM030kI1-yavwdZuY6AK2he7qHW0waFCdGkv1-fbDhiLPftpRHZ8z6voyLEUXZUxFtJc2zgtlJ_IE18yoO_scJ7FxL4RGQywL8oWuiS--Guw1kyNQqWj-41qPaSbaVUFC'
    ],
    category: 'Tops',
    size: 'UK 10 / M',
    condition: 'Like New',
    sellerId: 'seller2',
    sellerName: 'Tunde Alao',
    sellerUsername: 'tundexvntg',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.9,
    sellerSalesCount: 89,
    sellerVerified: true,
    location: 'Ikeja Gra, Lagos',
    dateAdded: '2 hours ago',
    likes: 42,
    views: 310,
    isTrending: true
  },
  {
    id: 'list2',
    title: 'Croc-Embossed Orange Leather Shoulder Bag',
    price: 48000,
    originalPrice: 120000,
    description: "A stunning baguette-style shoulder bag with glossy croc-embossed leather, secure zip closure, and elegant gold hardware of Italian origin. This gorgeous luxury accessory perfectly complements neural tones or matches the traditional burnt orange accent.",
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Bags',
    size: 'One Size',
    condition: 'Gently Used',
    sellerId: 'seller1',
    sellerName: 'Kemi Adebayo',
    sellerUsername: 'kemithrifted',
    sellerAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.8,
    sellerSalesCount: 142,
    sellerVerified: true,
    location: 'Lekki Phase 1, Lagos',
    dateAdded: '1 day ago',
    likes: 128,
    views: 940,
    isTrending: true
  },
  {
    id: 'list3',
    title: 'Archive Block Platform Runway Heels',
    price: 65000,
    originalPrice: 180000,
    description: "Extremely rare, jaw-dropping multi-colored high-platform leather sandals with a massive sculptural wooden heel and adjustable ankle strap. Perfect for making absolute statements in fashion gatherings.",
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Shoes',
    size: 'EU 39 / UK 6',
    condition: 'Gently Used',
    sellerId: 'seller1',
    sellerName: 'Kemi Adebayo',
    sellerUsername: 'kemithrifted',
    sellerAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.8,
    sellerSalesCount: 142,
    sellerVerified: true,
    location: 'Lekki Phase 1, Lagos',
    dateAdded: '4 hours ago',
    likes: 76,
    views: 420,
    isTrending: true
  },
  {
    id: 'list4',
    title: 'Retro Oversized Shield Sunglasses',
    price: 15000,
    originalPrice: 35000,
    description: "Bold futuristic shield sunglasses with black polarized monolithic lens and silver accent hardware. Perfect accessory for that Lagos weather and beach outings at Landmark.",
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Accessories',
    size: 'OS Fits All',
    condition: 'New with tags',
    sellerId: 'seller3',
    sellerName: 'Amara Nwachukwu',
    sellerUsername: 'amaras_closet',
    sellerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.7,
    sellerSalesCount: 34,
    sellerVerified: false,
    location: 'Wuse II, Abuja',
    dateAdded: '2 days ago',
    likes: 31,
    views: 184
  },
  {
    id: 'list5',
    title: 'Custom Upcycled Denim Cargo Pants',
    price: 28000,
    originalPrice: 60000,
    description: "Upcycled baggy fit cargo pants constructed out of heavyweight Nigerian indigo denims and drill cotton. High waisted with multiple utility oversized pockets and raw-edge stitch details. Extremely robust and heavy.",
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Bottoms',
    size: 'W32 / L30',
    condition: 'Like New',
    sellerId: 'seller4',
    sellerName: 'Chidi Okafor',
    sellerUsername: 'archival_chidi',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    sellerRating: 5.0,
    sellerSalesCount: 202,
    sellerVerified: true,
    location: 'Port Harcourt, Rivers',
    dateAdded: '3 hours ago',
    likes: 83,
    views: 395,
    isTrending: false
  },
  {
    id: 'list6',
    title: 'Silk Backless Evening Dress',
    price: 52000,
    originalPrice: 150000,
    description: "Elegant emerald-green pure silk slip dress with delicate adjustable criss-cross back straps. Soft flow drape that fits perfectly like a custom glove. Ideal for weddings, dinners, or premium nightlife in Victoria Island.",
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80'
    ],
    category: 'Dresses',
    size: 'UK 8 / S',
    condition: 'Gently Used',
    sellerId: 'seller3',
    sellerName: 'Amara Nwachukwu',
    sellerUsername: 'amaras_closet',
    sellerAvatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&auto=format&fit=crop&q=80',
    sellerRating: 4.7,
    sellerSalesCount: 34,
    sellerVerified: false,
    location: 'Wuse II, Abuja',
    dateAdded: '1 week ago',
    likes: 110,
    views: 890,
    isTrending: false
  }
];

export const INITIAL_CHAT_THREADS: ChatThread[] = [
  {
    id: 'chat1',
    listingId: 'list1',
    buyerName: SELLER_ME.name,
    sellerId: 'seller2',
    sellerName: 'Tunde Alao',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Let’s settle for ₦32,000, happy to ship tomorrow first thing!',
    lastTimestamp: '10:42 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'msg1',
        senderId: 'buyer',
        senderName: SELLER_ME.name,
        text: 'Hi Tunde! Absolutely beautiful burgundy jacket. Very interested. Is the sizing true to size or run a bit small?',
        timestamp: '9:15 AM'
      },
      {
        id: 'msg2',
        senderId: 'seller',
        senderName: 'Tunde Alao',
        text: 'Hello, Zoe! Thanks! It runs true to a standard UK 10. The shoulders are slightly padded which gives it that classic structured drape but it isn’t bulky at all.',
        timestamp: '09:30 AM'
      },
      {
        id: 'msg3',
        senderId: 'buyer',
        senderName: SELLER_ME.name,
        text: 'Perfect! I would love to make an offer. Would you do ₦28,000 for it? I can pay right away.',
        timestamp: '10:00 AM'
      },
      {
        id: 'msg4',
        senderId: 'seller',
        senderName: 'Tunde Alao',
        text: 'I can decrease a bit but ₦28k is slightly low for this label wool blend.',
        timestamp: '10:15 AM'
      },
      {
        id: 'msg5',
        senderId: 'seller',
        senderName: 'Tunde Alao',
        text: 'Let’s meet in the middle with a counter!',
        timestamp: '10:16 AM',
        offer: {
          id: 'offer1',
          amount: 32000,
          currency: 'NGN',
          status: 'pending',
          listingId: 'list1',
          listingTitle: 'Vintage Structured Burgundy Blazer',
          listingImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCG2ayRXiqQnIlyJF3VjDH1k01Sddju0_ESGON58OWVLm6wAd9lZqkKOkv8SgY3AOeR_BM8QMhvf0e6zG1D8ZOpuZCQzqDloHouLQF8oK7RLDWM8MHFV4FkPJE1tc6hxcBGGG7YRAFkfcmVM030kI1-yavwdZuY6AK2he7qHW0waFCdGkv1-fbDhiLPftpRHZ8z6voyLEUXZUxFtJc2zgtlJ_IE18yoO_scJ7FxL4RGQywL8oWuiS--Guw1kyNQqWj-41qPaSbaVUFC',
          listingPrice: 35000,
          initiator: 'seller'
        }
      },
      {
        id: 'msg6',
        senderId: 'seller',
        senderName: 'Tunde Alao',
        text: 'Let’s settle for ₦32,000, happy to ship tomorrow first thing!',
        timestamp: '10:42 AM'
      }
    ]
  },
  {
    id: 'chat2',
    listingId: 'list2',
    buyerName: SELLER_ME.name,
    sellerId: 'seller1',
    sellerName: 'Kemi Adebayo',
    sellerAvatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Offer Accepted! Proceed to checkout.',
    lastTimestamp: 'Yesterday',
    unreadCount: 0,
    messages: [
      {
        id: 'km1',
        senderId: 'buyer',
        senderName: SELLER_ME.name,
        text: 'Hello Kemi, hope your week is great. Would you do ₦40,000 for the croc bag? I will buy it instantly.',
        timestamp: 'Yesterday'
      },
      {
        id: 'km2',
        senderId: 'seller',
        senderName: 'Kemi Adebayo',
        offer: {
          id: 'offer2',
          amount: 45000,
          currency: 'NGN',
          status: 'accepted',
          listingId: 'list2',
          listingTitle: 'Croc-Embossed Orange Leather Shoulder Bag',
          listingImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
          listingPrice: 48000,
          initiator: 'seller'
        },
        timestamp: 'Yesterday'
      },
      {
        id: 'km3',
        senderId: 'seller',
        senderName: 'Kemi Adebayo',
        text: 'Offer Accepted! Proceed to checkout. ₦45,000 sound great. Package is ready for pickup.',
        timestamp: 'Yesterday'
      }
    ]
  }
];

export const INITIAL_WALLET: WalletState = {
  balance: 145000,
  pendingEarnings: 32000,
  bankName: 'GTBank',
  accountNumber: '0123456789',
  accountName: 'Zoe Zebedee',
  transactions: [
    {
      id: 'tx1',
      type: 'sale_earnings',
      title: 'Premium Vintage Boots Sale',
      amount: 45000,
      date: 'May 18, 2026',
      status: 'completed',
      reference: 'TXN-ZEND-7732-K9'
    },
    {
      id: 'tx2',
      type: 'withdrawal',
      title: 'Transfer to Bank (GTBank)',
      amount: -50000,
      date: 'May 15, 2026',
      status: 'completed',
      reference: 'TXN-PAYOUT-0192-A2'
    },
    {
      id: 'tx3',
      type: 'sale_earnings',
      title: 'Silk Backless Top Sale',
      amount: 15000,
      date: 'May 12, 2026',
      status: 'completed',
      reference: 'TXN-ZEND-1102-L4'
    },
    {
      id: 'tx4',
      type: 'purchase',
      title: 'Bought Retro Oversized Sunglasses',
      amount: -15000,
      date: 'May 10, 2026',
      status: 'completed',
      reference: 'TXN-ZEND-3304-P5'
    }
  ]
};

'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { ShoppingCart, Tag, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

export default function Store() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-bold text-slate-500">Loading catalog...</p>
      </div>
    }>
      <StoreContent />
    </React.Suspense>
  );
}

function StoreContent() {
  const { isSignedIn } = useUser();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const { cart, addToCart, removeFromCart, clearCart, checkoutLoading, handleCheckout } = useCart();

  const fallbackProducts: Product[] = [
    { id: '1', name: 'Website Template Pack', description: 'Modern, responsive website templates built with React and Tailwind.', price: 49.99, category: 'templates' },
    { id: '2', name: 'Logo Design Bundle', description: '50+ premium vector brand and esports logo assets.', price: 29.99, category: 'graphics' },
    { id: '3', name: '3D Model Collection', description: 'High-quality 3D assets for digital renders and overlays.', price: 79.99, category: 'assets' },
    { id: '4', name: 'Color Grading Presets', description: 'Professional LUT presets for film and video grading editors.', price: 19.99, category: 'presets' },
    { id: '5', name: 'Social Media Templates', description: 'Instagram grid layouts, YouTube headers, and Twitter templates.', price: 24.99, category: 'templates' },
    { id: '6', name: 'Icon Pack Collection', description: '1000+ custom vector icons designed for UI designers.', price: 24.99, category: 'graphics' },
    { id: '7', name: 'Test Product ($1)', description: 'A test product for verifying checkout configuration.', price: 1.00, category: 'presets' },
  ];

  // Fetch products from database, fall back if credentials are dummy
  useEffect(() => {
    async function getProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.log('Using local fallback products due to connection limits');
        setProducts(fallbackProducts);
      }
    }
    getProducts();

    // Check url search parameters for payment notifications
    if (searchParams.get('success')) {
      setShowSuccess(true);
      clearCart();
    }
  }, [searchParams]);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'templates', label: 'Templates' },
    { value: 'graphics', label: 'Graphics' },
    { value: 'assets', label: '3D Assets' },
    { value: 'presets', label: 'Presets' },
  ];

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Success Alert Banner */}
        {showSuccess && (
          <div className="mx-auto max-w-4xl mb-8 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-4">
            <CheckCircle2 size={32} />
            <div>
              <h3 className="font-extrabold text-lg">Purchase Successful!</h3>
              <p className="text-sm font-medium opacity-90">Thank you for your order. Your digital items are now available for download inside your email inbox.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <section className="mx-auto max-w-7xl relative z-10 text-center flex flex-col items-center gap-4 py-8 mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
            Our <span className="bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">Store</span>
          </h1>
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400 max-w-xl">
            Premium templates, graphic resources, and digital assets.
          </p>
        </section>

        {/* Category Filters */}
        <section className="mx-auto max-w-7xl relative z-10 mb-12 flex flex-col sm:flex-row items-center justify-center gap-4 border-b border-slate-200/40 dark:border-slate-800/40 pb-8">
          <span className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Filter by:</span>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  filter === cat.value
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* Catalog Grid */}
        <section className="mx-auto max-w-7xl relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="group bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Visual Cover placeholder */}
              <div className="aspect-[5/3] w-full bg-gradient-to-br from-teal-400/20 to-indigo-500/20 dark:from-teal-900/30 dark:to-indigo-900/30 flex items-center justify-center relative">
                <Sparkles size={40} className="text-teal-500/40" />
                <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-wider bg-teal-500 text-white px-2.5 py-1 rounded-md">
                  {prod.category}
                </span>
              </div>

              {/* Details */}
              <div className="p-6 flex flex-col gap-3">
                <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-teal-500 transition-colors">
                  {prod.name}
                </h3>
                <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 min-h-[36px]">
                  {prod.description}
                </p>
                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                  <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">
                    ${prod.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => addToCart(prod)}
                    className="bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
}

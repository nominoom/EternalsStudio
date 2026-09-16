'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { supabase } from '../../lib/supabase';
import { ShoppingCart, Tag, Sparkles, CheckCircle2, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAdmin } from '../../context/AdminContext';

import { Product, FALLBACK_PRODUCTS, isProductSoldOut } from '../../lib/catalog';
import Link from 'next/link';

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
  const { isAdminMode, catalogVersion, triggerCatalogRefresh } = useAdmin();

  // Fetch products from database, fall back to rich catalog items
  useEffect(() => {
    async function getProducts() {
      const localCustom = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('localCustomProducts') || '[]') : [];
      const deletedIds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('deletedProductIds') || '[]') : [];

      try {
        const { data, error } = await supabase.from('products').select('*');
        if (error) throw error;
        if (data && data.length > 0) {
          // Merge database items with fallback products so all detailed graphics exist
          const merged = [...data];
          FALLBACK_PRODUCTS.forEach(fb => {
            if (!merged.some(p => p.id === fb.id || p.name === fb.name)) {
              merged.push(fb);
            }
          });
          const combined = [...merged, ...localCustom];
          setProducts(combined.filter((p: Product) => !deletedIds.includes(p.id)));
        } else {
          const combined = [...FALLBACK_PRODUCTS, ...localCustom];
          setProducts(combined.filter((p: Product) => !deletedIds.includes(p.id)));
        }
      } catch (err) {
        console.log('Using local fallback products due to connection limits');
        const combined = [...FALLBACK_PRODUCTS, ...localCustom];
        setProducts(combined.filter((p: Product) => !deletedIds.includes(p.id)));
      }
    }
    getProducts();

    // Check url search parameters for payment notifications
    if (searchParams.get('success')) {
      setShowSuccess(true);
      clearCart();
    }
  }, [searchParams, catalogVersion]);

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    // 1. Immediately remove from local card list state
    setProducts((prev) => prev.filter((p) => p.id !== product.id));

    // 2. Persist deleted product ID in localStorage
    try {
      const deleted = JSON.parse(localStorage.getItem('deletedProductIds') || '[]');
      if (!deleted.includes(product.id)) {
        localStorage.setItem('deletedProductIds', JSON.stringify([...deleted, product.id]));
      }

      // Also clean localCustomProducts
      const localCustom = JSON.parse(localStorage.getItem('localCustomProducts') || '[]');
      const updatedLocal = localCustom.filter((p: any) => p.id !== product.id);
      localStorage.setItem('localCustomProducts', JSON.stringify(updatedLocal));
    } catch (e) {
      console.warn('Error updating localStorage for product deletion:', e);
    }

    // 3. Delete from Supabase database via API route
    try {
      const response = await fetch(`/api/admin/products?id=${product.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (response.ok) {
        alert(`Successfully deleted "${product.name}"!`);
        triggerCatalogRefresh();
      } else {
        console.warn('API route delete warning:', data.error);
        alert(`Deleted "${product.name}" from your catalog.`);
        triggerCatalogRefresh();
      }
    } catch (err: any) {
      console.warn('API deletion failed, removed locally:', err.message);
      alert(`Deleted "${product.name}" from catalog.`);
      triggerCatalogRefresh();
    }
  };

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
          {filteredProducts.map((prod) => {
            const isSold = prod.is_sold || isProductSoldOut(prod.id);
            return (
              <div
                key={prod.id}
                className="group bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  {/* Visual Cover: Render image if present, otherwise gradient fallback */}
                  <Link href={`/store/${prod.id}`} className="block relative aspect-[5/3] w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer">
                    {prod.image_url ? (
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-teal-400/20 to-indigo-500/20 dark:from-teal-900/30 dark:to-indigo-900/30 flex items-center justify-center">
                        <Sparkles size={40} className="text-teal-500/40" />
                      </div>
                    )}

                    {/* Category Badge */}
                    <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-wider bg-teal-500 text-white px-2.5 py-1 rounded-md shadow-sm">
                      {prod.category}
                    </span>

                    {/* Exclusive 1-of-1 Badge */}
                    {prod.is_exclusive && (
                      <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow-sm ${
                        isSold 
                          ? 'bg-rose-500 text-white' 
                          : 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black'
                      }`}>
                        {isSold ? 'SOLD OUT' : '1-OF-1 EXCLUSIVE'}
                      </span>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="p-5 flex flex-col gap-2">
                    <Link href={`/store/${prod.id}`}>
                      <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100 group-hover:text-teal-500 transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                    </Link>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[34px]">
                      {prod.description}
                    </p>
                    
                    <div className="pt-2">
                      <Link
                        href={`/store/${prod.id}`}
                        className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"
                      >
                        <span>View Specs & Showcase</span>
                        <span>&rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="p-5 pt-0">
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Price</span>
                      <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">
                        ${prod.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdminMode && (
                        <button
                          onClick={() => handleDeleteProduct(prod)}
                          className="bg-red-500/15 border border-red-500/30 text-red-500 hover:bg-red-500/25 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Delete Product"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      {isSold ? (
                        <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-2 rounded-lg cursor-not-allowed">
                          Sold Out
                        </span>
                      ) : (
                        <button
                          onClick={() => addToCart(prod)}
                          className="bg-teal-500 hover:bg-teal-600 active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all cursor-pointer shadow-xs"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </>
  );
}

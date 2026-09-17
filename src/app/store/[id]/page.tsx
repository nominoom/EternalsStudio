'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Product, FALLBACK_PRODUCTS, isProductSoldOut } from '../../../lib/catalog';
import { supabase } from '../../../lib/supabase';
import { useCart } from '../../../context/CartContext';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  FileText, 
  Layers, 
  Play, 
  Eye,
  Check,
  Zap,
  Lock
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [isSold, setIsSold] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!productId) return;

      // 1. Check local sold status
      const sold = isProductSoldOut(productId);
      setIsSold(sold);

      // 2. Check fallback products
      const fallback = FALLBACK_PRODUCTS.find(p => p.id === productId);

      // 3. Query Supabase
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single();

        if (!error && data) {
          setProduct({
            ...fallback,
            ...data,
            id: data.id,
            name: data.name,
            price: Number(data.price),
            category: data.category,
            description: data.description,
            image_url: data.image_url || fallback?.image_url,
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Error querying live product from Supabase:', e);
      }

      // 4. Check localStorage custom products
      try {
        const localCustom = JSON.parse(localStorage.getItem('localCustomProducts') || '[]');
        const foundLocal = localCustom.find((p: any) => p.id === productId);
        if (foundLocal) {
          setProduct({
            ...fallback,
            ...foundLocal,
          });
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Error reading local custom products:', e);
      }

      // 5. If fallback found, use it
      if (fallback) {
        setProduct(fallback);
      }

      setLoading(false);
    }

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <p className="text-sm font-bold text-slate-500 animate-pulse">Loading product showcase...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 gap-4 bg-slate-50 dark:bg-slate-950">
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">Product Not Found</h2>
          <p className="text-sm text-slate-500 max-w-sm">The digital item you requested does not exist or has been archived.</p>
          <Link
            href="/store"
            className="mt-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-md"
          >
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const mediaList = product.showcase_images && product.showcase_images.length > 0
    ? product.showcase_images
    : product.image_url
      ? [product.image_url]
      : [];

  const handleAddToCartAndOpen = () => {
    if (isSold) return;
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-12 px-6 sm:px-8">
        {/* Background glow */}
        <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl relative z-10 flex flex-col gap-8">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Link href="/store" className="hover:text-teal-500 transition-colors flex items-center gap-1">
              <ArrowLeft size={14} />
              <span>Catalog</span>
            </Link>
            <span>/</span>
            <span className="uppercase text-teal-600 dark:text-teal-400">{product.category}</span>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300 truncate max-w-xs">{product.name}</span>
          </div>

          {/* Product Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Media Showcase (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* Main Media Viewer */}
              <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-2xl flex items-center justify-center">
                {showVideo && product.demo_video_url ? (
                  <iframe
                    src={product.demo_video_url}
                    title={`${product.name} Demo Video`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : mediaList.length > 0 ? (
                  <img
                    src={mediaList[activeMediaIndex] || mediaList[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="/eternals-logo.jpg"
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Exclusive badge */}
                {product.is_exclusive && (
                  <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs shadow-lg">
                    <Sparkles size={12} />
                    <span>1-OF-1 EXCLUSIVE ITEM</span>
                  </div>
                )}

                {/* Video Switcher Button */}
                {product.demo_video_url && (
                  <button
                    onClick={() => setShowVideo(!showVideo)}
                    className="absolute bottom-4 right-4 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold hover:bg-slate-900 border border-white/20 transition-all cursor-pointer shadow-lg"
                  >
                    <Play size={14} className="text-teal-400" />
                    <span>{showVideo ? 'View Photos' : 'Watch Video Demo'}</span>
                  </button>
                )}
              </div>

              {/* Thumbnails Gallery */}
              {mediaList.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  {mediaList.map((thumb, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveMediaIndex(idx);
                        setShowVideo(false);
                      }}
                      className={`relative h-20 w-32 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        activeMediaIndex === idx && !showVideo
                          ? 'border-teal-500 scale-105 shadow-md shadow-teal-500/20'
                          : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                  {product.demo_video_url && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`relative h-20 w-32 rounded-xl overflow-hidden border-2 bg-slate-900 text-white flex flex-col items-center justify-center gap-1 transition-all cursor-pointer shrink-0 ${
                        showVideo
                          ? 'border-teal-500 scale-105 shadow-md shadow-teal-500/20'
                          : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Play size={20} className="text-teal-400" />
                      <span className="text-[10px] font-bold">Video Demo</span>
                    </button>
                  )}
                </div>
              )}

              {/* Security & Instant Delivery Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3 shadow-xs">
                  <Download size={20} className="text-teal-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-850 dark:text-slate-100">Instant Download</span>
                    <span className="text-[10px] text-slate-400">Available in Client Portal</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3 shadow-xs">
                  <ShieldCheck size={20} className="text-indigo-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-850 dark:text-slate-100">Commercial License</span>
                    <span className="text-[10px] text-slate-400">Royalty-free transfer</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3 shadow-xs">
                  <Zap size={20} className="text-amber-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-850 dark:text-slate-100">Verified Quality</span>
                    <span className="text-[10px] text-slate-400">Crafted by Eternals Studio</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Details & Purchase Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-8 shadow-sm flex flex-col gap-6">
                
                {/* Header info */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                      {product.category}
                    </span>
                    <span className="text-xs font-bold text-slate-400">Digital Asset</span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight leading-snug">
                    {product.name}
                  </h1>

                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-black text-slate-900 dark:text-slate-50">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">USD one-time</span>
                  </div>
                </div>

                {/* Overview */}
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                  {product.fullDescription || product.description}
                </p>

                {/* Exclusive Package notice */}
                {product.is_exclusive && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                    <Lock size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-amber-700 dark:text-amber-400">
                        Exclusive 1-of-1 Package
                      </span>
                      <span className="text-[11px] text-amber-600/90 dark:text-amber-300/80 leading-relaxed mt-0.5">
                        This item will be sold to exactly ONE client. Upon completing checkout, it is permanently closed from the catalog and assigned exclusively to your organization.
                      </span>
                    </div>
                  </div>
                )}

                {/* Features checklist */}
                {product.features && product.features.length > 0 && (
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Included in Package:
                    </span>
                    <ul className="flex flex-col gap-2">
                      {product.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                          <Check size={14} className="text-teal-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Purchase Button */}
                <div className="flex flex-col gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {isSold ? (
                    <div className="w-full py-4 rounded-2xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-extrabold text-sm text-center">
                      Sold Out &bull; Exclusive Item Claimed
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToCartAndOpen}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-400 to-indigo-500 hover:from-teal-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart size={18} />
                      <span>Add to Cart &bull; ${product.price.toFixed(2)}</span>
                    </button>
                  )}

                  <span className="text-[11px] text-center text-slate-400">
                    🔒 Checkout secured by Stripe. Personal & Organization billing options supported.
                  </span>
                </div>

              </div>

              {/* Technical Specifications Sheet */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Technical Specifications
                </h3>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Format</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {product.file_formats ? product.file_formats.join(', ') : 'Vector / Source Files'}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Archive Size</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {product.file_size || 'Instant Source Access'}
                    </span>
                  </div>

                  <div className="flex flex-col p-3 rounded-xl bg-slate-50 dark:bg-slate-950 col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Commercial License</span>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      {product.license || 'Full Commercial Ownership & Distribution Rights'}
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

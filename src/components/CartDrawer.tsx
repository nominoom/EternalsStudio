'use client';

import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, ShoppingCart, Trash2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    checkoutLoading,
    removeFromCart,
    handleCheckout,
    cartTotal,
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Dark backdrop blur */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-350 ease-in-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer Container */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200/50 bg-white shadow-2xl transition-transform duration-350 ease-in-out dark:border-slate-800/50 dark:bg-slate-900 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200/40 px-6 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-teal-500" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">Your Cart</h2>
            {cart.length > 0 && (
              <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-black text-teal-600 dark:text-teal-400">
                {cart.length}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 text-slate-500 hover:bg-slate-100 dark:border-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center gap-4 py-12">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-650">
                <ShoppingCart size={28} />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                  Your cart is empty
                </h3>
                <p className="mt-1 text-sm font-medium text-slate-400 dark:text-slate-500 max-w-[240px]">
                  Explore our premium resources and add templates to get started.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 rounded-xl bg-teal-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-500/10 hover:bg-teal-600 hover:shadow-teal-500/20 active:scale-95 transition-all cursor-pointer"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl border border-slate-200/40 bg-white p-4 dark:border-slate-800/40 dark:bg-slate-900/50 hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                >
                  {/* Decorative icon box */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400/10 to-indigo-500/10 text-teal-500 dark:from-teal-950/20 dark:to-indigo-950/20">
                    <ShoppingCart size={18} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                      {item.category}
                    </span>
                    <h4 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                      {item.name}
                    </h4>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info & Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-slate-200/40 bg-slate-50/50 p-6 dark:border-slate-800/40 dark:bg-slate-950/30">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="text-lg font-black text-slate-900 dark:text-slate-50">
                  ${cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="rounded-xl bg-slate-100/50 p-3 dark:bg-slate-900/50 flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 leading-normal">
                  Secure Checkout powered by Stripe. Downloads are delivered instantly via email.
                </span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 to-indigo-500 py-3 font-bold text-sm text-white shadow-md shadow-teal-500/10 hover:from-teal-500 hover:to-indigo-600 hover:shadow-teal-500/20 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Processing checkout...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
}

interface CartContextType {
  cart: Product[];
  isCartOpen: boolean;
  checkoutLoading: boolean;
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  handleCheckout: () => Promise<void>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn } = useUser();
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Safely load cart from localStorage after mounting (avoiding SSR hydration errors)
  useEffect(() => {
    const savedCart = localStorage.getItem('eternalsCart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
      }
    }
    setIsMounted(true);
  }, []);

  const saveCart = (newCart: Product[]) => {
    setCart(newCart);
    if (typeof window !== 'undefined') {
      localStorage.setItem('eternalsCart', JSON.stringify(newCart));
    }
  };

  const addToCart = (product: Product) => {
    if (cart.some((item) => item.id === product.id)) {
      alert(`${product.name} is already in your cart.`);
      return;
    }
    const newCart = [...cart, product];
    saveCart(newCart);
    setIsCartOpen(true); // Automatically slide open the drawer when adding items
  };

  const removeFromCart = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleCheckout = async () => {
    if (!isSignedIn) {
      alert('Please Sign In to complete your purchase.');
      window.location.href = `/sign-in?redirect_url=${window.location.href}`;
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        throw new Error(data.error || 'Failed to initiate checkout');
      }
    } catch (err: any) {
      alert(err.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + Number(item.price), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        checkoutLoading,
        addToCart,
        removeFromCart,
        clearCart,
        toggleCart,
        setIsCartOpen,
        handleCheckout,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

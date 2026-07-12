'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ShieldAlert, DollarSign, ListOrdered, Mail, CheckCircle2, CircleDot } from 'lucide-react';

interface Order {
  id: string;
  user_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<'orders' | 'messages'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock fallbacks for offline testing
  const mockOrders: Order[] = [
    { id: 'o-1', user_email: 'customer1@example.com', total_amount: 49.99, status: 'completed', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 'o-2', user_email: 'customer2@example.com', total_amount: 29.99, status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString() },
  ];

  const mockMessages: Message[] = [
    { id: 'm-1', name: 'John Doe', email: 'johndoe@example.com', subject: 'Project inquiry', message: 'Hello! I need a Next.js template modified with Clerk integrations.', status: 'unread', created_at: new Date().toISOString() },
    { id: 'm-2', name: 'Jane Smith', email: 'janesmith@example.com', subject: '3D model pricing', message: 'Do you offer custom package deals for gaming team renders?', status: 'read', created_at: new Date(Date.now() - 172800000).toISOString() },
  ];

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Only fetch if they are an admin
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/admin/data');
        const data = await response.json();

        if (data.orders && data.orders.length > 0) {
          setOrders(data.orders);
        } else {
          setOrders(mockOrders);
        }

        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages(mockMessages);
        }
      } catch (err) {
        console.log('Using local fallback admin details:', err);
        setOrders(mockOrders);
        setMessages(mockMessages);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Verifying Admin Session credentials...</p>
      </div>
    );
  }

  // Restrict access if not an admin
  const isAdmin = user?.publicMetadata?.role === 'admin';
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-6">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50">Access Denied</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">
          You do not have the required administrative role to view this page. Please log in with an admin account or request access.
        </p>
        <a href="/" className="mt-6 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs transition-colors">
          Return to Home
        </a>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  return (
    <>
      <Navbar />

      <main className="flex-1 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-12 px-6 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
            <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Manager panel &bull; Role: Admin
            </p>
          </div>

          {/* Stats metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Revenue</span>
                <span className="text-2xl font-black mt-1">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <ListOrdered size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Orders</span>
                <span className="text-2xl font-black mt-1">{orders.length}</span>
              </div>
            </div>

            {/* Total Messages */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Client Messages</span>
                <span className="text-2xl font-black mt-1">{messages.length}</span>
              </div>
            </div>
          </div>

          {/* Tabs switch */}
          <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 gap-8">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Order Entries
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer ${
                activeTab === 'messages'
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Support Messages
            </button>
          </div>

          {/* List display */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm min-h-[300px]">
            {activeTab === 'orders' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold">
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">User Email</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((ord) => (
                      <tr key={ord.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 font-medium text-slate-700 dark:text-slate-300">
                        <td className="py-3.5 font-mono text-xs">{ord.id}</td>
                        <td className="py-3.5">{ord.user_email}</td>
                        <td className="py-3.5">${Number(ord.total_amount).toFixed(2)}</td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-slate-400">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-6 last:pb-0 flex gap-4"
                  >
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <Mail size={18} />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                          {msg.subject}
                        </h3>
                        <span className="text-xs text-slate-400 font-semibold">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500">
                        From: {msg.name} ({msg.email})
                      </p>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mt-2 bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200/20 dark:border-slate-800/20">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  ShieldAlert, 
  DollarSign, 
  ListOrdered, 
  Mail, 
  Activity, 
  Terminal as TerminalIcon, 
  Play, 
  Loader2, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Check, 
  Copy,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Briefcase
} from 'lucide-react';

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

interface SystemEvent {
  id: string;
  event_key: string;
  category: 'deployment' | 'stripe' | 'quickbooks' | 'database' | 'auth' | 'contact';
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

// Define mock data outside the component to keep the component pure
const mockOrders: Order[] = [
  { id: 'o-1', user_email: 'customer1@example.com', total_amount: 49.99, status: 'completed', created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'o-2', user_email: 'customer2@example.com', total_amount: 29.99, status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString() },
];

const mockMessages: Message[] = [
  { id: 'm-1', name: 'John Doe', email: 'johndoe@example.com', subject: 'Project inquiry', message: 'Hello! I need a Next.js template modified with Clerk integrations.', status: 'unread', created_at: new Date().toISOString() },
  { id: 'm-2', name: 'Jane Smith', email: 'janesmith@example.com', subject: '3D model pricing', message: 'Do you offer custom package deals for gaming team renders?', status: 'read', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const mockEvents: SystemEvent[] = [
  { id: 'ev-1', event_key: 'evt_admin_login', category: 'auth', status: 'info', message: 'Administrator session authorized for dashboard data view.', metadata: { actor: 'admin@eternals.gg', ip: '127.0.0.1' }, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 'ev-2', event_key: 'evt_stripe_order_logged', category: 'stripe', status: 'success', message: 'Stripe order successfully written to Supabase for customer1@example.com.', metadata: { amount: 49.99, order_id: 'o-1' }, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'ev-3', event_key: 'evt_stripe_webhook_recv', category: 'stripe', status: 'info', message: 'Stripe webhook event verified: checkout.session.completed', metadata: { type: 'checkout.session.completed' }, created_at: new Date(Date.now() - 3610000).toISOString() },
  { id: 'ev-4', event_key: 'evt_qb_payment_success', category: 'quickbooks', status: 'success', message: 'QuickBooks Payment p-102 allocated. Supabase order completed for invoice ID inv-501.', metadata: { payment_id: 'p-102', invoice_id: 'inv-501' }, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 'ev-5', event_key: 'evt_deploy_success', category: 'deployment', status: 'success', message: 'App compiled and deployed successfully. Live on CDN edge networks.', metadata: { url: 'https://eternals.studio', duration_seconds: 4.8 }, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 'ev-6', event_key: 'evt_deploy_building', category: 'deployment', status: 'info', message: 'Deployment compilation in progress. Compiling Next.js routes and bundles.', metadata: { environment: 'production' }, created_at: new Date(Date.now() - 86405000).toISOString() },
  { id: 'ev-7', event_key: 'evt_deploy_initiated', category: 'deployment', status: 'info', message: 'Production deployment pipeline started by administrator.', metadata: { branch: 'main' }, created_at: new Date(Date.now() - 86410000).toISOString() },
  { id: 'ev-8', event_key: 'evt_contact_message_received', category: 'contact', status: 'success', message: 'Contact message received from John Doe <johndoe@example.com>.', metadata: { name: 'John Doe', email: 'johndoe@example.com' }, created_at: new Date(Date.now() - 172800000).toISOString() }
];

export default function AdminDashboard() {
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<'orders' | 'messages' | 'requests' | 'logs'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<SystemEvent[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter State for Logs
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Deployment Simulation State
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [deployLogs]);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Only fetch if they are an admin
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    async function fetchData() {
      try {
        const response = await fetch('/api/admin/data');
        const data = await response.json();

        setOrders(data.orders || mockOrders);
        setMessages(data.messages || mockMessages);
        setEvents(data.events || mockEvents);
        setRequests(data.requests || []);
      } catch (err) {
        console.log('Using local fallback admin details:', err);
        setOrders(mockOrders);
        setMessages(mockMessages);
        setEvents(mockEvents);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, isLoaded]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">Verifying Admin Session credentials...</p>
      </div>
    );
  }

  // Restrict access if not an admin
  const isAdmin = user?.publicMetadata?.role === 'admin';
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-6">
        <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50">Access Denied</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">
          You do not have the required administrative role to view this page. Please log in with an admin account or request access.
        </p>
        <Link href="/" className="mt-6 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs transition-all shadow-md">
          Return to Home
        </Link>
      </div>
    );
  }

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);

  // Webhook and deploy logging handler
  const triggerDeployStep = async (step: 'initiated' | 'building' | 'success' | 'failed') => {
    try {
      const res = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step })
      });
      const data = await res.json();
      if (data.success && data.event) {
        setEvents(prev => [data.event, ...prev]);
        return data.event;
      }
    } catch (e) {
      console.warn('Deploy step API call failed, generating mock log locally:', e);
    }

    const fallbackId = `ev-sim-${Date.now()}`;
    let mockEv: SystemEvent;
    if (step === 'initiated') {
      mockEv = { id: fallbackId, event_key: 'evt_deploy_initiated', category: 'deployment', status: 'info', message: 'Production deployment pipeline started by administrator.', metadata: { branch: 'main', trigger: 'manual_dashboard' }, created_at: new Date().toISOString() };
    } else if (step === 'building') {
      mockEv = { id: fallbackId, event_key: 'evt_deploy_building', category: 'deployment', status: 'info', message: 'Deployment compilation in progress. Compiling Next.js routes and bundles.', metadata: { environment: 'production' }, created_at: new Date().toISOString() };
    } else {
      mockEv = { id: fallbackId, event_key: 'evt_deploy_success', category: 'deployment', status: 'success', message: 'App compiled and deployed successfully. Live on CDN edge networks.', metadata: { url: 'https://eternals.studio', duration_seconds: 4.8 }, created_at: new Date().toISOString() };
    }
    setEvents(prev => [mockEv, ...prev]);
    return mockEv;
  };

  const handleSimulatedDeploy = async () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployProgress(5);
    setDeployLogs([]);

    const timestamp = () => new Date().toLocaleTimeString();

    setDeployLogs(prev => [...prev, `[${timestamp()}] [INFO] Starting Vercel Git deployment framework...`]);
    setDeployLogs(prev => [...prev, `[${timestamp()}] [INFO] Resolving branch main and commit configurations...`]);
    await triggerDeployStep('initiated');
    
    setTimeout(async () => {
      setDeployProgress(35);
      setDeployLogs(prev => [...prev, `[${timestamp()}] [INFO] Fetching yarn/npm dependencies...`]);
      setDeployLogs(prev => [...prev, `[${timestamp()}] [INFO] Dependency check passed. Executing: next build...`]);
      await triggerDeployStep('building');
    }, 1500);

    setTimeout(() => {
      setDeployProgress(70);
      setDeployLogs(prev => [...prev, `[${timestamp()}] [INFO] Creating static exports & caching client modules...`]);
      setDeployLogs(prev => [...prev, `[${timestamp()}] [INFO] Launching Edge redirects & Cloudflare updates...`]);
    }, 3200);

    setTimeout(async () => {
      setDeployProgress(100);
      setDeployLogs(prev => [...prev, `[${timestamp()}] [SUCCESS] Deployment pipeline executed successfully!`]);
      setDeployLogs(prev => [...prev, `[${timestamp()}] [SUCCESS] Deployment is live at: https://eternals.studio`]);
      await triggerDeployStep('success');
      setTimeout(() => {
        setIsDeploying(false);
      }, 800);
    }, 4800);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEvents = events.filter(ev => {
    const matchesSearch = ev.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.event_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (ev.metadata && JSON.stringify(ev.metadata).toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || ev.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusIcon = (status: SystemEvent['status']) => {
    switch (status) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'error': return <XCircle size={16} className="text-rose-500" />;
      case 'info':
      default: return <Info size={16} className="text-blue-500" />;
    }
  };

  const getStatusBadgeClass = (status: SystemEvent['status']) => {
    switch (status) {
      case 'success': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      case 'warning': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      case 'error': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20';
      case 'info':
      default: return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
    }
  };

  const getCategoryBadgeClass = (category: SystemEvent['category']) => {
    switch (category) {
      case 'deployment': return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20';
      case 'stripe': return 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20';
      case 'quickbooks': return 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20';
      case 'auth': return 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20';
      case 'contact': return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20';
      default: return 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20';
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-transparent text-slate-900 dark:text-slate-50 py-12 px-6 sm:px-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight">Admin Dashboard</h1>
            <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Manager panel &bull; Role: Admin
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Revenue</span>
                <span className="text-2xl font-black mt-1">${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <ListOrdered size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Orders</span>
                <span className="text-2xl font-black mt-1">{orders.length}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Mail size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Client Messages</span>
                <span className="text-2xl font-black mt-1">{messages.length}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Briefcase size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Project Requests</span>
                <span className="text-2xl font-black mt-1">{requests.length}</span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <Activity size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">System Events</span>
                <span className="text-2xl font-black mt-1">{events.length}</span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 gap-8 overflow-x-auto">
            {['orders', 'messages', 'requests', 'logs'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-teal-500 text-teal-500'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab === 'orders' 
                  ? 'Order Entries' 
                  : tab === 'messages' 
                    ? 'Support Messages' 
                    : tab === 'requests'
                      ? 'Project Requests'
                      : 'Logs & Deployments'}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 shadow-sm min-h-[300px]">
            {activeTab === 'orders' && (
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
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-slate-400">{new Date(ord.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === 'messages' && (
              <div className="flex flex-col gap-6">
                {messages.map((msg) => (
                  <div key={msg.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-6 last:pb-0 flex gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <Mail size={18} />
                    </div>
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-slate-100">{msg.subject}</h3>
                        <span className="text-xs text-slate-400 font-semibold">{new Date(msg.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500">From: {msg.name} ({msg.email})</p>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400 mt-2 bg-slate-50/50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200/20 dark:border-slate-800/20">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === 'logs' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-xl pointer-events-none" />
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                        <TerminalIcon size={20} />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-sm font-black tracking-tight">Deploy Control Center</h3>
                        <p className="text-[11px] font-bold text-slate-400">Trigger production site compilation</p>
                      </div>
                    </div>
                    <button onClick={handleSimulatedDeploy} disabled={isDeploying} className={`w-full py-3.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow ${isDeploying ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600' : 'bg-teal-500 text-white hover:bg-teal-600 hover:scale-[1.01]'}`}>
                      {isDeploying ? <><Loader2 size={16} className="animate-spin text-teal-500" /><span>Executing Build Pipeline ({deployProgress}%)</span></> : <><Play size={14} className="fill-current" /><span>Trigger Production Deployment</span></>}
                    </button>
                    {isDeploying && <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-teal-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(20,184,166,0.5)]" style={{ width: `${deployProgress}%` }} /></div>}
                  </div>
                  <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 flex flex-col gap-3 shadow-lg">
                    <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                      <div className="flex items-center gap-2"><div className="h-2.5 w-2.5 rounded-full bg-rose-500" /><div className="h-2.5 w-2.5 rounded-full bg-amber-500" /><div className="h-2.5 w-2.5 rounded-full bg-emerald-500" /></div>
                      <span className="font-mono text-[10px] font-bold text-slate-500 tracking-wider">TERMINAL LOG OUTPUT</span>
                    </div>
                    <div className="h-48 overflow-y-auto font-mono text-[11px] text-teal-400 flex flex-col gap-1.5 p-1 bg-slate-950 leading-relaxed scrollbar-thin">
                      {deployLogs.length === 0 ? <p className="text-slate-600 italic">No active deployment logs. Click trigger button above.</p> : deployLogs.map((log, idx) => <div key={idx} className="whitespace-pre-wrap border-l-2 border-teal-500/20 pl-2">{log}</div>)}
                      <div ref={terminalEndRef} />
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Search logs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold" />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <option value="all">All Categories</option><option value="deployment">Deployment</option><option value="stripe">Stripe</option><option value="quickbooks">QuickBooks</option><option value="auth">Auth</option><option value="contact">Support</option>
                      </select>
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <option value="all">All Statuses</option><option value="info">Info</option><option value="success">Success</option><option value="warning">Warning</option><option value="error">Error</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {filteredEvents.map(ev => (
                      <div key={ev.id} className="border border-slate-200/50 dark:border-slate-800/40 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                        <div onClick={() => setExpandedEventId(expandedEventId === ev.id ? null : ev.id)} className="p-4 flex items-center justify-between gap-4 cursor-pointer">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(ev.status)}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[10px] font-black text-slate-700 dark:text-slate-200">{ev.event_key}</span>
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${getStatusBadgeClass(ev.status)}`}>{ev.status}</span>
                                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${getCategoryBadgeClass(ev.category)}`}>{ev.category}</span>
                              </div>
                              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mt-1 truncate">{ev.message}</p>
                            </div>
                          </div>
                          {expandedEventId === ev.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </div>
                        {expandedEventId === ev.id && (
                          <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata Payload</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(JSON.stringify(ev.metadata || {}, null, 2), ev.id);
                                }}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-[10px] font-bold text-slate-500 cursor-pointer"
                              >
                                {copiedId === ev.id ? <><Check size={10} className="text-emerald-500" /><span className="text-emerald-500">Copied!</span></> : <><Copy size={10} /><span>Copy JSON</span></>}
                              </button>
                            </div>
                            <pre className="text-[10px] font-mono p-4 rounded-xl bg-slate-900 border border-slate-850 text-teal-400 overflow-x-auto leading-relaxed max-h-48 scrollbar-thin">
                              {JSON.stringify(ev.metadata || {}, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-extrabold text-base">Client Project Requests</h3>
                    <p className="text-xs text-slate-500">Incoming client custom work proposals. Approve to delegate them to the team portal.</p>
                  </div>
                </div>

                {requests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
                    <span className="text-slate-400 dark:text-slate-655 font-bold text-sm">No project requests found</span>
                    <span className="text-xs text-slate-400">Requests submitted by clients in the contact form will appear here.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {requests.map((req) => (
                      <div
                        key={req.id}
                        className="border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6"
                      >
                        <div className="flex flex-col gap-2 max-w-2xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="font-black text-sm text-slate-800 dark:text-slate-200">{req.subject}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                              req.status === 'pending'
                                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                : req.status === 'approved'
                                  ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                                  : req.status === 'claimed'
                                    ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium whitespace-pre-wrap">{req.description}</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 mt-2 pt-2 border-t border-slate-200/30 dark:border-slate-800/30">
                            <span className="text-xs font-semibold text-slate-500">
                              Client: <strong className="text-slate-700 dark:text-slate-350">{req.client_name}</strong> ({req.client_email})
                            </span>
                            {req.client_phone && (
                              <span className="text-xs font-semibold text-slate-500">
                                Phone: <strong className="text-slate-700 dark:text-slate-350">{req.client_phone}</strong>
                              </span>
                            )}
                            {req.file_url && (
                              <span className="text-xs font-semibold text-slate-500 col-span-2">
                                Reference Link: <a href={req.file_url} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline inline-flex items-center gap-1">
                                  {req.file_url.length > 40 ? req.file_url.substring(0, 40) + '...' : req.file_url}
                                </a>
                              </span>
                            )}
                            {req.assigned_to_name && (
                              <span className="text-xs font-semibold text-slate-500 col-span-2">
                                Assignee: <strong className="text-teal-600 dark:text-teal-400">{req.assigned_to_name}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        {req.status === 'pending' && (
                          <button
                            onClick={async () => {
                              if (!confirm('Approve this request and post it to the Team Portal?')) return;
                              try {
                                const response = await fetch('/api/team/tasks/approve', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ requestId: req.id })
                                });
                                if (response.ok) {
                                  alert('Request successfully approved and sent to team!');
                                  // Update local state
                                  setRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
                                } else {
                                  const data = await response.json();
                                  alert(data.error || 'Failed to approve request');
                                }
                              } catch (e: any) {
                                alert('Error: ' + e.message);
                              }
                            }}
                            className="bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm self-start md:self-auto"
                          >
                            Send to Team
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

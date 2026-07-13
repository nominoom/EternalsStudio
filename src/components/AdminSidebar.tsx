'use client';

import React, { useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { X, Shield, Plus, Loader2, Play, CheckCircle2, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function AdminSidebar() {
  const {
    isAdminMode,
    setIsAdminMode,
    isAdminSidebarOpen,
    setIsAdminSidebarOpen,
    triggerCatalogRefresh,
  } = useAdmin();

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deployLoading, setDeployLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form State - Tab
  const [adminFormTab, setAdminFormTab] = useState<'product' | 'portfolio'>('product');

  // Form State - Product
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('templates');
  const [imageUrl, setImageUrl] = useState('');

  // Form State - Portfolio
  const [portTitle, setPortTitle] = useState('');
  const [portSubtitle, setPortSubtitle] = useState('');
  const [portCategory, setPortCategory] = useState('branding');
  const [portDescription, setPortDescription] = useState('');
  const [portTags, setPortTags] = useState('');
  const [portImageUrl, setPortImageUrl] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling when sidebar is open
  useEffect(() => {
    if (isAdminSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAdminSidebarOpen]);

  if (!mounted) return null;

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) {
      setFeedback({ type: 'error', message: 'Name, Price, and Category are required.' });
      return;
    }

    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFeedback({ type: 'error', message: 'Please enter a valid positive price.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const productPayload = {
      name,
      description,
      price: priceNum,
      category,
      image_url: imageUrl || '',
    };

    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ type: 'success', message: `Successfully added "${name}" to database!` });
        // Clear Form
        setName('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        triggerCatalogRefresh();
      } else {
        throw new Error(data.error || 'Server error adding product');
      }
    } catch (err: any) {
      console.warn('API route failed, adding locally to browser storage:', err.message);
      
      // Fallback: Save in localStorage for local testing/development
      try {
        const localCustom = JSON.parse(localStorage.getItem('localCustomProducts') || '[]');
        const newProduct = {
          id: `local-${Date.now()}`,
          ...productPayload,
        };
        localStorage.setItem('localCustomProducts', JSON.stringify([...localCustom, newProduct]));
        
        setFeedback({
          type: 'success',
          message: `Added "${name}" locally to browser storage (Supabase connection bypassed).`,
        });
        
        // Clear Form
        setName('');
        setDescription('');
        setPrice('');
        setImageUrl('');
        triggerCatalogRefresh();
      } catch (fallbackErr) {
        setFeedback({ type: 'error', message: 'Failed to write product locally.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUploadPortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portTitle || !portSubtitle || !portCategory || !portDescription) {
      setFeedback({ type: 'error', message: 'Title, Subtitle, Category, and Description are required.' });
      return;
    }

    setLoading(true);
    setFeedback(null);

    const tagsArray = portTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const portfolioPayload = {
      title: portTitle,
      subtitle: portSubtitle,
      category: portCategory,
      description: portDescription,
      tags: tagsArray,
      image_url: portImageUrl || '',
    };

    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(portfolioPayload),
      });

      const data = await response.json();

      if (response.ok) {
        setFeedback({ type: 'success', message: `Successfully uploaded "${portTitle}" to portfolio!` });
        // Clear Form
        setPortTitle('');
        setPortSubtitle('');
        setPortDescription('');
        setPortTags('');
        setPortImageUrl('');
        triggerCatalogRefresh();
      } else {
        throw new Error(data.error || 'Server error uploading portfolio project');
      }
    } catch (err: any) {
      console.warn('API portfolio upload failed, adding locally to browser storage:', err.message);

      // Fallback: Save in localStorage custom portfolio array
      try {
        const localPortfolio = JSON.parse(localStorage.getItem('localCustomPortfolio') || '[]');
        const newProject = {
          id: `local-proj-${Date.now()}`,
          ...portfolioPayload,
          badges: ['Client'],
        };
        localStorage.setItem('localCustomPortfolio', JSON.stringify([...localPortfolio, newProject]));

        setFeedback({
          type: 'success',
          message: `Uploaded "${portTitle}" locally to browser storage (Supabase bypass).`,
        });

        // Clear Form
        setPortTitle('');
        setPortSubtitle('');
        setPortDescription('');
        setPortTags('');
        setPortImageUrl('');
        triggerCatalogRefresh();
      } catch (fallbackErr) {
        setFeedback({ type: 'error', message: 'Failed to write portfolio project locally.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDeploy = async () => {
    if (deployLoading) return;
    setDeployLoading(true);
    setFeedback(null);

    try {
      // Step 1: Initiate
      await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'initiated' }),
      });

      // Step 2: Build
      await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'building' }),
      });

      // Step 3: Success
      const res = await fetch('/api/admin/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ step: 'success' }),
      });

      if (res.ok) {
        setFeedback({ type: 'success', message: 'Deployment triggered and completed successfully on edge CDN!' });
      } else {
        throw new Error('Deploy pipeline step error');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: 'Deploy API failed. Logging mock deploy events locally.' });
    } finally {
      setDeployLoading(false);
    }
  };

  return (
    <>
      {/* Sidebar Backdrop blur */}
      <div
        className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-350 ease-in-out ${
          isAdminSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsAdminSidebarOpen(false)}
      />

      {/* Sidebar Drawer Container */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200/50 bg-white shadow-2xl transition-transform duration-350 ease-in-out dark:border-slate-800/50 dark:bg-slate-900 ${
          isAdminSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex h-20 items-center justify-between border-b border-slate-200/40 px-6 dark:border-slate-800/40">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-teal-600 dark:text-teal-400" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-slate-50">Admin Console</h2>
          </div>
          <button
            onClick={() => setIsAdminSidebarOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/60 text-slate-500 hover:bg-slate-100 dark:border-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close admin console"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          
          {/* Admin Toggle Options */}
          <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-4 flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              General Controls
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold">Admin Edit Mode</span>
                <span className="text-xs text-slate-500">Shows administrative tools on the site pages</span>
              </div>
              <button
                onClick={() => setIsAdminMode(!isAdminMode)}
                className={`flex h-10 px-4 items-center gap-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                  isAdminMode
                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-450 border-slate-200 dark:border-slate-800'
                }`}
              >
                {isAdminMode ? (
                  <>
                    <Eye size={14} />
                    <span>Enabled</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} />
                    <span>Disabled</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Form Tabs Selector */}
          <div className="flex border-b border-slate-200/40 dark:border-slate-800/40 pb-1 mt-2">
            <button
              onClick={() => { setAdminFormTab('product'); setFeedback(null); }}
              className={`flex-1 pb-2.5 text-[11px] font-black uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                adminFormTab === 'product'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Add Product
            </button>
            <button
              onClick={() => { setAdminFormTab('portfolio'); setFeedback(null); }}
              className={`flex-1 pb-2.5 text-[11px] font-black uppercase tracking-wider transition-colors border-b-2 cursor-pointer ${
                adminFormTab === 'portfolio'
                  ? 'border-teal-500 text-teal-600 dark:text-teal-400'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Add Portfolio
            </button>
          </div>

          {/* Add Product Form */}
          {adminFormTab === 'product' ? (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Add Store Product
              </h3>
              <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Product Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Lightroom LUT Pack"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product details..."
                    rows={3}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Price ($ USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1.00"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all cursor-pointer"
                    >
                      <option value="templates">Templates</option>
                      <option value="graphics">Graphics</option>
                      <option value="assets">3D Assets</option>
                      <option value="presets">Presets</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Image URL (Optional)</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.png"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-650 text-white font-bold py-3 hover:bg-teal-700 shadow-md disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  <span>Add Product to Store</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Add Portfolio Project
              </h3>
              <form onSubmit={handleUploadPortfolio} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Project Title</label>
                  <input
                    type="text"
                    value={portTitle}
                    onChange={(e) => setPortTitle(e.target.value)}
                    placeholder="e.g. Midas Esports Mascot"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Subtitle</label>
                    <input
                      type="text"
                      value={portSubtitle}
                      onChange={(e) => setPortSubtitle(e.target.value)}
                      placeholder="e.g. Vector Logo Art"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Category</label>
                    <select
                      value={portCategory}
                      onChange={(e) => setPortCategory(e.target.value)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all cursor-pointer"
                    >
                      <option value="branding">Branding</option>
                      <option value="esports">Esports</option>
                      <option value="sports">Sports</option>
                      <option value="3d">3D Model</option>
                      <option value="illustration">Illustration</option>
                      <option value="design">Design</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Description</label>
                  <textarea
                    value={portDescription}
                    onChange={(e) => setPortDescription(e.target.value)}
                    placeholder="Brief scope summary..."
                    rows={3}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={portTags}
                    onChange={(e) => setPortTags(e.target.value)}
                    placeholder="Esports, Mascot, Vector"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-455">Image URL</label>
                  <input
                    type="text"
                    value={portImageUrl}
                    onChange={(e) => setPortImageUrl(e.target.value)}
                    placeholder="https://example.com/project-cover.png"
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-teal-650 text-white font-bold py-3 hover:bg-teal-700 shadow-md disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                  <span>Upload Portfolio Item</span>
                </button>
              </form>
            </div>
          )}

          {/* Feedback Messages */}
          {feedback && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 text-sm ${
                feedback.type === 'success'
                  ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-650 dark:text-emerald-400'
                  : 'border-rose-500/20 bg-rose-500/10 text-rose-650 dark:text-rose-450'
              }`}
            >
              {feedback.type === 'success' ? <CheckCircle2 size={16} className="mt-0.5" /> : <AlertTriangle size={16} className="mt-0.5" />}
              <span className="font-semibold">{feedback.message}</span>
            </div>
          )}

          <hr className="border-slate-200/40 dark:border-slate-800/40" />

          {/* Quick Actions */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Quick Admin Actions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleQuickDeploy}
                disabled={deployLoading}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-transparent text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950/50 py-3 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
              >
                {deployLoading ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
                <span>Redeploy CDN</span>
              </button>

              <a
                href="/admin"
                onClick={() => setIsAdminSidebarOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-teal-600/30 bg-teal-500/5 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 py-3 text-xs font-bold transition-all text-center cursor-pointer"
              >
                <Shield size={14} />
                <span>Full Dashboard</span>
              </a>
            </div>
          </div>

        </div>
      </aside>
    </>
  );
}

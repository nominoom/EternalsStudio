'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Briefcase, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  HelpCircle,
  Play,
  FileText
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ProjectRequest {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  subject: string;
  description: string;
  file_url?: string;
  status: 'pending' | 'awaiting_payment' | 'approved' | 'claimed' | 'completed';
  invoice_url?: string;
  invoice_amount?: number;
  assigned_to_name?: string;
  created_at: string;
}

export default function ClientPortal() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [verifying, setVerifying] = useState<boolean>(false);

  // Helper to fetch and merge client requests
  async function fetchRequests(email: string) {
    let dbRequests: ProjectRequest[] = [];
    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('client_email', email)
        .order('created_at', { ascending: false });

      if (!error && data) {
        dbRequests = data as ProjectRequest[];
      }
    } catch (e) {
      console.warn('Failed to query live database project requests:', e);
    }

    // Merge with localStorage custom requests (for offline/local testing)
    const localRequests = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem('localCustomRequests') || '[]') 
      : [];

    // Filter out duplicates (if any local request is now in the database)
    const uniqueLocal = localRequests.filter(
      (lr: any) => !dbRequests.some((dr: any) => dr.id === lr.id)
    );

    setRequests([...dbRequests, ...uniqueLocal]);
    setLoading(false);
  }

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect_url=${window.location.href}`;
      return;
    }

    const email = user.emailAddresses?.[0]?.emailAddress;
    if (!email) {
      setLoading(false);
      return;
    }

    // Check if redirecting from a mock checkout payment or real checkout payment
    const urlParams = new URLSearchParams(window.location.search);
    const mockPayment = urlParams.get('mock_payment') === 'true';
    const requestId = urlParams.get('request_id');
    const success = urlParams.get('success') === 'true';
    const sessionId = urlParams.get('session_id');

    async function handlePaymentRedirects() {
      if (mockPayment && requestId) {
        // 1. Update status in database
        try {
          const { error } = await supabase
            .from('project_requests')
            .update({ status: 'approved' })
            .eq('id', requestId);
          
          if (error) throw error;
          console.log('Successfully updated mock request status to approved in Supabase');
        } catch (err: any) {
          console.warn('Failed to update mock request status in database:', err.message);
        }

        // 2. Mock update local storage status
        const localRequests = JSON.parse(localStorage.getItem('localCustomRequests') || '[]');
        const updated = localRequests.map((r: any) => 
          r.id === requestId ? { ...r, status: 'approved' } : r
        );
        localStorage.setItem('localCustomRequests', JSON.stringify(updated));

        // Alert mock checkouts
        alert('Success: Mock payment complete! Your project status is updated to "Approved" (Paid) and has been delegated as an Open Task in the Team Portal.');
        
        // Clean URL params
        window.history.replaceState({}, document.title, window.location.pathname);
        fetchRequests(email);
      } else if (success && sessionId) {
        setVerifying(true);
        try {
          const response = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
          });
          const data = await response.json();
          if (response.ok && data.success) {
            alert('Success: Your project invoice payment has been confirmed! Your request is now delegated as an active task in the Team Portal.');
          } else {
            alert(data.error || 'Payment verification completed, but could not update status. Please refresh or contact support.');
          }
        } catch (err: any) {
          alert('Error verifying payment: ' + err.message);
        } finally {
          setVerifying(false);
          // Clean URL params
          window.history.replaceState({}, document.title, window.location.pathname);
          fetchRequests(email);
        }
      } else {
        fetchRequests(email);
      }
    }

    handlePaymentRedirects();
  }, [user, isLoaded, isSignedIn]);

  if (!isLoaded || loading || verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">
          {verifying ? 'Verifying Stripe checkout payment status...' : 'Loading Client Dashboard...'}
        </p>
      </div>
    );
  }

  const getStatusLabel = (status: ProjectRequest['status']) => {
    switch (status) {
      case 'pending': return 'Awaiting Review';
      case 'awaiting_payment': return 'Quote Ready (Action Needed)';
      case 'approved': return 'Approved (In Queue)';
      case 'claimed': return 'In Progress';
      case 'completed': return 'Completed';
    }
  };

  const getStatusIcon = (status: ProjectRequest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500 animate-pulse" size={18} />;
      case 'awaiting_payment': return <CreditCard className="text-blue-500" size={18} />;
      case 'approved': return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'claimed': return <Play className="text-teal-500" size={18} />;
      case 'completed': return <CheckCircle2 className="text-teal-650" size={18} />;
    }
  };

  // Helper to draw stages steps pipeline
  const renderPipeline = (currentStatus: ProjectRequest['status']) => {
    const stages: { key: ProjectRequest['status']; label: string }[] = [
      { key: 'pending', label: '1. Reviewing' },
      { key: 'awaiting_payment', label: '2. Quote' },
      { key: 'approved', label: '3. Paid' },
      { key: 'claimed', label: '4. In Progress' },
      { key: 'completed', label: '5. Completed' }
    ];

    const getStageIndex = (status: ProjectRequest['status']) => {
      return stages.findIndex(s => s.key === status);
    };

    const currentIndex = getStageIndex(currentStatus);

    return (
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        {stages.map((stage, idx) => {
          const isDone = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          
          return (
            <div key={stage.key} className="flex-1 flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                  isDone 
                    ? 'bg-teal-500 border-teal-500 text-white' 
                    : 'bg-transparent border-slate-350 dark:border-slate-700 text-slate-400'
                } ${isCurrent ? 'ring-4 ring-teal-500/20' : ''}`}>
                  {isDone ? '✓' : idx + 1}
                </span>
                <span className={`text-[10px] font-bold tracking-tight transition-all ${
                  isDone ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400'
                } ${isCurrent ? 'text-teal-600 dark:text-teal-400 font-extrabold' : ''}`}>
                  {stage.label.split('. ')[1]}
                </span>
              </div>
              {idx < stages.length - 1 && (
                <div className={`hidden sm:block flex-1 h-0.5 transition-all ${
                  idx < currentIndex ? 'bg-teal-500' : 'bg-slate-200 dark:bg-slate-800'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Header */}
        <section className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight">Client Portal</h1>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              My Design & Development Projects
            </p>
          </div>
          
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs px-5 py-3 transition-all shadow-md self-start md:self-auto cursor-pointer"
          >
            <Briefcase size={14} />
            <span>Submit New Request</span>
          </Link>
        </section>

        {/* Board Container */}
        <section className="mx-auto max-w-7xl relative z-10">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px]">
            
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Project Pipeline</h3>
                <p className="text-xs text-slate-500">Track quotes, payments, active assignments, and timeline completion states.</p>
              </div>

              {requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                  <Briefcase size={48} className="text-slate-300 dark:text-slate-700 animate-bounce" />
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm block">No project proposals found</span>
                    <span className="text-xs text-slate-400 block mt-1">Submit custom specs in our contact page to open a pipeline.</span>
                  </div>
                  <Link
                    href="/contact"
                    className="mt-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-bold px-5 py-2.5 transition-colors border border-slate-200/60 dark:border-slate-800/60"
                  >
                    Go to Contact Form
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {requests.map((req) => (
                    <div 
                      key={req.id}
                      className="border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 bg-slate-50/30 dark:bg-slate-950/20 flex flex-col gap-5 transition-all hover:border-slate-350 dark:hover:border-slate-800"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-black text-base text-slate-850 dark:text-slate-250">{req.subject}</span>
                          <span className="text-[10px] text-slate-400">Created: {new Date(req.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400">
                            {getStatusIcon(req.status)}
                            <span>{getStatusLabel(req.status)}</span>
                          </span>

                          {req.invoice_amount && (
                            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                              Quote: ${Number(req.invoice_amount).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 whitespace-pre-wrap">{req.description}</p>

                      {/* File specs download links */}
                      {req.file_url && (
                        <div className="flex items-center gap-2 text-xs text-slate-450 border border-slate-200/30 dark:border-slate-800/30 rounded-xl px-4 py-2.5 bg-white dark:bg-slate-905 w-fit">
                          <FileText size={14} className="text-teal-500" />
                          <span>Attached References:</span>
                          <a href={req.file_url} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline flex items-center gap-0.5 font-bold">
                            <span>Open Link</span>
                            <ExternalLink size={10} />
                          </a>
                        </div>
                      )}

                      {/* Project Assignee Details */}
                      {req.assigned_to_name && (
                        <div className="text-xs text-slate-500 font-semibold bg-teal-500/5 border border-teal-500/10 px-4 py-2.5 rounded-xl w-fit">
                          Studio Designer Assigned: <strong className="text-teal-600 dark:text-teal-400">{req.assigned_to_name}</strong>
                        </div>
                      )}

                      {/* Action trigger: quote invoice link */}
                      {req.status === 'awaiting_payment' && req.invoice_url && (
                        <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                          <div className="flex items-center gap-3">
                            <CreditCard className="text-blue-500" size={24} />
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-black text-slate-800 dark:text-slate-200">Quote Invoice Prepared</span>
                              <span className="text-[10px] text-slate-500 mt-0.5">Please review the custom project pricing and complete payment.</span>
                            </div>
                          </div>

                          <a
                            href={req.invoice_url}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md flex items-center gap-1.5 text-center cursor-pointer w-full sm:w-auto justify-center"
                          >
                            <CreditCard size={14} />
                            <span>Pay Custom Quote Invoice (${Number(req.invoice_amount).toFixed(2)})</span>
                          </a>
                        </div>
                      )}

                      {/* Visual Steps */}
                      {renderPipeline(req.status)}
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

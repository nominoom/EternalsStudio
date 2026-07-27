'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  ShieldAlert, 
  Briefcase, 
  Users, 
  CheckCircle2, 
  ExternalLink, 
  Loader2, 
  Play, 
  UserPlus, 
  Check, 
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Building2,
  User,
  Percent,
  FileText,
  Paperclip
} from 'lucide-react';

interface Collaborator {
  user_id: string;
  user_name: string;
}

interface Task {
  id: string;
  client_name: string;
  client_email: string;
  client_phone?: string;
  subject: string;
  description: string;
  file_url?: string;
  status: 'pending' | 'approved' | 'claimed' | 'completed';
  assigned_to_id?: string;
  assigned_to_name?: string;
  created_at: string;
  download_url?: string;
  invoice_amount?: number;
  payout_cut_percentage?: number;
  scope_type?: 'personal' | 'organization';
  organization_name?: string;
  attachments?: any[];
  collaborators: Collaborator[];
}

export default function TeamPortal() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'open' | 'active' | 'completed' | 'payouts'>('open');

  async function fetchTasks() {
    try {
      const response = await fetch('/api/team/tasks');
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error('Error fetching team tasks:', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!isLoaded) return;
    
    // Redirect if not signed in
    if (!isSignedIn) {
      window.location.href = `/sign-in?redirect_url=${window.location.href}`;
      return;
    }

    const role = user?.publicMetadata?.role;
    const hasAccess = role === 'admin' || role === 'team';
    if (!hasAccess) {
      setLoading(false);
      return;
    }

    fetchTasks();
  }, [user, isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">Verifying Team Authorization credentials...</p>
      </div>
    );
  }

  // Auth Guard
  const role = user?.publicMetadata?.role;
  const hasAccess = role === 'admin' || role === 'team';

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-6">
        <ShieldAlert size={64} className="text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-50">Access Denied</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2 text-center max-w-sm">
          You do not have a registered Team or Administrative role. Please contact management to authorize your account.
        </p>
        <Link href="/" className="mt-6 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs transition-all shadow-md">
          Return to Home
        </Link>
      </div>
    );
  }

  const handleClaimTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to claim this task?')) return;
    setActionLoadingId(taskId);
    try {
      const response = await fetch('/api/team/tasks/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: taskId }),
      });
      if (response.ok) {
        alert('Task successfully claimed! Check "In Progress" tab.');
        await fetchTasks();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to claim task');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleJoinCollaboration = async (taskId: string) => {
    setActionLoadingId(taskId);
    try {
      const response = await fetch('/api/team/tasks/collaborate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: taskId }),
      });
      if (response.ok) {
        alert('Joined collaboration successfully!');
        await fetchTasks();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to join collaboration');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    const downloadUrl = prompt('Please enter the final download link for the client assets (optional):') || '';
    if (downloadUrl === null) return;
    if (!confirm('Confirm this task is complete? This moves it to the client download space and archive.')) return;
    setActionLoadingId(taskId);
    try {
      const response = await fetch('/api/team/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: taskId, downloadUrl }),
      });
      if (response.ok) {
        alert('Task successfully completed and download link attached!');
        await fetchTasks();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to complete task');
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Helper to calculate cut/percentage per task
  const calculateTaskCut = (t: Task) => {
    const quote = Number(t.invoice_amount || 0);
    const cutPct = Number(t.payout_cut_percentage || 70);
    const totalCutPool = (quote * cutPct) / 100;
    const teamCount = Math.max(1, (t.assigned_to_id ? 1 : 0) + (t.collaborators?.length || 0));
    const memberShare = totalCutPool / teamCount;
    return { quote, cutPct, totalCutPool, teamCount, memberShare };
  };

  // Filter Tasks for Boards
  const openTasks = tasks.filter(t => t.status === 'approved');
  const activeTasks = tasks.filter(t => t.status === 'claimed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Calculate Weekly Earnings Metrics for signed in member
  const completedMemberCutTotal = completedTasks
    .filter(t => t.assigned_to_id === user?.id || t.collaborators?.some(c => c.user_id === user?.id))
    .reduce((sum, t) => sum + calculateTaskCut(t).memberShare, 0);

  const inProgressMemberCutTotal = activeTasks
    .filter(t => t.assigned_to_id === user?.id || t.collaborators?.some(c => c.user_id === user?.id))
    .reduce((sum, t) => sum + calculateTaskCut(t).memberShare, 0);

  const totalWeeklyEstimatedPayout = completedMemberCutTotal + inProgressMemberCutTotal;

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Header */}
        <section className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight">Team Portal</h1>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Task Delegation & Financial Cut Workspace
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-full">
              Authorized: {role === 'admin' ? 'Administrator' : 'Team Member'}
            </span>
          </div>
        </section>

        {/* Financial Earnings Overview Banner (Paid Out Weekly) */}
        <section className="mx-auto max-w-7xl relative z-10 mb-10 grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border border-teal-500/20 dark:border-teal-500/30 rounded-2xl p-5 flex items-center justify-between shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Est. Weekly Payout (Cut)
              </span>
              <span className="text-2xl font-black text-teal-600 dark:text-teal-400">
                ${totalWeeklyEstimatedPayout.toFixed(2)}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                <Calendar size={10} />
                <span>Paid Out Weekly (Fridays)</span>
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-teal-500/20 text-teal-500 flex items-center justify-center">
              <DollarSign size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Completed Project Cut
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-slate-100">
                ${completedMemberCutTotal.toFixed(2)}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold">
                ✓ Ready for Payout Batch
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-5 flex items-center justify-between shadow-xs">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                In-Progress Cut
              </span>
              <span className="text-2xl font-black text-slate-850 dark:text-slate-100">
                ${inProgressMemberCutTotal.toFixed(2)}
              </span>
              <span className="text-[10px] text-amber-500 font-semibold">
                ⏳ Pending Completion
              </span>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Percent size={24} />
            </div>
          </div>
        </section>

        {/* Dashboard Panels */}
        <section className="mx-auto max-w-7xl relative z-10 flex flex-col gap-8">
          
          {/* Tab Selector */}
          <div className="flex border-b border-slate-200/60 dark:border-slate-800/60 gap-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('open')}
              className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'open'
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Briefcase size={16} />
              <span>Open Tasks ({openTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('active')}
              className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'active'
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Clock size={16} />
              <span>In Progress ({activeTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'completed'
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 size={16} />
              <span>Completed ({completedTasks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payouts')}
              className={`pb-3 font-bold text-sm border-b-2 transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'payouts'
                  ? 'border-teal-500 text-teal-500'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <DollarSign size={16} />
              <span>Weekly Payouts & Cuts</span>
            </button>
          </div>

          {/* Cards Content */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 md:p-8 shadow-sm min-h-[400px]">
            
            {/* Open Board */}
            {activeTab === 'open' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Available Delegated Tasks</h3>
                  <p className="text-xs text-slate-500">Unclaimed project requests approved by admin members. Claim task below to assign yourself.</p>
                </div>

                {openTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <Briefcase size={40} className="text-slate-350 dark:text-slate-650" />
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">No available tasks</span>
                    <span className="text-xs text-slate-400">Newly approved client project specifications will appear here.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {openTasks.map(task => (
                      <div 
                        key={task.id}
                        className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-teal-500/30 transition-all"
                      >
                        <div className="flex flex-col gap-2">
                          <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">{task.subject}</span>
                          <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed line-clamp-4">{task.description}</p>
                          
                          <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-800/30 text-xs text-slate-500">
                            <span>Client: <strong>{task.client_name}</strong> ({task.client_email})</span>
                            {task.client_phone && <span>Phone: <strong>{task.client_phone}</strong></span>}
                            {task.file_url && (
                              <span className="flex items-center gap-1">
                                Reference Link: 
                                <a href={task.file_url} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline flex items-center gap-0.5">
                                  <span>View Files</span>
                                  <ExternalLink size={10} />
                                </a>
                              </span>
                            )}
                          </div>
                        </div>

                        <button
                          onClick={() => handleClaimTask(task.id)}
                          disabled={actionLoadingId === task.id}
                          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          {actionLoadingId === task.id ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
                          <span>Claim Task Assignment</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* In Progress Board */}
            {activeTab === 'active' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Tasks In Progress</h3>
                  <p className="text-xs text-slate-500">Tasks currently claimed by members. Collaborate with them to finish the project.</p>
                </div>

                {activeTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <Clock size={40} className="text-slate-350 dark:text-slate-655" />
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">No tasks in progress</span>
                    <span className="text-xs text-slate-400">Claim tasks in the available board to start working.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeTasks.map(task => {
                      const isOwner = task.assigned_to_id === user?.id;
                      const isCollaborator = task.collaborators.some(c => c.user_id === user?.id);

                      return (
                        <div 
                          key={task.id}
                          className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between gap-5"
                        >
                          <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-start gap-4">
                              <span className="font-extrabold text-base text-slate-800 dark:text-slate-200">{task.subject}</span>
                              <span className="text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-md">
                                In Progress
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-pre-wrap leading-relaxed line-clamp-3">{task.description}</p>
                            
                            <div className="flex flex-col gap-1.5 mt-3 pt-3 border-t border-slate-200/30 dark:border-slate-800/30 text-xs text-slate-500">
                              <span>Lead Assignee: <strong className="text-teal-600 dark:text-teal-400">{task.assigned_to_name}</strong></span>
                              <span>Client: <strong>{task.client_name}</strong> ({task.client_email})</span>
                              {task.file_url && (
                                <span className="flex items-center gap-1">
                                  Reference Link: 
                                  <a href={task.file_url} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline flex items-center gap-0.5">
                                    <span>View Files</span>
                                    <ExternalLink size={10} />
                                  </a>
                                </span>
                              )}
                            </div>

                            {/* Collaborators row */}
                            <div className="flex flex-col gap-1 mt-2 pt-2 border-t border-slate-250/20 dark:border-slate-800/20">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Collaborators</span>
                              {task.collaborators.length === 0 ? (
                                <span className="text-[10px] font-semibold text-slate-400">No other collaborators yet.</span>
                              ) : (
                                <div className="flex flex-wrap gap-1.5 mt-1">
                                  {task.collaborators.map(c => (
                                    <span 
                                      key={c.user_id}
                                      className="text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full"
                                    >
                                      {c.user_name}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {/* Mark complete - Assignee or Admin only */}
                            {(isOwner || role === 'admin') ? (
                              <button
                                onClick={() => handleCompleteTask(task.id)}
                                disabled={actionLoadingId === task.id}
                                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 col-span-2 sm:col-span-1"
                              >
                                {actionLoadingId === task.id ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
                                <span>Complete Task</span>
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-3 self-center">
                                Task owned by {task.assigned_to_name}
                              </span>
                            )}

                            {/* Join collaboration button */}
                            {!isOwner && !isCollaborator && (
                              <button
                                onClick={() => handleJoinCollaboration(task.id)}
                                disabled={actionLoadingId === task.id}
                                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-950 py-2.5 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                              >
                                {actionLoadingId === task.id ? <Loader2 className="animate-spin" size={14} /> : <UserPlus size={14} />}
                                <span>Collaborate</span>
                              </button>
                            )}
                            
                            {isCollaborator && !isOwner && (
                              <span className="text-[10px] font-bold text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-3 py-2 rounded-xl text-center self-center">
                                Collaborating
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Completed Board */}
            {activeTab === 'completed' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Archived Completed Projects</h3>
                  <p className="text-xs text-slate-500">History of finished project tasks completed by the team.</p>
                </div>

                {completedTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <CheckCircle2 size={40} className="text-slate-350 dark:text-slate-655" />
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">No completed tasks yet</span>
                    <span className="text-xs text-slate-400">Completed jobs will be archived and cataloged here.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {completedTasks.map(task => {
                      const financial = calculateTaskCut(task);
                      return (
                        <div 
                          key={task.id}
                          className="bg-slate-50/20 dark:bg-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-85"
                        >
                          <div className="flex flex-col gap-1.5 max-w-3xl">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-black text-sm text-slate-800 dark:text-slate-200">{task.subject}</span>
                              <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Check size={10} />
                                <span>Completed</span>
                              </span>

                              {/* Payout Cut pill */}
                              <span className="text-[9px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded-md">
                                Quote: ${financial.quote.toFixed(2)} | Cut ({financial.cutPct}%): ${financial.memberShare.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-455 line-clamp-2">{task.description}</p>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                              Completed by Lead <strong className="text-teal-600 dark:text-teal-400">{task.assigned_to_name}</strong>
                            </span>
                            {task.download_url && (
                              <div className="flex items-center gap-1.5 mt-1 border-t border-slate-200/20 dark:border-slate-800/20 pt-1">
                                <span className="text-[10px] text-slate-400 font-bold">Delivery Link:</span>
                                <a href={task.download_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-teal-500 hover:underline flex items-center gap-0.5 font-bold">
                                  <span>Open Deliverables</span>
                                  <ExternalLink size={10} />
                                </a>
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-slate-500">
                            Client: <strong>{task.client_name}</strong>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Weekly Payouts & Cuts Tab View */}
            {activeTab === 'payouts' && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <DollarSign className="text-teal-500" size={20} />
                        <span>Weekly Payouts & Member Cut Breakdown</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Track per-project revenue cuts, collaborator splits, and weekly disbursement cycles (Paid out every Friday).
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-xl text-xs font-extrabold">
                      <Calendar size={14} />
                      <span>Next Payout Run: Friday</span>
                    </div>
                  </div>
                </div>

                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-2">
                    <DollarSign size={40} className="text-slate-350 dark:text-slate-655" />
                    <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">No payout data available</span>
                    <span className="text-xs text-slate-400">Project tasks with quote amounts will generate weekly cut breakdowns here.</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {tasks.map((task) => {
                      const financial = calculateTaskCut(task);
                      const isOwner = task.assigned_to_id === user?.id;
                      const isCollaborator = task.collaborators.some(c => c.user_id === user?.id);
                      const isMemberOnTask = isOwner || isCollaborator;

                      return (
                        <div
                          key={task.id}
                          className={`border rounded-2xl p-6 transition-all flex flex-col gap-4 ${
                            isMemberOnTask
                              ? 'bg-teal-500/5 dark:bg-teal-950/10 border-teal-500/30'
                              : 'bg-slate-50/40 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-800/60'
                          }`}
                        >
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                                  {task.subject}
                                </span>
                                {task.scope_type === 'organization' && (
                                  <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                    <Building2 size={10} />
                                    <span>{task.organization_name || 'Organization'}</span>
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400">
                                Client: <strong>{task.client_name}</strong> ({task.client_email})
                              </span>
                            </div>

                            {/* Financial breakdown pills */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400">Project Quote</span>
                                <span className="text-sm font-black text-slate-800 dark:text-slate-200">
                                  ${financial.quote > 0 ? financial.quote.toFixed(2) : 'TBD / Custom'}
                                </span>
                              </div>

                              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400">Team Cut %</span>
                                <span className="text-sm font-black text-teal-600 dark:text-teal-400">
                                  {financial.cutPct}% (${financial.totalCutPool.toFixed(2)})
                                </span>
                              </div>

                              <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

                              <div className="flex flex-col items-end">
                                <span className="text-[10px] font-extrabold uppercase text-slate-400">Your Share</span>
                                <span className="text-base font-black text-teal-600 dark:text-teal-400">
                                  ${isMemberOnTask ? financial.memberShare.toFixed(2) : '0.00'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Payout details & status bar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200/40 dark:border-slate-800/40 text-xs">
                            <div className="flex items-center gap-2 text-slate-500">
                              <Users size={14} className="text-teal-500" />
                              <span>
                                Split among {financial.teamCount} team member(s): Lead: <strong>{task.assigned_to_name || 'Unassigned'}</strong>
                                {task.collaborators.length > 0 && ` + ${task.collaborators.map(c => c.user_name).join(', ')}`}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {task.status === 'completed' && (
                                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                                  <CheckCircle2 size={12} />
                                  <span>Paid Out Weekly (Approved)</span>
                                </span>
                              )}

                              {task.status === 'claimed' && (
                                <span className="text-[10px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                                  <Clock size={12} />
                                  <span>In Progress (Payout Reserved)</span>
                                </span>
                              )}

                              {task.status === 'approved' && (
                                <span className="text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                                  <Briefcase size={12} />
                                  <span>Unclaimed (Cut Available)</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

        </section>
      </main>

      <Footer />
    </>
  );
}

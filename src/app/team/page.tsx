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
  Clock 
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
  collaborators: Collaborator[];
}

export default function TeamPortal() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'open' | 'active' | 'completed'>('open');

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
    if (!confirm('Confirm this task is complete? This moves it to the archive.')) return;
    setActionLoadingId(taskId);
    try {
      const response = await fetch('/api/team/tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: taskId }),
      });
      if (response.ok) {
        alert('Task marked as completed!');
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

  // Filter Tasks for Boards
  const openTasks = tasks.filter(t => t.status === 'approved');
  const activeTasks = tasks.filter(t => t.status === 'claimed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <>
      <Navbar />

      <main className="flex-1 relative overflow-hidden bg-transparent text-slate-900 dark:text-slate-50 py-16 px-6 sm:px-8">
        
        {/* Header */}
        <section className="mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-black tracking-tight">Team Portal</h1>
            <p className="text-sm font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
              Task Delegation & Studio Work Space
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 px-3 py-1.5 rounded-full">
              Authorized: {role === 'admin' ? 'Administrator' : 'Team Member'}
            </span>
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
                    {completedTasks.map(task => (
                      <div 
                        key={task.id}
                        className="bg-slate-50/20 dark:bg-slate-950/10 border border-slate-200/50 dark:border-slate-800/50 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 opacity-75"
                      >
                        <div className="flex flex-col gap-1.5 max-w-3xl">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-slate-800 dark:text-slate-200">{task.subject}</span>
                            <span className="text-[9px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Check size={10} />
                              <span>Completed</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-450 line-clamp-2">{task.description}</p>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                            Completed by Lead <strong className="text-teal-600 dark:text-teal-400">{task.assigned_to_name}</strong>
                          </span>
                        </div>
                        
                        <div className="text-xs text-slate-500">
                          Client: <strong>{task.client_name}</strong>
                        </div>
                      </div>
                    ))}
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

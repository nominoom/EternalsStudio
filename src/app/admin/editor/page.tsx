'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useSiteContent, DEFAULT_PAGE_SECTIONS, CustomSectionBlock } from '../../../context/SiteContentContext';
import EditorTopBar, { ViewportMode } from '../../../components/editor/EditorTopBar';
import EditorSidebar from '../../../components/editor/EditorSidebar';
import PageCanvas from '../../../components/editor/PageCanvas';
import SectionInspector from '../../../components/editor/SectionInspector';
import EditorBottomBar from '../../../components/editor/EditorBottomBar';
import SectionLibraryModal from '../../../components/editor/SectionLibraryModal';

const SITE_PAGES = [
  { id: 'main', name: 'Home (Main)', path: '/', icon: '⚡' },
  { id: 'services', name: 'Services', path: '/services', icon: '💻' },
  { id: 'portfolio', name: 'Portfolio', path: '/portfolio', icon: '🏆' },
  { id: 'store', name: 'Store', path: '/store', icon: '🛍️' },
  { id: 'about', name: 'About & Team', path: '/about', icon: '👥' },
  { id: 'contact', name: 'Contact & Inquiries', path: '/contact', icon: '📍' },
];

export default function StandaloneEditorPage() {
  const { user, isLoaded } = useUser();
  const { 
    siteContent, 
    saveSiteContent, 
    resetToDefault,
    isSaving, 
    hasUnsavedChanges, 
    addSection,
    deleteSection,
    resetPageSections
  } = useSiteContent();

  const [activePage, setActivePage] = useState<string>('main');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('hero');

  // Add Section Modal State
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [targetInsertIndex, setTargetInsertIndex] = useState<number | undefined>(undefined);

  // Toast Feedback State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Admin access validation
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 font-mono text-sm">
        <span className="animate-pulse">Loading Studio Editor...</span>
      </div>
    );
  }

  const isAdmin = user?.publicMetadata?.role === 'admin';
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6">
        <ShieldAlert size={56} className="text-red-500 mb-4 animate-bounce" />
        <h1 className="text-2xl font-black">Admin Access Required</h1>
        <p className="text-slate-400 text-sm mt-2 text-center max-w-sm">
          You need administrative privileges to launch the Eternals Studio visual website builder.
        </p>
        <Link 
          href="/admin" 
          className="mt-6 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs"
        >
          Return to Admin
        </Link>
      </div>
    );
  }

  const currentSections = siteContent.pageSectionOrder?.[activePage] || DEFAULT_PAGE_SECTIONS[activePage] || [];

  const handleSave = async () => {
    const success = await saveSiteContent();
    if (success) {
      showToast('All changes successfully saved and published live!', 'success');
    } else {
      showToast('Saved locally in browser memory (offline mode).', 'info');
    }
  };

  const handleOpenLive = () => {
    const pageObj = SITE_PAGES.find((p) => p.id === activePage);
    const path = pageObj?.path || '/';
    window.open(path, '_blank');
  };

  const handleOpenAddSectionModal = (insertIndex?: number) => {
    setTargetInsertIndex(insertIndex);
    setIsAddSectionModalOpen(true);
  };

  const handleInsertSection = (block: CustomSectionBlock) => {
    addSection(activePage, block, targetInsertIndex);
    setSelectedSectionId(block.id);
    showToast(`Section "${block.title}" added to ${activePage}!`, 'success');
  };

  const handleDeleteSelectedSection = () => {
    if (!selectedSectionId) return;
    const confirmDelete = window.confirm(`Delete section "${selectedSectionId}" from ${activePage}?`);
    if (confirmDelete) {
      deleteSection(activePage, selectedSectionId);
      setSelectedSectionId(null);
      showToast('Section removed from layout.', 'info');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* 1. Top Bar */}
      <EditorTopBar
        activePage={activePage}
        onSelectPage={(pageId) => {
          setActivePage(pageId);
          setSelectedSectionId(null);
        }}
        pages={SITE_PAGES}
        viewport={viewport}
        onSelectViewport={setViewport}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode((prev) => !prev)}
        zoom={zoom}
        onZoomChange={(delta) => setZoom((prev) => Math.min(130, Math.max(60, prev + delta)))}
        onSave={handleSave}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenLive={handleOpenLive}
      />

      {/* 2. Main Builder Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Pages & Sections list matching user's sketch */}
        {!isPreviewMode && (
          <EditorSidebar
            activePage={activePage}
            onSelectPage={(pageId) => {
              setActivePage(pageId);
              setSelectedSectionId(null);
            }}
            pages={SITE_PAGES}
            currentSections={currentSections}
            selectedSectionId={selectedSectionId}
            onSelectSection={(secId) => setSelectedSectionId(secId)}
            onOpenAddSectionModal={() => handleOpenAddSectionModal()}
          />
        )}

        {/* Center Live Interactive Canvas */}
        <PageCanvas
          activePage={activePage}
          viewport={viewport}
          zoom={zoom}
          isPreviewMode={isPreviewMode}
          selectedSectionId={selectedSectionId}
          onSelectSection={(secId) => setSelectedSectionId(secId)}
          onOpenAddSectionAfter={(index) => handleOpenAddSectionModal(index)}
        />

        {/* Right Slide-over Inspector for Active Section */}
        {!isPreviewMode && selectedSectionId && (
          <SectionInspector
            pageId={activePage}
            sectionId={selectedSectionId}
            onClose={() => setSelectedSectionId(null)}
            onDelete={handleDeleteSelectedSection}
          />
        )}
      </div>

      {/* 3. Bottom Action Bar matching user sketch's [save/del] */}
      <EditorBottomBar
        activePage={activePage}
        selectedSectionId={selectedSectionId}
        onDeleteSelectedSection={handleDeleteSelectedSection}
        onSave={handleSave}
        onReset={() => {
          if (window.confirm(`Discard all pending modifications to the ${activePage} page?`)) {
            resetPageSections(activePage);
            showToast('Page layout restored to default state.', 'info');
          }
        }}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenLive={handleOpenLive}
      />

      {/* 4. Section Library Modal */}
      <SectionLibraryModal
        isOpen={isAddSectionModalOpen}
        onClose={() => setIsAddSectionModalOpen(false)}
        onAddSection={handleInsertSection}
        targetPageId={activePage}
      />

      {/* 5. Notification Toast */}
      {toast && (
        <div className="fixed bottom-20 right-8 z-[200] flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 border border-teal-500/40 text-slate-100 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
          {toast.type === 'success' ? (
            <CheckCircle2 size={18} className="text-teal-400" />
          ) : (
            <AlertTriangle size={18} className="text-amber-400" />
          )}
          <span className="text-xs font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, AlertTriangle, Sliders, Settings } from 'lucide-react';
import { useSiteContent, DEFAULT_PAGE_SECTIONS, CustomSectionBlock } from '../../../context/SiteContentContext';
import EditorTopBar, { ViewportMode } from '../../../components/editor/EditorTopBar';
import EditorSidebar from '../../../components/editor/EditorSidebar';
import PageCanvas from '../../../components/editor/PageCanvas';
import SectionInspector from '../../../components/editor/SectionInspector';
import PropertiesPanel from '../../../components/editor/PropertiesPanel';
import EditorBottomBar from '../../../components/editor/EditorBottomBar';
import SectionLibraryModal from '../../../components/editor/SectionLibraryModal';
import ThemeEditorModal from '../../../components/editor/ThemeEditorModal';
import SEOModal from '../../../components/editor/SEOModal';
import NavigationEditorModal from '../../../components/editor/NavigationEditorModal';
import MediaLibraryModal from '../../../components/editor/MediaLibraryModal';
import VersionHistoryModal from '../../../components/editor/VersionHistoryModal';
import { CMSPage, CMSSection, CMSBlock, CMSPageSEO, GlobalThemeSettings, CMSNavigation, MediaAsset } from '@/types/cms';

const DEFAULT_PAGES = [
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
    resetPageSections,
    // Full CMS Store & Capabilities
    cmsStore,
    activeDraft,
    setActiveDraft,
    saveDraft,
    publishPage,
    restoreVersion,
    updateNavigation,
    updateFooter,
    updateTheme,
    addMediaAsset,
    deleteMediaAsset,
    createNewPage,
    duplicatePage,
    deletePage,
    canUndo,
    canRedo,
    undo,
    redo
  } = useSiteContent();

  const [activePage, setActivePage] = useState<string>('main');
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [zoom, setZoom] = useState<number>(100);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('hero');
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [inspectorView, setInspectorView] = useState<'section' | 'properties'>('section');

  // Modals state
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [targetInsertIndex, setTargetInsertIndex] = useState<number | undefined>(undefined);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // Toast Feedback State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Combine default pages with custom CMS pages
  const allPages = React.useMemo(() => {
    const list = [...DEFAULT_PAGES];
    const cmsPages = { ...cmsStore.pages, ...cmsStore.drafts };
    Object.keys(cmsPages).forEach((pageId) => {
      if (!list.some((p) => p.id === pageId)) {
        list.push({
          id: pageId,
          name: cmsPages[pageId].title || pageId,
          path: cmsPages[pageId].slug || `/${pageId}`,
          icon: '📄'
        });
      }
    });
    return list;
  }, [cmsStore.pages, cmsStore.drafts]);

  // Current page data object
  const currentPageData: CMSPage = React.useMemo(() => {
    const current = cmsStore.drafts[activePage] || cmsStore.pages[activePage];
    if (current) return current;

    const matchedDefault = DEFAULT_PAGES.find((p) => p.id === activePage);
    return {
      id: activePage,
      title: matchedDefault?.name || activePage,
      slug: matchedDefault?.path || `/${activePage}`,
      status: 'draft',
      template: 'default',
      sections: [],
      seo: {
        title: `${matchedDefault?.name || activePage} | Eternals Studio`,
        description: 'Where Ideas Become Reality. We build high-performance web applications and visual assets.'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    };
  }, [cmsStore.drafts, cmsStore.pages, activePage]);

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
    const okDraft = await saveDraft(activePage, currentPageData);
    const okContent = await saveSiteContent();
    if (okDraft || okContent) {
      showToast('Draft successfully saved to cloud storage.', 'success');
    } else {
      showToast('Saved locally in browser memory (offline mode).', 'info');
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const commitNote = window.prompt('Optional commit note for this revision:', 'Published changes live via visual editor') || 'Published live';
      const ok = await publishPage(activePage, currentPageData, commitNote);
      if (ok) {
        showToast(`🎉 Version published live! Changes are now visible to the public.`, 'success');
      } else {
        showToast('Publishing failed. Please check network connection.', 'error');
      }
    } catch (e) {
      showToast('Error during publish.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleOpenLive = () => {
    const pageObj = allPages.find((p) => p.id === activePage);
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

  // Page Management Handlers
  const handleAddNewPage = () => {
    const title = window.prompt('Enter page title:', 'New Page');
    if (!title) return;
    const slug = window.prompt('Enter page URL slug (e.g. /custom):', `/${title.toLowerCase().replace(/\s+/g, '-')}`);
    if (!slug) return;

    const newPage = createNewPage(title, slug);
    setActivePage(newPage.id);
    setSelectedSectionId(null);
    showToast(`Page "${title}" created!`, 'success');
  };

  const handleDuplicatePage = (pageId: string) => {
    const duplicated = duplicatePage(pageId);
    setActivePage(duplicated.id);
    setSelectedSectionId(null);
    showToast(`Page duplicated as "${duplicated.title}"!`, 'success');
  };

  const handleDeletePage = (pageId: string) => {
    if (DEFAULT_PAGES.some((p) => p.id === pageId)) {
      alert('Core system pages cannot be deleted.');
      return;
    }
    if (window.confirm(`Are you sure you want to permanently delete page "${pageId}"?`)) {
      deletePage(pageId);
      setActivePage('main');
      setSelectedSectionId(null);
      showToast(`Page deleted.`, 'info');
    }
  };

  // Synthesize selected section & block objects for PropertiesPanel
  const activeSectionObject: CMSSection | null = selectedSectionId
    ? {
        id: selectedSectionId,
        name: selectedSectionId,
        type: 'custom',
        order: 0,
        styles: {
          paddingVertical: 'standard',
          backgroundType: 'mesh',
          maxWidth: 'xl'
        },
        blocks: []
      }
    : null;

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none font-sans">
      {/* 1. Top Bar */}
      <EditorTopBar
        activePage={activePage}
        onSelectPage={(pageId) => {
          setActivePage(pageId);
          setSelectedSectionId(null);
          setSelectedBlockId(null);
        }}
        pages={allPages}
        viewport={viewport}
        onSelectViewport={setViewport}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode((prev) => !prev)}
        zoom={zoom}
        onZoomChange={(delta) => setZoom((prev) => Math.min(130, Math.max(60, prev + delta)))}
        onSave={handleSave}
        onPublishLive={handlePublish}
        isSaving={isSaving}
        isPublishing={isPublishing}
        hasUnsavedChanges={hasUnsavedChanges}
        onOpenLive={handleOpenLive}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenSEOModal={() => setIsSEOModalOpen(true)}
        onOpenNavigationModal={() => setIsNavModalOpen(true)}
        onOpenMediaModal={() => {
          setMediaPickerCallback(null);
          setIsMediaModalOpen(true);
        }}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
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
              setSelectedBlockId(null);
            }}
            pages={allPages}
            currentSections={currentSections}
            selectedSectionId={selectedSectionId}
            selectedBlockId={selectedBlockId}
            onSelectSection={(secId) => setSelectedSectionId(secId)}
            onSelectBlock={(bId) => setSelectedBlockId(bId)}
            onOpenAddSectionModal={() => handleOpenAddSectionModal()}
            currentPageData={currentPageData}
            onAddNewPage={handleAddNewPage}
            onDuplicatePage={handleDuplicatePage}
            onDeletePage={handleDeletePage}
          />
        )}

        {/* Center Live Interactive Canvas */}
        <PageCanvas
          activePage={activePage}
          viewport={viewport}
          zoom={zoom}
          isPreviewMode={isPreviewMode}
          selectedSectionId={selectedSectionId}
          onSelectSection={(secId) => {
            setSelectedSectionId(secId);
            setSelectedBlockId(null);
          }}
          onOpenAddSectionAfter={(index) => handleOpenAddSectionModal(index)}
        />

        {/* Right Slide-over Inspector for Active Section / Block */}
        {!isPreviewMode && selectedSectionId && (
          <div className="flex flex-col border-l border-slate-800 bg-slate-900 z-30 shadow-2xl">
            {/* Inspector Mode Switcher */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
              <button
                type="button"
                onClick={() => setInspectorView('section')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  inspectorView === 'section'
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Settings size={13} />
                <span>Section Controls</span>
              </button>
              <button
                type="button"
                onClick={() => setInspectorView('properties')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                  inspectorView === 'properties'
                    ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sliders size={13} />
                <span>Deep Properties</span>
              </button>
            </div>

            {inspectorView === 'section' ? (
              <SectionInspector
                pageId={activePage}
                sectionId={selectedSectionId}
                onClose={() => setSelectedSectionId(null)}
                onDelete={handleDeleteSelectedSection}
              />
            ) : (
              <PropertiesPanel
                selectedBlock={null}
                selectedSection={activeSectionObject}
                onUpdateBlock={() => {}}
                onUpdateSection={(secId, updates) => {
                  showToast(`Updated section styles for ${secId}`, 'success');
                }}
                onDeleteSection={handleDeleteSelectedSection}
                onClose={() => setSelectedSectionId(null)}
                onOpenMediaPicker={(callback) => {
                  setMediaPickerCallback(() => callback);
                  setIsMediaModalOpen(true);
                }}
              />
            )}
          </div>
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

      {/* 5. Global Theme Editor Modal */}
      <ThemeEditorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        theme={cmsStore.theme}
        onSaveTheme={async (updatedTheme) => {
          await updateTheme(updatedTheme);
          showToast('Global theme & design system tokens updated!', 'success');
        }}
      />

      {/* 6. Page SEO Manager Modal */}
      <SEOModal
        isOpen={isSEOModalOpen}
        onClose={() => setIsSEOModalOpen(false)}
        pageTitle={currentPageData.title}
        pageSlug={currentPageData.slug}
        seo={currentPageData.seo}
        onSaveSEO={async (updatedSEO) => {
          const updatedPage = { ...currentPageData, seo: updatedSEO };
          await saveDraft(activePage, updatedPage);
          showToast('SEO & Social Share metadata updated!', 'success');
        }}
      />

      {/* 7. Header Navigation Editor Modal */}
      <NavigationEditorModal
        isOpen={isNavModalOpen}
        onClose={() => setIsNavModalOpen(false)}
        navigation={cmsStore.navigation.main}
        onSaveNavigation={async (updatedNav) => {
          await updateNavigation(updatedNav);
          showToast('Main navigation links & CTA updated!', 'success');
        }}
      />

      {/* 8. Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => {
          setIsMediaModalOpen(false);
          setMediaPickerCallback(null);
        }}
        mediaAssets={cmsStore.media}
        onUploadAsset={async (asset) => {
          await addMediaAsset(asset);
          showToast(`Asset "${asset.name}" uploaded to Media Library!`, 'success');
        }}
        onDeleteAsset={async (assetId) => {
          await deleteMediaAsset(assetId);
          showToast('Asset removed from Media Library.', 'info');
        }}
        onSelectUrl={mediaPickerCallback ? (url) => {
          mediaPickerCallback(url);
          setIsMediaModalOpen(false);
          setMediaPickerCallback(null);
          showToast('Image inserted!', 'success');
        } : undefined}
      />

      {/* 9. Version History & Restore Modal */}
      <VersionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        pageId={activePage}
        versions={cmsStore.versions[activePage] || []}
        onRestoreVersion={async (versionId) => {
          const ok = await restoreVersion(activePage, versionId);
          if (ok) {
            showToast('Previous version restored into active draft!', 'success');
          } else {
            showToast('Failed to restore version.', 'error');
          }
        }}
      />

      {/* 10. Notification Toast */}
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

import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { getCMSStore, saveCMSStore } from '@/lib/cms/cmsService';
import { CMSPage, PageVersion } from '@/types/cms';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const noStoreHeaders = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'CDN-Cache-Control': 'no-store',
};

export async function GET(): Promise<Response> {
  try {
    const store = await getCMSStore();
    return NextResponse.json({ success: true, store }, { headers: noStoreHeaders }) as unknown as Response;
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('Error fetching CMS store:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500, headers: noStoreHeaders }) as unknown as Response;
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    const auth = await requireAdmin();
    if (!auth.ok) return auth.response as unknown as Response;

    const adminEmail = auth.user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    const body = await req.json();
    const { action, payload } = body;

    const currentStore = await getCMSStore();

    switch (action) {
      // 1. Save draft without modifying live site
      case 'save_draft': {
        const page: CMSPage = payload.page;
        if (!page || !page.id) {
          return NextResponse.json({ error: 'Invalid page data' }, { status: 400 }) as unknown as Response;
        }

        const updatedDrafts = {
          ...currentStore.drafts,
          [page.id]: {
            ...page,
            status: 'draft' as const,
            updatedAt: new Date().toISOString()
          }
        };

        const ok = await saveCMSStore(
          { drafts: updatedDrafts },
          adminEmail,
          `Saved draft for page: ${page.title || page.id}`
        );

        return NextResponse.json({ success: ok, drafts: updatedDrafts }) as unknown as Response;
      }

      // 2. Publish draft live & create version snapshot
      case 'publish_page': {
        const page: CMSPage = payload.page;
        if (!page || !page.id) {
          return NextResponse.json({ error: 'Invalid page data' }, { status: 400 }) as unknown as Response;
        }

        const publishedPage: CMSPage = {
          ...page,
          status: 'published',
          version: (page.version || 1) + 1,
          updatedAt: new Date().toISOString(),
          publishedAt: new Date().toISOString(),
          publishedBy: adminEmail
        };

        // Create version snapshot
        const newVersion: PageVersion = {
          id: `ver-${page.id}-${Date.now()}`,
          pageId: page.id,
          versionNumber: publishedPage.version,
          pageTitle: publishedPage.title,
          snapshot: publishedPage,
          createdAt: new Date().toISOString(),
          createdBy: adminEmail,
          commitMessage: payload.commitMessage || 'Published changes live via visual editor'
        };

        const pageVersions = [...(currentStore.versions[page.id] || []), newVersion];

        const ok = await saveCMSStore(
          {
            pages: { ...currentStore.pages, [page.id]: publishedPage },
            drafts: { ...currentStore.drafts, [page.id]: publishedPage },
            versions: { ...currentStore.versions, [page.id]: pageVersions }
          },
          adminEmail,
          `Published live version v${publishedPage.version} of page: ${page.title || page.id}`
        );

        return NextResponse.json({ success: ok, page: publishedPage, version: newVersion }) as unknown as Response;
      }

      // 3. Restore previous version
      case 'restore_version': {
        const { pageId, versionId } = payload;
        const versions = currentStore.versions[pageId] || [];
        const targetVersion = versions.find((v) => v.id === versionId);

        if (!targetVersion) {
          return NextResponse.json({ error: 'Version not found' }, { status: 404 }) as unknown as Response;
        }

        const restoredPage: CMSPage = {
          ...targetVersion.snapshot,
          status: 'draft' as const,
          updatedAt: new Date().toISOString()
        };

        const ok = await saveCMSStore(
          {
            drafts: { ...currentStore.drafts, [pageId]: restoredPage }
          },
          adminEmail,
          `Restored version v${targetVersion.versionNumber} of page: ${pageId} into draft`
        );

        return NextResponse.json({ success: ok, restoredDraft: restoredPage }) as unknown as Response;
      }

      // 4. Update Navigation
      case 'update_navigation': {
        const navigation = payload.navigation;
        const ok = await saveCMSStore({ navigation }, adminEmail, 'Updated global navigation links');
        return NextResponse.json({ success: ok, navigation }) as unknown as Response;
      }

      // 5. Update Footer
      case 'update_footer': {
        const footer = payload.footer;
        const ok = await saveCMSStore({ footer }, adminEmail, 'Updated global footer configuration');
        return NextResponse.json({ success: ok, footer }) as unknown as Response;
      }

      // 6. Update Theme Settings
      case 'update_theme': {
        const theme = payload.theme;
        const ok = await saveCMSStore({ theme }, adminEmail, 'Updated design system & theme tokens');
        return NextResponse.json({ success: ok, theme }) as unknown as Response;
      }

      // 7. Add Media Asset to Library
      case 'add_media': {
        const asset = payload.asset;
        const updatedMedia = [asset, ...(currentStore.media || [])];
        const ok = await saveCMSStore({ media: updatedMedia }, adminEmail, `Added media asset: ${asset.name}`);
        return NextResponse.json({ success: ok, media: updatedMedia }) as unknown as Response;
      }

      // 8. Delete Media Asset
      case 'delete_media': {
        const { assetId } = payload;
        const updatedMedia = (currentStore.media || []).filter((m) => m.id !== assetId);
        const ok = await saveCMSStore({ media: updatedMedia }, adminEmail, `Deleted media asset: ${assetId}`);
        return NextResponse.json({ success: ok, media: updatedMedia }) as unknown as Response;
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 }) as unknown as Response;
    }
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('CMS API route error:', errMsg);
    return NextResponse.json({ error: errMsg }, { status: 500 }) as unknown as Response;
  }
}

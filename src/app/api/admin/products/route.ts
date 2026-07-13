import { NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '../../../../lib/supabase';
import { logEvent } from '../../../../lib/logger';

export async function POST(req: Request): Promise<Response> {
  try {
    // 1. Authenticate with Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as unknown as Response;
    }

    // 2. Validate administrator privileges
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Administrator privileges required' }, { status: 403 }) as unknown as Response;
    }

    // 3. Parse and validate payload
    const { name, description, price, category, image_url } = await req.json();

    if (!name || typeof price !== 'number' || !category) {
      return NextResponse.json({ error: 'Missing required fields: name, price, or category' }, { status: 400 }) as unknown as Response;
    }

    // 4. Insert product into Supabase Database
    const { data: product, error: dbError } = await supabaseAdmin
      .from('products')
      .insert([
        {
          name,
          description: description || '',
          price,
          category,
          image_url: image_url || '',
        }
      ])
      .select()
      .single();

    if (dbError) {
      throw dbError;
    }

    // 5. Log product addition event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      'evt_product_created',
      'database',
      'success',
      `Administrator created product "${name}" ($${price}) under category "${category}".`,
      { actor: adminEmail, product_id: product.id, price }
    );

    return NextResponse.json({ success: true, product }) as unknown as Response;
  } catch (error: any) {
    console.error('Product Creation API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}

export async function DELETE(req: Request): Promise<Response> {
  try {
    // 1. Authenticate with Clerk
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 }) as unknown as Response;
    }

    // 2. Validate administrator privileges
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Administrator privileges required' }, { status: 403 }) as unknown as Response;
    }

    // 3. Get product ID from URL query params
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID parameter' }, { status: 400 }) as unknown as Response;
    }

    // 4. Delete product from Supabase Database
    const { error: dbError } = await supabaseAdmin
      .from('products')
      .delete()
      .eq('id', productId);

    if (dbError) {
      throw dbError;
    }

    // 5. Log product deletion event
    const adminEmail = user.emailAddresses?.[0]?.emailAddress || 'admin@eternals.gg';
    await logEvent(
      'evt_product_deleted',
      'database',
      'warning',
      `Administrator deleted product with ID: ${productId}.`,
      { actor: adminEmail, product_id: productId }
    );

    return NextResponse.json({ success: true }) as unknown as Response;
  } catch (error: any) {
    console.error('Product Deletion API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 }) as unknown as Response;
  }
}

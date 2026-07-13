import { NextResponse } from 'next/server';
import { Product, dbConnect } from '../../../lib/db';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find().sort({ created_at: -1 });
    
    // Map _id to id
    const formattedProducts = products.map((p) => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));

    return NextResponse.json(formattedProducts);
  } catch (error: any) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

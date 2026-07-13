import { NextResponse } from 'next/server';
import { Portfolio, dbConnect } from '../../../lib/db';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Portfolio.find().sort({ created_at: -1 });

    // Map _id to id
    const formattedProjects = projects.map((p) => ({
      ...p.toObject(),
      id: p._id.toString(),
    }));

    return NextResponse.json(formattedProjects);
  } catch (error: any) {
    console.error('Fetch portfolio error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

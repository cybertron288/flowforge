import { db } from '@/db';
import { workflows } from '@/db/schema/schema';
import { NextResponse } from 'next/server';

export async function GET() {
    const allWorkflows = await db.select().from(workflows);
    return NextResponse.json(allWorkflows);
}

export async function POST(req: Request) {
    const data = await req.json();
    const workflow = await db.insert(workflows).values(data).returning();
    return NextResponse.json(workflow);
}
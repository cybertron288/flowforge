import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(req: Request) {
    const { email, newPassword } = await req.json();

    const user = await db.select().from(users).where(eq(users.email, email)).get();

    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found', data: null }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db
        .update(users)
        .set({ password: hashedPassword, updatedAt: new Date().toISOString() })
        .where(eq(users.email, email));

    return NextResponse.json({ success: true, message: 'Password reset successful', data: null });
}

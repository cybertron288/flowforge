import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import { NextResponse } from 'next/server';
import { v4 } from "uuid";

import { db } from '@/db';
import { users } from '@/db/schema';

const today = new Date();

export async function POST(req: Request) {
    const { firstName, lastName, email, password } = await req.json();

    const existingUser = await db.select().from(users).where(eq(users.email, email));

    console.log("existingUser", existingUser)

    if (existingUser.length > 0) {
        return NextResponse.json({ success: false, message: 'User already exists', data: null }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("hashedPassword", hashedPassword, today.toISOString())

    await db.insert(users).values({
        id: v4(),
        firstName,
        lastName,
        email,
        password: hashedPassword
    });

    return NextResponse.json({ success: true, message: 'Signup successful', data: null });
}

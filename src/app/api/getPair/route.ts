import { NextResponse } from 'next/server';
import { openDB } from '../../../lib/db';

export async function GET() {
    try {
        const db = await openDB();
        const words = await db.all('SELECT id, word FROM Words ORDER BY RANDOM() LIMIT 2');
        return NextResponse.json(words);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch words' }, { status: 500});
    }
}
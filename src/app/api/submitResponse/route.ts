import { NextResponse } from "next/server";
import { openDB } from '../../../lib/db';

export async function POST(request: Request) {
    try {
        const { word1_id, word2_id, selected_id } = await request.json();
        if (!word1_id || !word2_id || selected_id) {
            throw new Error("Missing fields in the request body");
        }
        const db = await openDB();

        await db.run(
            `INSERT INTO Responses (word1_id, word2_id, selected_id) VALUES (?, ?, ?)`,
            word1_id,
            word2_id,
            selected_id
        );
        return NextResponse.json({ message: 'Response recorded' });
    } catch (error) {
        console.error('Error in POST:\n' + error);
        return NextResponse.json({ error: 'Failed to record response:\n' + error }, { status: 500 })
    }
}
const {openDB} = require('../../lib/db.js');

export default async function handler (request, response) {
    if (request.method === 'POST') { //POST is for sending data to create or update a resource
        const { word1_id, word2_id, selected_id } = request.body;
        const db = await openDB();
        await db.run(
            'INSERT INTO Responses (word1_id, word2_id, selected_id) VALUES (?, ?, ?)',
            word1_id, word2_id, selected_id
        );
        response.status(200).json({ message: 'Reponse recorded' });
    } else {
        //405 status = Method Not Allowed
        response.status(405).json({ error: 'Method Not Allowed' });
    }
}
const { openDB } = require('../../lib/db');

export default async function handler(request, response) {
    const db = await openDB();
    //"get two random words and their id from the Words table"
    const words = await db.all('SELECT id, word FROM Words ORDER BY RANDOM() LIMIT 2');
    //formats the words variable as JSON, stores it in the response object, and marks the response as a success (with status(200))
    response.status(200).json(words);
}
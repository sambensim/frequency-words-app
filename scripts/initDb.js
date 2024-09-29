const { openDB } = require('../src/lib/db');

async function setup() {
    const db = await openDB();

    //.exec is for running SQL commands that modify the schema and don't return results
    //Using backticks "`" rather than quotes allows multi-line strings
    //The sqlite_sequence table will also be created in order to make AUTOINCREMENT work properly
    await db.exec(`
        CREATE TABLE IF NOT EXISTS Words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word TEXT NOT NULL
        );
    `);

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            word1_id INTEGER NOT NULL,
            word2_id INTEGER NOT NULL,
            selected_id INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(word1_id) REFERENCES Words(id),
            FOREIGN KEY(word2_id) REFERENCES Words(id),
            FOREIGN KEY(selected_id) REFERENCES Words(id)
        );
    `);

    const frequency_words = ['always', 'never', 'coin flip', 'sometimes', 'likely', 'rarely']
    //.all is for running SQL commands that do return results (multiple)
    //parentheses around first part so that .map is run after awaiting rather than on the promise
    const existingWords = (await db.all('SELECT * FROM Words')).map(row => row.word);
    for (const word of frequency_words) {
        if (!existingWords.includes(word)) {
            //.run is for running SQL commands that modify data and don't return results.
            //not having parentheses around the column name (word) will cause a syntax error, idk why tho
            //It's better to use "VALUES (?)', word" rather than "VALUES' + word" because it helps avoid SQL injection
            await db.run('INSERT INTO Words (word) VALUES (?)', word);
        }
    }
}

setup();
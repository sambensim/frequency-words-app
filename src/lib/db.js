import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function openDB() {
    return open({ filename: './database.sqlite', driver: sqlite3.Database});
}

module.exports = { openDB };
import { initializeDatabase, closeDb } from './db.js';

console.log('Initializing database...');
initializeDatabase();
console.log('Database initialized successfully.');
closeDb();

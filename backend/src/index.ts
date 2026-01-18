import app from './app.js';
import { initializeDatabase, closeDb } from './utils/db.js';

const PORT = process.env.PORT || 3000;

// Initialize database
initializeDatabase();
console.log('Database initialized');

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    closeDb();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    closeDb();
    process.exit(0);
  });
});

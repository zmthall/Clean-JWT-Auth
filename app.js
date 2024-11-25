import { startServer, stopServer } from "./frameworks/server.js";
import mongoose from "mongoose";
import './frameworks/database/MongoDB.js';
import { cache } from "./frameworks/database/node-cache.js";

const PORT = process.env.PORT || 3000;

// Start the server
startServer(PORT)
    .then(() => {
        console.log(`Server is up and running on port ${PORT}`);
    })
    .catch((error) => {
        console.error(error.message);
        process.exit(1);
    });

// Optionally, listen for termination signals to stop the server gracefully
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing server...');
    await stopServer();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('\nSIGINT signal received: closing server...');
    await mongoose.connection.close();
    await stopServer();
    cache.close();
    process.exit(0);
});
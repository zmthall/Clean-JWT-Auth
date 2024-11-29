import express from 'express';
import morgan from 'morgan';
import 'dotenv/config';
import { cache } from './database/node-cache.js';

const app = express();
let server;

// Middleware imports before routing
import { errorHandling, notFoundError } from './middleware/error-handling.js';
import cookieParser from 'cookie-parser';

app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Router imports
import authRouter from './routers/authRouter.js'

app.use('/auth', authRouter);

// Middleware imports after routing
app.use(notFoundError);
app.use(errorHandling);
app.use((req, res, next) => {
    console.log(myCache.get('6743e7b8cea4cf491031c9de'));
    return next();
})

// Start function
function startServer(port) {
    return new Promise((resolve, reject) => {
        server = app.listen(port, () => {
            resolve();
        });
        server.on('error', reject);
    });
}

// Stop function
function stopServer() {
    console.table(cache.getStats());
    return new Promise((resolve, reject) => {
        if (server) {
            server.close((error) => {
                if (error) return reject(error);
                console.log('Server stopped');
                resolve();
            });
        } else {
            resolve();
        }
    });
}

export { startServer, stopServer, app };

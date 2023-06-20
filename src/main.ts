import http from 'http';
import { app } from './api/index';

export const server = http.createServer(app);

const bootstrap = async (): Promise<void> => {
    try {
        server.listen(3000, () => {
            console.log('Server started on port 3000');
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void bootstrap();

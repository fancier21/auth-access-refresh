import http from 'http';

export const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            data: 'It Works!',
        })
    );
});

const start = async (): Promise<void> => {
    try {
        server.listen(3000, () => {
            console.log('Server started on port 3000');
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

void start();

import express from 'express';
class Server {
    app;
    port;
    constructor() {
        this.app = express();
        this.port = '3000';
        this.listen();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}
module.exports = Server;
//# sourceMappingURL=server.js.map
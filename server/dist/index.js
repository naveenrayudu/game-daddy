"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const sockets_1 = __importDefault(require("./sockets"));
require("./config/index");
const app = express_1.default();
const httpServer = http_1.default.createServer(app);
const PORT = process.env.PORT || 5000;
const io = sockets_1.default(httpServer);
app.use(cors_1.default());
app.get("/", (req, res) => {
    res.send('11111');
});
httpServer.listen(PORT, () => {
    console.log('Listening on port', PORT);
});
//# sourceMappingURL=index.js.map
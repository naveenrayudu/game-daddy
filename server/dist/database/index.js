"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const getMongoClient = (() => {
    let mongoDbClient = null;
    return () => __awaiter(void 0, void 0, void 0, function* () {
        if (mongoDbClient === null || !mongoDbClient.isConnected()) {
            try {
                mongoDbClient = yield mongodb_1.MongoClient.connect(process.env.MONGODB_CONNECTION_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true
                });
            }
            catch (error) {
                throw error;
            }
        }
        return mongoDbClient;
    });
})();
exports.getDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield getMongoClient();
    return client.db('heroku_mq225hb7');
});
//# sourceMappingURL=index.js.map
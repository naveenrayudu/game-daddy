import {MongoClient} from 'mongodb';


const getMongoClient = (() => {
    let mongoDbClient: MongoClient = null;
    return async () => {
        if(mongoDbClient === null || !mongoDbClient.isConnected()) {
            try {
                mongoDbClient = await MongoClient.connect(process.env.MONGODB_CONNECTION_URI, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true
                });
            } catch (error) {
                throw error;
            }
        }
        return mongoDbClient;
    }
})();

export const getDb = async () => {
    const client = await getMongoClient();
    return client.db('heroku_mq225hb7');
}

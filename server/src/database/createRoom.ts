import { getDb } from ".";
import { IRoom } from "../models/databaseModel";
import { ROOM_COLLECTIONS } from "../constants";
import { IGameInfo } from "../models/gameModels";

const createOrUpdateRoom = async (room: string, socketId: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        const db = await getDb();
        const updateOneRequest = await db.collection(ROOM_COLLECTIONS).updateOne({ roomId: room }, {
            $setOnInsert: {
                roomId: room 
            }, 
            $push: { 
                sockets: socketId 
            }
        }, { upsert: true})
    
        if(updateOneRequest.result.ok)
            return resolve();
    
        return reject('Error updating the document');
    })
}


const saveGameInfoToRoom = async (room: string, gameInfo: IGameInfo) => {
    return new Promise(async (resolve, reject) => {
        const db = await getDb();
        const updateOneRequest = await db.collection(ROOM_COLLECTIONS).updateOne({ roomId: room }, {
            $setOnInsert: {
                roomId: room 
            },
            $set: {
                gameInfo: gameInfo 
            }
        }, { upsert: true})
    
        if(updateOneRequest.result.ok)
            return resolve();
    
        return reject('Error updating the document');
    })
}


export {
    createOrUpdateRoom,
    saveGameInfoToRoom
}

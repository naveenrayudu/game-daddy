import gameHelper from '../helpers/gameHelper';
import redis from 'redis';
import { IGameInfo, IPlayerPositions, IPawnsInfo } from '../models/gameModels';


interface updatePlayerPositionProps {
    playerId: number,
    index: number,
    gameInfo: IGameInfo, 
    added?: number, 
    deleted?: number
}

interface clientEmitProps extends updatePlayerPositionProps {
    isDaddy: boolean,
    updatedPlayerId: number,
    positionsToDelete: number[],
}


export interface IClientUpdateProps {
    playerPositions: IPlayerPositions,
    pawnsInfo: IPawnsInfo,
    added?: number, 
    deleted?: number
    isDaddy: boolean,
    newPlayerId: number,
    positionsToDelete: number[],
}



const gameUpdates = (io: SocketIO.Server, redisClient: redis.RedisClient) => {
    const gameNameSpace = '/daddy';
    const daddyPlayers = 2;

    const insertGamePawns = (roomId: string, playerId: number, index: number) => {
        const insertGamePawnsCalBack = (gameInfo: IGameInfo) => {
            if(!gameInfo.playerPositions[playerId]) {
                gameInfo.playerPositions[playerId] = [index];
            } else {
                gameInfo.playerPositions[playerId].push(index);
            }
    
            if(gameInfo.pawnsInfo[playerId]) {
                gameInfo.pawnsInfo[playerId].availablePawns = gameInfo.pawnsInfo[playerId].availablePawns - 1;
            }
    
            updateClientForPawnPositions({
                playerId, 
                index, 
                gameInfo, 
                added:index, 
                deleted: undefined
            });
        }

        redisClient.get(roomId, (err, value) => {
            if(err)
                return;

            insertGamePawnsCalBack(JSON.parse(value) as IGameInfo);
        })
       
    }

    const moveGamePawns = (roomId: string, playerId: number, oldIndex: number, newIndex: number) => {
        const moveGamePawnsCalBack = (gameInfo: IGameInfo) => {
            gameInfo.playerPositions[playerId] = gameInfo.playerPositions[playerId].filter(t => t !== oldIndex);
            gameInfo.playerPositions[playerId].push(newIndex);

                updateClientForPawnPositions({
                    playerId, 
                    index: newIndex, 
                    gameInfo, 
                    added: newIndex, 
                    deleted:oldIndex
                })
            };

        redisClient.get(roomId, (err, value) => {
            if(err)
                return;

            moveGamePawnsCalBack(JSON.parse(value) as IGameInfo);
        })
    }

    const updateClientForPawnPositions = (info: updatePlayerPositionProps) => {

        // check if the position placed is a daddy.
        const isDaddy = gameHelper.checkIfPositionIsInDaddy(info.index, info.gameInfo.playerPositions[info.playerId]);

        let updatedPlayerId = info.playerId % daddyPlayers + 1;
        let positionsToDelete: number[] = [];
        if(isDaddy)
        {
            updatedPlayerId = info.playerId;
            positionsToDelete = gameHelper.getPositionsThatCanBeDeletedByPlayer(info.playerId, info.gameInfo.playerPositions);
        }

        info.gameInfo.currentPlayerId = updatedPlayerId;

        const clientProps = Object.assign({}, info, {isDaddy: isDaddy, updatedPlayerId: updatedPlayerId, positionsToDelete: positionsToDelete});
        informClientOfTheirPawnUpdates(clientProps);
     
    }

    const deletePlayerPawns = (roomId: string, playerId: number, index: number) => {
        const deleteGamePawnsCalBack = (gameInfo: IGameInfo) => {
            const updatedPlayerId = playerId % daddyPlayers + 1;
            gameInfo.playerPositions[updatedPlayerId] = gameInfo.playerPositions[updatedPlayerId].filter(t => t !== index);
            gameInfo.pawnsInfo[updatedPlayerId].unavailablePawns = gameInfo.pawnsInfo[updatedPlayerId].unavailablePawns + 1;

            const clientProps = {
                        isDaddy: false, 
                        updatedPlayerId: updatedPlayerId, 
                        positionsToDelete: [] as number[],
                        playerId: playerId,
                        gameInfo: gameInfo,
                        index: index,
                        deleted: index
                    };
            informClientOfTheirPawnUpdates(clientProps);
        }

        redisClient.get(roomId, (err, value) => {
            if(err)
                return;

            deleteGamePawnsCalBack(JSON.parse(value) as IGameInfo);
        })
    }


    const informClientOfTheirPawnUpdates = (clientProps: clientEmitProps) => {

        const clientPropsToPass: IClientUpdateProps = {
            newPlayerId: clientProps.updatedPlayerId,
            playerPositions: clientProps.gameInfo.playerPositions,
            pawnsInfo: clientProps.gameInfo.pawnsInfo,
            isDaddy: false,
            positionsToDelete: clientProps.positionsToDelete,
            added: clientProps.added,
            deleted: clientProps.deleted
        }

        // Game won by current playerId
        if(Object.keys(clientProps.gameInfo.pawnsInfo).some(key => clientProps.gameInfo.pawnsInfo[parseInt(key, 10)].unavailablePawns >= 7)) {
            clientPropsToPass.newPlayerId = clientProps.playerId;
            io.of(gameNameSpace).in(clientProps.gameInfo.gameId).emit('callClientToUpdateGameCompletion', clientPropsToPass);
            redisClient.del(clientProps.gameInfo.gameId);
            
        } else {
            io.of(gameNameSpace).in(clientProps.gameInfo.gameId).emit('callClientToUpdatePlayerPositions', clientPropsToPass);
            redisClient.set(clientProps.gameInfo.gameId, JSON.stringify(clientProps.gameInfo));
        }
    }

    return {
        insertGamePawns,
        moveGamePawns,
        deletePlayerPawns
    }
}

export default gameUpdates
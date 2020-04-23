export interface IPlayerPositions {
    [playerId:number] : number[]
}

export interface IPawnsInfo {
    [playerId:number] : {
        availablePawns: number,
        unavailablePawns: number
    }
}

export interface IGameInfo {
    gameId: string,
    currentPlayerId: number,
    gamePlayerIds: number[],
    pawnsInfo: IPawnsInfo,
    playerPositions: IPlayerPositions
}
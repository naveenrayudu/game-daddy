export interface IAction {
    payload: any,
    type: string
}


export interface IDaddyGameState {
    roomId: string,
    playerId: number,
    isCurrentPlayer: boolean,
    canPlayGame: boolean,
    isDaddy: boolean,
    gamePlayerIds: number[],
    positionsToDelete: number[],
    pawnsInfo: {
        [playerId:number] : {
            availablePawns: number,
            unavailablePawns: number
        }
    },
    gamePositions: {
        [playerId:number] : number[]
    }
}

export interface IAppState {
    daddyGame: IDaddyGameState
}
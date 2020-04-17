export interface IAction {
    payload: any,
    type: string
}


export interface IDaddyGameState {
    roomId: string,
    playerId: number,
    isCurrentPlayer: boolean,
    canPlayGame: boolean,
    gamePlayerIds: number[],
    gamePositions: {
        [playerId:number] : number[]
    }
}

export interface IAppState {
    daddyGame: IDaddyGameState
}
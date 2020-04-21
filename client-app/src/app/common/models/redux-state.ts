import { GameStatusType } from "./types";

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
    },
    gameStatus: {
        type: GameStatusType,
        playerId: number
    },
    animation: IAnimationState
}

export interface IAppState {
    daddyGame: IDaddyGameState,
    modal: IModalState
}

export interface IModalState {
    content?: any,
    styles?: {},
    allowCloseOutsideDoc?: boolean
}

export interface IAnimationState {
    [index: number]: string
}
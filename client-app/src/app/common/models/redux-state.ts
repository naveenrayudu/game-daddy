import { GameStatusType } from "./types";

export interface IAction{
    payload: any,
    type: string
}

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

export interface IDaddyGameState extends IGameInfo {
    gameId: string,
    playerId: number,
    isCurrentPlayer: boolean,
    canPlayGame: boolean,
    isDaddy: boolean,
    positionsToDelete: number[],
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


export interface IClientUpdateProps {
    playerPositions: IPlayerPositions,
    pawnsInfo: IPawnsInfo,
    added?: number, 
    deleted?: number
    isDaddy: boolean,
    newPlayerId: number,
    positionsToDelete: number[],
}

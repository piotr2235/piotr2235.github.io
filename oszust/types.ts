export enum GamePhase {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  REVEAL = 'REVEAL',
  PLAYING = 'PLAYING',
  VOTING = 'VOTING',
  RESULT = 'RESULT'
}

export interface Player {
  id: string;
  name: string;
  isImposter: boolean;
  hasSeenRole: boolean;
}

export interface GameData {
  secretWord: string;
  category: string;
  imposterHint: string;
}

export interface GameConfig {
  imposterCount: number;
  category: string;
  playerNames: string[];
}
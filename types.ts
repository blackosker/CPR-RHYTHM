
export enum GameState {
  Idle = 'IDLE',
  Running = 'RUNNING',
  Finished = 'FINISHED',
}

export enum FeedbackType {
  PERFECT = 'PERFECT',
  ACCEPTABLE = 'ACCEPTABLE',
  POOR = 'POOR',
  MISSED = 'MISSED',
  INFO = 'INFO',
  COMPLETE = 'COMPLETE'
}

export interface FeedbackState {
  text: string;
  type: FeedbackType;
}

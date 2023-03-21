interface innerArrI {
  id: number;
  innerNum: number;
  state: boolean;
}

export interface TimerObjI {
  totalTime: number;
  timeLeft: string;
  timePassed: string;
  timerStop: boolean;
}

export interface rowObjI {
  id: number;
  innerArr: innerArrI[];
}

export interface SumUp {
  difficulty: string;
  time: string;
  totalTime: number;
}

export interface LeaderResultsI {
  name?: string;
  time: string;
  difficulty: string;
  totalTime: number;
}

export interface State {
  recordsData: LeaderResultsI[] | null;
}

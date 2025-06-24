import {IIssue} from './issue.model';

export interface ITimeLog {
  id: string;
  issue: IIssue;
  spentAt: Date;
  timeSpent: number;
}


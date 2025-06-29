import {IGitlabUser, IUser} from './user.model';

export interface IIssue {
  id: string;
  iid: number;
  title: string;
  state: string;
  webUrl: string;
  projectId: number;
  assignees: IGitlabUser[];
  moved: boolean;
  movedTo: IIssue;
}

export interface IIterationIssue extends IIssue {
  closedAt: string;
  labels: ILabel[];
  timelogs: IIssueTimeLog[];
  timeEstimate: number;
}

export interface IBurndownIssue {
  issue: IIterationIssue;
  spentTime: number;
  spentTimeInIteration: number;
}

export interface ILabel {
  id: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
}

export interface IIssueTimeLog {
  id: string;
  spentAt: string;
  timeSpent: number;
  user: IUser;
}

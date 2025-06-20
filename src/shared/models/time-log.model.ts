import {IGitlabUser} from './user.model';

export interface ITimeLog {
  id: string;
  issue: IIssue;
  spentAt: Date;
  timeSpent: number;
}

export interface IIssue {
  id: string;
  iid: number;
  title: string;
  state: string;
  webUrl: string;
  projectId: number;
  assignees: IGitlabUser[];
}

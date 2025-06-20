import {IIssue} from './time-log.model';
import {IMergeRequest} from './merge-request.model';

export interface IActivity {
  id: number;
  projectId: number;
  actionName: string;
}

export interface IActivityIssue {
  issue: IIssue;
  activities: IActivity[];
  mergeRequest: IMergeRequest;
  dev: boolean;
  timeSpent: number;
  timeInput: string;
}

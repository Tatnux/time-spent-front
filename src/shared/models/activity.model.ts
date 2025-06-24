import {IMergeRequest} from './merge-request.model';
import {IIssue} from './issue.model';

export interface IActivity {
  id: number;
  projectId: number;
  targetIid: number;
  actionName: string;
  pushData: IPushData;
  note: INoteData
}

export interface IPushData {
  commitCount: number;
  refType: string;
  ref: string;
  commitTitle: string;
}

export interface INoteData {
  body: string;
  projectId: number;
  noteableId: number;
  noteableIid: number;
  noteableType: string;
}

export interface IActivityIssue {
  issue: IIssue;
  activities: IActivity[];
  timeSpent: number;
  displayActivities?: IDisplayActivity[];
  mergeRequest?: IMergeRequest[];
  dev?: boolean;
  timeInput?: string;
}

export interface IDisplayActivity {
  name: string;
  webUrl: string;
  actionName: string;
  count: number;
  type?: string;
  targetType?: string;
  tooltips: string[];
}

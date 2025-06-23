import {IIssue} from './time-log.model';
import {IMergeRequest} from './merge-request.model';

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
  mergeRequest?: IMergeRequest;
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
}

import {IMergeRequest} from './merge-request.model';
import {IIssue} from './issue.model';
import {NzPresetColor, NzStatusColor} from 'ng-zorro-antd/core/color';

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
  id: string;
  issue: IIssue;
  activities: IActivity[];
  timeSpent: number;
  displayActivities?: IDisplayActivity[];
  mergeRequest?: IMergeRequest[];
  status?: Status;
  timeInput?: string;
}

export type Status = 'Development' | 'Review' | 'Other';

export const statusOrder: Record<Status, number> = {
  Development: 0,
  Review: 1,
  Other: 2
}

export const statusColor: Record<Status, string> = {
  Development: 'orange',
  Review: 'purple',
  Other: '#bbb'
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

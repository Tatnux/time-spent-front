import {IGitlabUser} from './user.model';

export interface IMergeRequest {
  id: number;
  iid: number;
  projectId: number;
  title: string;
  webUrl: string;
  sourceBranch: string;
  assignees: IGitlabUser[];
}

import {IGitlabUser} from './user.model';

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

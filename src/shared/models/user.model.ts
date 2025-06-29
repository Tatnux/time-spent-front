export interface IUser {
  id: string;
  username: string;
  avatarUrl: string;
}


export interface IGitlabUser extends IUser {
  name: string;
  publicEmail: string;
  lastActivityOn: string;
  gpcRole: string;
}

export interface IUser {
  id: string;
  username: string;
}


export interface IGitlabUser extends IUser {
  name: string;
  avatarUrl: string;
  publicEmail: string;
  lastActivityOn: string;
}

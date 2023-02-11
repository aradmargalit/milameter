type ISODate = string;
type URL = string;

export type Athlete = {
  id: number;
  username: string;
  resource_state: number;
  firstname: string;
  lastname: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: ISODate;
  updated_at: ISODate;
  weight: number;
  profile_medium: URL;
  profile: URL;
};

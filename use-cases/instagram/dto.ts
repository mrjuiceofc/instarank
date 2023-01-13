export type SortPostsByUsernameDTO = {
  requestId: string;
  userId: string;
  username: string;
  sortBy: 'likes' | 'comments' | 'date';
  only: 'posts' | 'reels' | 'all';
  fromDate: Date;
  untilDate: Date;
  postsLimit: number;
};

export type GetDataByUsernameDTO = {
  requestId: string;
  username: string;
  postsLimit: number;
  fromDate: Date;
  untilDate: Date;
  only: 'posts' | 'reels' | 'all';
};

export type GetProxyUrlDTO = {
  url: string;
};

export type InstagramUser = {
  username: string;
  profileImage: string;
};

export type InstagramPost = {
  files: string[];
  likes: number;
  comments: number;
  igUrl: string;
  type: 'posts' | 'reels';
  publicationDate: Date;
};

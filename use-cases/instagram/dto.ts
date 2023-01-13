export type SortPostsByUsernameDTO = {
  requestId: string;
  userId: string;
  username: string;
  postsLimit: number;
  sortBy: 'likes' | 'comments' | 'date';
  only: 'posts' | 'reels' | 'all';
  fromDate: Date;
  untilDate: Date;
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

export type InstagramImage = {
  lowResolution: string;
  highResolution: string;
};

export type InstagramPost = {
  images: InstagramImage;
  likes: number;
  comments: number;
  igUrl: string;
  type: 'posts' | 'reels';
  publicationDate: Date;
};

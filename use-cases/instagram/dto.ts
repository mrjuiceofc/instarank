export type SortPostsByUsernameDTO = {
  requestId: string;
  userId: string;
  username: string;
  sortBy: 'likes' | 'views' | 'comments' | 'date';
  only: 'posts' | 'reels' | 'all';
  fromDate: Date;
  untilDate: Date;
};

export type GetDataByUsernameDTO = {
  requestId: string;
  username: string;
};

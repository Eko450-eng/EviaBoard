import type { RecordId } from "surrealdb";

export type ASBCheck = {
  id?: RecordId,
  name: string,
}

export type Channel = {
  id?: RecordId,
  channelname: string,
}

export type Pushkey = {
  id?: RecordId,
  data: object,
  user: User,
}

export type Pushkey_Channel = {
  id?: RecordId,
  in: Pushkey,
  out: Channel,
}


export type Votes = {
  id?: RecordId,
  voter: User,
}

export type Tickets = {
  id?: RecordId,
  name: string,
  no: number,
}

export type Kb_Comment = {
  id?: RecordId
  in: Post,
  out: Comments,
}

export type Comments = {
  id?: RecordId
  owner: User
  created_at: Date
  comment: string
}

export type News_newspost = {
  id?: RecordId;
  owner: User;
  title: string;
  date: Date;
  newspost: Newspost[];
};


export type News_Post = {
  id?: RecordId,
  in: News,
  out: Newspost,
}

export type News = {
  id?: RecordId;
  owner: User;
  title: string;
  date: Date;
};

export type Newspost = {
  id?: RecordId;
  name: string;
  owner: User;
};

export type Report = {
  source?: string;
  id?: RecordId;
  title: string;
  body: string;
  status: number;
  category: number;
  upvotes: number;
  owner: any
};

export type Post = {
  id?: RecordId;
  title: string;
  body: string;
  solution: string;
  owner: any;
  topic: string;
  deleted: boolean;
};

export type User = {
  id?: RecordId;
  image?: string;
  email: string;
  name: string;
  password: string;
  role: string;
};

export type Topic = {
  id?: RecordId;
  name: string;
};

export type Downloadlinks = {
  id?: RecordId;
  name: string;
  description: string;
  link: string;
  owner: { name: string; id: string; tb: string };
};

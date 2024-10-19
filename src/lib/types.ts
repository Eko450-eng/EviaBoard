import type { RecordId } from "surrealdb";
import type { user } from "./db";

export type Comments = {
  id?: RecordId
  owner: user
  created_at: Date
  comment: string
}

export type News_newspost = {
  id?: RecordId;
  owner: user;
  title: string;
  date: Date;
  newspost: Newspost[];
};

export type News = {
  id?: RecordId;
  owner: user;
  title: string;
  date: Date;
};

export type Newspost = {
  id?: RecordId;
  name: string;
  owner: user;
};

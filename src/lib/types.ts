import type { RecordId } from 'surrealdb';

export type NotificationResult = {
	title: string;
	desc: string;
	error: boolean;
};

export type ASBCheck = {
	id?: RecordId;
	name: string;
};

export type Channel = {
	id?: RecordId;
	channelname: string;
};

export type Pushkey = {
	id?: RecordId;
	data: object;
	user: User;
	created_at?: Date;
};

export type Pushkey_Channel = {
	id?: RecordId;
	in: Pushkey;
	out: Channel;
};

export type Post_Vote = {
	id?: RecordId;
	in: Post;
	out: User;
};

export type Votes = {
	id?: RecordId;
	voter: User;
};

export type PostVotes = {
	id?: RecordId;
	post: Post;
	voter: User;
};

export type Tickets = {
	id?: RecordId;
	created_at?: Date;
	name: string;
	no: number;
};

export type Kb_Comment = {
	id?: RecordId;
	in: Post;
	out: Comments;
};

export type Comments = {
	id?: RecordId;
	owner: User | RecordId;
	created_at?: Date;
	comment: string;
};

export type News_newspost = {
	id?: RecordId;
	owner: User | RecordId;
	title: string;
	date: Date;
	newspost: Newspost[];
};

export type News_Post = {
	id?: RecordId;
	in: News;
	out: Newspost;
};

export type News = {
	id?: RecordId;
	owner: User | RecordId;
	title: string;
	date: Date;
};

export type Newspost = {
	id?: RecordId;
	name: string;
	owner: User | RecordId;
	created_at?: Date;
};

export type Report = {
	source?: string;
	id?: RecordId;
	title: string;
	body: string;
	status: number;
	category: number;
	upvotes: number;
	owner: User | RecordId;
	created_at?: Date;
};

export type Post = {
	id?: RecordId;
	title: string;
	body: string;
	solution: string;
	owner: User | RecordId;
	topic: RecordId | string;
	deleted: boolean;
	created_at?: Date;
	upvotes?: number;
};

export type User = {
	id?: RecordId;
	image?: string;
	email: string;
	name: string;
	password: string;
	role: string;
	created_at?: Date;
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
	owner: User | { name: string; id: string; tb: string };
};

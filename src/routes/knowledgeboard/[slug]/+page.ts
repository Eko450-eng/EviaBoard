import { get } from "svelte/store";
import { checkLoggedIn, userData } from "../../store";
import { db } from "@/db";
import type { Post, Topic } from "@/types";

async function queryPosts(id: string) {
  let query =
    `select id, body, title, solution, topic.name as topic, owner.id, owner.name, owner.image, deleted from posts WHERE id=${id}`
  let posts_raw = await db?.query<Array<Array<Post>>>(query);
  if (!posts_raw) return;
  return posts_raw[0];
}

async function queryTopics() {
  let raw_data = await db?.select<Topic>("topics");
  return raw_data;
}


export let ssr = false

async function loadPageData(id: string) {
  checkLoggedIn()
  let user = get(userData);
  let response;
  if (!user.email) {
    response = {
      res: [],
      topics: [],
      failed: true
    }
  } else {
    let resPosts = await queryPosts(id);
    let resTopics = await queryTopics();
    response = {
      res: resPosts,
      topics: resTopics,
      failed: false
    }
  }
  return response
}


export async function load({ params, parent }: any) {
  await parent()
  let data = await loadPageData(params.slug);

  return {
    posts: data?.res,
    topics: data?.topics,
    failed: data?.failed
  }
}



import { db, type post, type topic } from "@/db";
import { checkLoggedIn, } from "../store";

async function queryPosts() {
  let query =
    "select id, body, title, topic.name as topic, owner.id, owner.name, owner.image, deleted from posts WHERE  !deleted OR deleted AND owner = $auth.id";
  let posts_raw = await db?.query<Array<Array<post>>>(query);
  if (!posts_raw) return;
  return posts_raw[0];
}

async function queryTopics() {
  let raw_data = await db?.select<topic>("topics");
  return raw_data;
}

export let ssr = false;
export let csr = true;

async function loadPageData() {
  checkLoggedIn()
  let response;
  let resPosts = await queryPosts();
  let resTopics = await queryTopics();
  response = {
    res: resPosts,
    topics: resTopics,
    failed: false
  }
  return response
}


export async function load({parent}) {
  await parent()
  let data = await loadPageData();
  return {
    posts: data?.res,
    topics: data?.topics,
    failed: data?.failed
  }
}

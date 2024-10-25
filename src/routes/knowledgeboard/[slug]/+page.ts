import type { Post, Topic } from "@/types";
import Surreal from "surrealdb";
import { env } from "$env/dynamic/public";

export let ssr = false
let HOST = env.PUBLIC_DB_HOST;
let guestpw = env.PUBLIC_DB_GUEST_PW;

let db = new Surreal();

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


async function loadPageData(id: string) {
  try {
    await db.connect(HOST
      , {
        versionCheck: false,
        auth: {
          namespace: "evia",
          database: "knowledgebase",
          username: "eviaguest",
          password: guestpw
        }
      }
    )
  } catch (err) {
    // throw err;
    console.error("FAIL")
  }


  //checkLoggedIn()
  // let user = get(userData);
  let response;
  // if (!user.email) {
  //   response = {
  //     posts: [],
  //     topics: [],
  //     failed: true
  //   }
  // } else {
  let resPosts = await queryPosts(id);
  let resTopics = await queryTopics();
  response = {
    posts: resPosts,
    topics: resTopics,
    failed: false
  }
  //}
  return response
}


export async function load({ params, parent }: any) {
  await parent()
  let data = await loadPageData(params.slug);
  console.log("Hier", data)
  return data
}



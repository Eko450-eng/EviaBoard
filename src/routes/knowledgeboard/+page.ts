import { db, type post } from "@/db";
import { userData } from "../store";
import { get } from "svelte/store";


async function queryPosts() {
  let query =
    "select id, body, title, topic.name as topic, owner.id, owner.name, deleted from posts WHERE  !deleted";
  let posts_raw = await db?.query<Array<Array<post>>>(query);
  if (!posts_raw) return;
  return posts_raw[0];
}

async function loadPageData() {
  let user = get(userData);
  let response;
  if (!user.email) {
    response = {
      res: [],
      failed: true
    }
  } else {
    let res = await queryPosts();
    response = {
      res: res,
      failed: false
    }
  }
  return response

  // const queryUuid = await db?.live("posts", (action, _result) => {
  //   if (action === "CLOSE") return;
  // });
  // await db?.subscribeLive(queryUuid!, async (action, _result) => {
  //   if (
  //     action === "CREATE" ||
  //     action === "UPDATE" ||
  //     action === "DELETE"
  //   ) {
  //     queryPosts();
  //   }
  // });
}


export async function load() {
  let data = await loadPageData();
  return {
    posts: data?.res,
    failed: data?.failed
  }
}

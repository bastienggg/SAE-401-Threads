import { getRequest } from "../lib/api-request";

export async function getPosts() {
  return await getRequest("/posts");
}

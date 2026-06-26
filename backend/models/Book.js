// put more comments throughout the code and tell us what's happening or about to happen here
import { getDB } from "../db.js";

export function getBooksCollection() {
  return getDB().collection("books");
}

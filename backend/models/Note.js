import { getDB } from "../db.js";

export function getNotesCollection() {
  return getDB().collection("notes");
}

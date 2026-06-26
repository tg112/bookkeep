// put more comments throughout the code

import { ObjectId } from "mongodb";
import { getNotesCollection } from "../models/Note.js";

export const getNotesByBook = async (req, res) => {
  try {
    const notes = await getNotesCollection()
      .find({ bookId: new ObjectId(req.params.bookId) })
      .sort({ createdAt: -1 })
      .toArray();
    return res.status(200).json(notes);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const addNote = async (req, res) => {
  try {
    const content = (req.body.content ?? "").trim();
    if (!content) {
      return res.status(400).json({ error: "Note content is required" });
    }

    const now = new Date();
    const doc = {
      bookId: new ObjectId(req.params.bookId),
      content,
      page: req.body.page ?? null,
      createdAt: now,
      updatedAt: now,
    };
    const result = await getNotesCollection().insertOne(doc);
    const note = await getNotesCollection().findOne({ _id: result.insertedId });
    return res.status(201).json(note);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const update = { updatedAt: new Date() };
    if (req.body.content !== undefined) {
      const content = String(req.body.content).trim();
      if (!content) {
        return res.status(400).json({ error: "Note content is required" });
      }
      update.content = content;
    }
    if (req.body.page !== undefined) {
      update.page = req.body.page;
    }

    const note = await getNotesCollection().findOneAndUpdate(
      { _id: new ObjectId(req.params.noteId) },
      { $set: update },
      { returnDocument: "after" },
    );
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    return res.status(200).json(note);
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const result = await getNotesCollection().deleteOne({
      _id: new ObjectId(req.params.noteId),
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Note not found" });
    }
    return res.status(200).send();
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

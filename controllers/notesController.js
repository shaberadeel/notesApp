import Note from "../models/Note.js";

export const getNotes = async (req, res) => {
  const notes = await Note.find({ owner: req.user._id });
  res.json(notes);
};

export const getNoteById = async (req, res) => {
  const note = await Note.findOne({ _id: req.params.id, owner: req.user._id });
  if (!note) return res.status(404).json({ message: "Note not found" });
  res.json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({ ...req.body, owner: req.user._id });
  res.status(201).json(note);
};

export const updateNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    req.body,
    { new: true }
  );
  res.json(note);
};

export const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });
  res.status(204).end();
};

export const shareNote = async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { $addToSet: { sharedWith: req.body.userId } },
    { new: true }
  );
  res.json(note);
};

export const searchNotes = async (req, res) => {
  const { q } = req.query;
  const notes = await Note.find(
    { owner: req.user._id, $text: { $search: q } },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
  res.json(notes);
};

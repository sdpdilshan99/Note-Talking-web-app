import type { Response, Request } from "express";
import Note from "../models/Note.js";

interface AuthRequest extends Request {
    user?: any;
}

export const createNote = async (req: AuthRequest, res: Response) => {
    try {
        const {title, content} = req.body;

        const note = await Note.create({
            title,
            content,
            owner: req.user._id,
        })
        res.status(201).json(note);
    } catch (error) {
        res.status(400).json({ message: "Error creating note", error });
    }
}

//Get All my notes (owned and collaborated)
export const getMyNotes = async (req: AuthRequest, res: Response) => {
    try {
        const notes = await Note.find({
            $or: [
                { owner: req.user._id },
                { collaborators: req.user._id }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes" });
    }
}

//Update Note
export const updateNote = async (req: AuthRequest, res: Response) => {
    try {
        const note = await Note.findById(req.params.id);

        if(!note) return res.status(404).json({message: 'Note not found'});

        const isOwner = note.owner.toString() === req.user._id.toString();
        const isCollaborator = note.collaborators.includes(req.user._id);

        if(!isOwner && !isCollaborator){
            return res.status(403).json({message: 'Not authorized to update this note'});
        }

        const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {new: true});
        res.status(200).json(updatedNote);

    } catch (error) {
        res.status(400).json({ message: "Error updating note" });
    }
}


//Delete Note
export const deleteNote = async (req: AuthRequest, res: Response) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        if (note.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this note" });
        }

        await note.deleteOne();
        res.status(200).json({ message: "Note deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting note", error });
    }
}
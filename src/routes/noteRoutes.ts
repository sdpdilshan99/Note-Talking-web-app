import express from 'express';
import {createNote, getMyNotes, updateNote, deleteNote} from '../controllers/noteController.js'
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(authMiddleware,createNote).get(authMiddleware, getMyNotes);
router.route('/:id').put(authMiddleware, updateNote).delete(authMiddleware,deleteNote);

export default router;
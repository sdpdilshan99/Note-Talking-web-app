import jwt from "jsonwebtoken"
import type {Request, Response} from "express"
import User from "../models/User.js";

const generateToken = (id: string): string => {
    const secret = process.env.JWT_SECRET;

    return jwt.sign({id}, secret!, {expiresIn: '30d'});
};

export const registerUser = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing!");
            return res.status(500).json({ message: "Server configuration error" });
        }

        //Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        //check if user exists
        const userExists = await User.findOne({email});

        if(userExists) {
            return res.status(400).json({message: "User already exists"});
        }

        //create user
        const user = await User.create({name, email, password});

        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id as string),
            });
        }
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}

export const loginUser = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        //check if user exists
        const user = await User.findOne({email}).select('+password');

        if(!user) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        //check if password is correct
        if(user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id as string),
            });
        }else{
            res.status(400).json({message: "Invalid credentials"});
        }
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
}
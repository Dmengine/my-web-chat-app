import { Request, Response } from 'express';
import {User} from '../model/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();


export const Register = async (req: Request, res: Response) => {
    // console.log("Register endpoint hit");
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({
                message: 'Please fill all the fields',
                success: false
            })
        }
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).send({
                message: 'User already exists',
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.status(201).send({
            message: 'User registered successfully',
            success: true,
            data: newUser
        })

    } catch (error: any) {
        console.error("Register Error:", error.message);
        res.status(500).send({
            message: 'Internal server error',
            success: false,
            error: error.message
        });
    }
}

export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({
                messaage: 'Please fill all the fields',
                success: false
            })
        }
        const existingUser = await User.findOne({email});
        if (!existingUser){
            return res.status(400).send({
                message: 'User does not exist',
                success: false
            })
        }
        const comparePassword = await bcrypt.compare(password, existingUser.password);
        if(!comparePassword) {
            return res.status(400).send({
                message: 'Invalid credentials',
                success: false
            })
        }
        const token = jwt.sign({ _id: existingUser._id}, process.env.JWT_SECRET as string, {
            expiresIn: '8d'
        })
        res.status(200).send({
            message: 'Login successful',
            success: true,
            data: existingUser,
            token: token
        })
    } catch (error) {
        res.status(500).send({
            message: "Failed to login",
            success: false,
        })
    }
}

export const Logout = async (req: Request, res: Response) => {
    try {
       res.status(200).send({
        message: 'Logout successful',
        success: true
       }) 
    } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed. Something went wrong.',
    });
  }
}
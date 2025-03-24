import bcrypt, { compare } from 'bcrypt';
import jwt from 'jsonwebtoken'
import db from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

export const register = async (req, res)=>{
  const {name, email, password} = req.body;
  if(!name || !email || !password){
     return res.status(500).json({message: "all fields are required"});
  }
  const hashpassword = await bcrypt.hash(password, 10);
  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql,[name, email, hashpassword], (err, result)=>{
    if(err){
        return res.status(400).json({message: "Error occured pls check error", err});
    }
    res.status(201).json({message: "user registered sucess"});
  })
}

export const login = (req, res) =>{
    const {email, password} = req.body;
     
    if(!email || !password){
        return res.status(500).json({message: "all fields req"});
    }
    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, results)=>{
        if(err || results.length === 0){
            return res.status(500).json({message: "not valid credentials", err});
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({message: "invalid password"});
        }
        const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_SECRET, {expiresIn:"1h"});
        res.status(200).json({message:" login successul", token})
    })
}
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import express from 'express'
import sequelize from 'sequelize'
import { validationResult } from 'express-validator'
import dotenv from 'dotenv'
dotenv.config()
import {Authentication} from '../model/authentication.js'


const createAuthentication = async (req, res) => 
{
    try 
    {
        const { username, password } = req.body
        console.log(username);
        
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword)
            
        await Authentication.create({
            username: username,
            password: hashedPassword
        }).then(result => {
            console.log(result)
            res.status(201).json({
                "response" : result,
                "message" : "Account created successfully",
                "flag" : true
                })                
            }).catch((error) => {
                res.status(400).json({
                    "response": error
                })
            });
             
    } 
    catch 
    {
        res.status(500).json({
            "message" : "internal server error"
        })
    }
    
}

const fetchAuthentication = async (req, res) => 
{
    const { username, password } = req.body
    try
    {
            const result = await Authentication.findOne({
                where: { 
                    username: username 
                }
            })
            console.log(result)
            if(result!=null){
                if(await bcrypt.compare(password, result.dataValues.password)) {
                    // res.send('success')
                    const u = { username: username }
        
                    const accessToken = jwt.sign(u, 'sjjs', {
                        expiresIn: '10h'
                    })
                    res.status(200).json({
                        "accessToken" : accessToken,
                        "message" : "authorized" 
                    })
                } else {
                    res.status(400).json({
                        "message" : "incorrect password"
                    })
                }
            } else {
                res.status(400).json({
                    "response": "user does not exist"
                })
            }
    } 
    catch(err) 
    {
        res.status(400).json({
            "response": err
        })
    }
}

async function authenticateToken (req, res, next) 
{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) {
        return res.status(401).json({ // go back to login page
            "message" : "Not authorized"
        })
    }

    jwt.verify(token, 'sjjs', (err, username) => {
        if(err) return res.status(403).json({
            "message" : err.message
        })
        req.username = username.username
        // console.log(req.username)
        next()
    })
}

export{ createAuthentication, fetchAuthentication, authenticateToken};



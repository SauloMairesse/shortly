import db from '../database.js'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

export async function signUp(req, res){
    const {name, password, confirmPassword, email} = req.body

    try{

        if(password !== confirmPassword){
            throw { type: "passwords must be equal"} 
        }

        const { rows: userRegistered } = await db.query(`
            SELECT * 
            FROM users
            WHERE users.email = $1`, 
            [email] )
        
        if( userRegistered[0]) {
            throw { type: "user already exist" } 
        }
        
        const bcryptKey = Number(process.env.BCRYPT_SALT)
        const pwBcrypt = bcrypt.hashSync(password, bcryptKey)

        await db.query(`
            INSERT INTO users(name, email, password)
            VALUES ($1, $2, $3)`, 
            [name, email, pwBcrypt] )

        return res.status(201).send({message: 'User was registered successfully'})
        
    }catch(err){
        if (err.type === "passwords must be equal") { 
            return res.sendStatus(404)
        }
        if (err.type === "user already exist") {
            return res.sendStatus(404)
        }

        return res.sendStatus(500);
    }
} 

export async function signIn(req, res){
    const {email, password} = req.body

    try{

        const {rows: userByEmail} = await db.query(`
            SELECT * 
            FROM users
            WHERE users.email = $1`,
            [email] )

        const pwConfirmation = bcrypt.compareSync(password, userByEmail[0].password)

        if(!userByEmail[0] || !pwConfirmation){ 
            throw { type: "email or password wrong" } 
        }
    
        const token = jwt.sign({userId: userByEmail[0].id}, process.env.JWT_KEY)

        return res.status(200).send(token)
    }catch( err ){
        if (err.type === "email or password wrong") { 
            return res.sendStatus(404) 
        }
        
        return res.sendStatus(500);
    }
}
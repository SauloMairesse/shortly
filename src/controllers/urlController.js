import jwt from 'jsonwebtoken';
import {nanoid} from 'nanoid'
import db from '../database.js'
import dotenv from 'dotenv'
dotenv.config()

export async function createUrl(req, res){
    const {url} = req.body
    const authorization = req.headers.authorization
    const token = authorization.replace("Bearer ", "").trim();

    try {
        const {rows: urlByUrl} = await db.query(`
            SELECT * FROM urls
            WHERE urls.url = $1`, [url])

        if(urlByUrl[0]){
            throw { type: 'url already exist'}
        }

        const {userId} = jwt.verify(token, process.env.JWT_KEY)
        const shortUrl = nanoid(8)

        await db.query(`
            INSERT INTO urls ("userId", url, "shortUrl")
            VALUES ($1, $2, $3)`,
            [userId, url, shortUrl])

        return res.status(201).send(shortUrl)

    } catch (error) {
        if (error.type === 'url already exist') { 
            return res.sendStatus(409) 
        }

        return res.sendStatus(500);
    }
}

export async function urlById(req, res){
    const {id} = req.params

    try {
        const {rows: url} = await db.query(`
            SELECT id, "shortUrl", url
            FROM urls
            WHERE urls.id = $1`,
            [id] )

        if(!url[0]){
            throw { type: 'not found'}
        }    

        return res.status(200).send(url[0])
        
    } catch (error) {
        if (error.type === 'not found') { 
            return res.sendStatus(404) 
        }
    }
}

export async function openUrl(){

    try {
        
    } catch (error) {
        
    }
}


export async function deleteUrl(){

    try {
        
    } catch (error) {
        
    }
}
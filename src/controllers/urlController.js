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

        // if(urlByUrl[0]){
        //     throw { type: 'url already exist'}
        // }

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
        return res.sendStatus(500);
    }
}

export async function openUrl(req, res){
    const {shortUrl} = req.params 
    
    try {
        const {rows: urlByShort} = await db.query(`
            SELECT *
            FROM urls
            WHERE urls."shortUrl" = $1`, 
            [shortUrl] )
        
        if(!urlByShort[0]) {
            throw { type: 'not found' }
        }

        await db.query(`
            UPDATE urls 
            SET views = views + 1
            WHERE "shortUrl" = $1`,
            [shortUrl] )
        
        return res.status(301).redirect(`${urlByShort[0].url}`)

    } catch (error) {
        if (error.type === 'not found') { 
            return res.sendStatus(404) 
        }
        return res.sendStatus(500);
    }
}

export async function deleteUrl(req, res){
    const {id} = req.params
    const authorization = req.headers.authorization
    const token = authorization.replace("Bearer ", "").trim();
 
    try {
        const {userId} = jwt.verify(token, process.env.JWT_KEY)
        const {rows: url} = await db.query(`
            SELECT * FROM urls
            WHERE urls.id = $1`,
            [id] )

            if(!url[0]){
                throw { type: 'not found' }
            }
            if(url[0].userId != userId){
                throw { type: 'URL does not belong to the user' }
            }

            await db.query(`
                DELETE FROM urls
                WHERE urls.id = $1`,
                [id] )
            
            return res.sendStatus(204)

    } catch (error) {
        if (error.type === 'URL does not belong to the user') { 
            return res.sendStatus(401)
        }
        if (error.type === 'not found') { 
            return res.sendStatus(404)
        }
        
        return res.sendStatus(500)
    }
}
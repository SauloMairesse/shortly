import db from "../database.js";
import jwt from "jsonwebtoken";

export async function userMe(req, res){
    const authorization = req.headers.authorization
    const token = authorization.replace("Bearer ", "").trim();
    const {userId} = jwt.verify(token, process.env.JWT_KEY)

    try {
        const {rows: userInfo} = await db.query(`
            SELECT users.id, users.name, SUM(urls."views") as visitCount
            FROM users
            LEFT JOIN urls
            ON urls."userId" = users.id
            WHERE users.id = $1
            GROUP BY users.id`,
            [userId] )
        const {rows: urlsOfUser} = await db.query(`
            SELECT id, "shortUrl", url, views AS "visitCount" 
            FROM urls
            WHERE urls."userId" = $1`,
            [userId] )

        const test = { ...userInfo[0], shortenedUrls: urlsOfUser}
        console.log(test)

        return res.status(200).send(test)
    } catch (error) {
        
        return res.sendStatus(500)
    }
}
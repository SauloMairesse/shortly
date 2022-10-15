import db from "../database.js";

export async function ranking(req, res){

    try {
        const {rows: listRank} = await db.query(`
            SELECT users.id, users.name, COUNT(urls.url) as "linksCount", COALESCE(SUM(urls.views),0) as "visitCount"
            FROM urls
            LEFT JOIN users ON urls."userId" = users.id
            GROUP BY users.id
            ORDER BY "visitCount" DESC
            LIMIT 10
            `)

        return res.status(200).send(listRank)

    } catch (error) {

        return res.sendStatus(500)    
    }
}
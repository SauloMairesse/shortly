import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export function tokenValidation(req, res, next) {

    const authorization = req.headers.authorization
    const token = authorization.replace("Bearer ", "").trim();
    const JWT_KEY = process.env.JWT_KEY

    if(!token) return res.sendStatus(401)

    jwt.verify(token, JWT_KEY, (err, user) => {
        if(err) return res.sendStatus(403)
        next()
    })
}
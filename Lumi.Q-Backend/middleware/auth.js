
const jwt = require('jsonwebtoken')

export default async function Auth(req, res, next){
    try {

        const token = req.headers.authorization;

        // retrive the user details fo the logged in user
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken;

        next()

    } catch (error) {
        res.status(401).json({ error : "Authentication Failed!"})
    }
}
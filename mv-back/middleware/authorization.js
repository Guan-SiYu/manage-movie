const jwt = require('jsonwebtoken'),
    config = require('config')
function authorization(req, res, next) {
    const token = req.header('x-auth-token')
    if (!token) return res.status(401).send('未能提供令牌,拒绝访问')
    try {
        const decodedPayload = jwt.verify(token, config.get('jwtPrivateKey'))
        req.pld_user = decodedPayload
        next()
    } catch (ex) {
        res.status(400).send('非法令牌')
    }
}
module.exports = authorization

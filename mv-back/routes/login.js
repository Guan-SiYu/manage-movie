const express = require('express'),
    router = express.Router()
const { UserClass, validateUser } = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let found_user = await UserClass.findOne({ email: req.body.email })
    if (!found_user) res.status(400).send('没有此用户，请注册')

    if (found_user.name !== req.body.name) res.status(400).send('用户名不正确')

    const validPassword = await bcrypt.compare(
        req.body.password,
        found_user.password
    )
    if (!validPassword) res.status(400).send('密码不正确')

    const token = found_user.createAuthToken()

    res.send(token)
})
module.exports = router

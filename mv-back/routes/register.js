const express = require('express'),
    router = express.Router(),
    _ = require('lodash')
const { UserClass, validateUser } = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    let new_user = await UserClass.findOne({ email: req.body.email })
    if (new_user) return res.status(400).send('已有此用户，请登录')

    new_user = new UserClass(_.pick(req.body, ['name', 'email', 'password']))
    const salt = await bcrypt.genSalt(10)
    new_user.password = await bcrypt.hash(new_user.password, salt)

    await new_user.save()
    const token = new_user.createAuthToken()
    res.header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send(_.pick(new_user, ['name', 'email']))
})
module.exports = router

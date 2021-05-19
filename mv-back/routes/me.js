const express = require('express'),
    router = express.Router()
const { UserClass } = require('../models/user'),
    authorization = require('../middleware/authorization')

router.get('/', authorization, async (req, res) => {
    const me = await UserClass.findById(req.pld_user._id).select('-password')
    res.send(me)
})
module.exports = router

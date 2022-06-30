let router=require('express').Router()
let auth=require('../controllers/auth')

router.post('/signup',auth.signup)
router.post('/login',auth.login)
router.get('/disconnect',auth.logout)
router.get('/check',auth.check)

module.exports = router
var router = require('express').Router()
const {ensureAuth,ensureGuest} = require('../middleware/auth')


router.get('/',ensureGuest, (req,res)=>{
    console.log(req.session)
    res.render('login')
})

router.get('/login',ensureGuest, (req,res)=>{
    res.render('login')
})

router.get('/logout', (req,res)=>{
    req.logout()
    res.redirect('/login')
})



router.get('/dashboard',ensureAuth, require('../middleware/story'),(req,res)=>{
    res.render('dashboard', {stories:req.stories,date_parser:require('../helpers/date_format')})
})

module.exports = router
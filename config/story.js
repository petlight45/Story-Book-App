var router = require('express').Router()

router.get('/add',function(req,res){
        res.render('story/add')
})

module.exports = router
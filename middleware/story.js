var story = require('../models/Story')
module.exports = async function(req,res,next){
    try{
    req.stories = await story.find({user:req.user.id}).lean()
    next()
    }catch(err){
        render('error',{
            err_code:"500",
            err_redirect_link:"/dashboard",
            err_redirect:"Dashboard"
        })
    }
    
}
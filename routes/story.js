var router = require('express').Router()
const ensureAuth = require('../middleware/auth').ensureAuth
var story = require('../models/Story')
var methodOverride = require('method-override')

router.use("/", ensureAuth);

function render_error(res,code, redirect_link,redirect_label){
        res.status(code);
        res.render('error',{
                err_code:`${code}`,
                err_redirect_link:redirect_link,
                err_redirect:redirect_label
                })
}

router.get('/add',function(req,res){
        res.render('story/add')
})

router.post('/add',require('body-parser').urlencoded({extended:false}),function(req,res){
        req.body.user = req.user._id
        story.create(req.body)
        .then(function(){
                res.redirect('/dashboard')
        }).catch(function(){
                render_error(res,500,'/story/add','Add Story')
        })
})

router.get('/edit/:id', async function(req,res){
        try{
                const value = await story.findOne({_id:req.params.id}).exec();
                if (!value){
                        render_error(res,404,'/dashboard','Dashboard')
                }else{     
                        res.render('story/edit', {story:value})
                }
        }catch(err){
                render_error(res,500,'/dashboard','Dashboard')
        }
})


router.use('/edit/:id', [require('body-parser').urlencoded({extended:false}),methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
})])

router.put('/edit/:id',async function(req,res){
        try{    
                req.body.user = req.user._id
                const resp = await story.updateOne({_id:req.params.id},req.body);
                if (resp.n){
                        if (resp.nModified){
                            await story.updateOne({_id:req.params.id},{lastModifiedAt:Date.now()})
                        }
                        res.redirect('/dashboard')
                }else{     
                        render_error(res,404,'/dashboard','Dashboard')
                }
        }catch(err){
                render_error(res,500,'/dashboard','Dashboard')
        }
})

router.use('/delete/:id', [require('body-parser').urlencoded({extended:false}),methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
})])

router.delete('/delete/:id',async function(req,res){
        try{    
                req.body.user = req.user._id
                await story.deleteOne({_id:req.params.id},req.body);
                res.redirect('/dashboard')
        }catch(err){
                render_error(res,500,'/dashboard','Dashboard')
        }
})

router.get('/public', async function(req,res){
        try{
                stories = await story.find({status:"Public"}).populate('user').sort({createdAt:"desc"}).lean()
                // console.log(stories)
                res.locals.user = req.user;
                res.render('story/public',{stories:stories,content_parser:require('../helpers/st_ct_fmt')})
        }catch(err){
                console.log(err)
                render_error(res,500,'/dashboard','Dashboard')
        }
})

router.get('/public/:user_id', async function(req,res){
        try{
                stories = await story.find({status:"Public", user:req.params.user_id}).populate('user').sort({createdAt:"desc"}).lean()
                // console.log(stories)
                res.locals.user = req.user;
                res.render('story/public_user',{stories:stories,content_parser:require('../helpers/st_ct_fmt')})
        }catch(err){
                console.log(err)
                render_error(res,500,'/dashboard','Dashboard')
        }
})

router.get('/show/:id', async function(req,res){
         try{
                story_ = await story.findById(req.params.id).populate('user').lean()
                if (story){
                        res.locals.user = req.user;
                        res.render('story/view',{story:story_,date_parser:require('../helpers/date_format')})
                }else {
                        render_error(res,404,'/dashboard','Dashboard')
                }
                
        }catch(err){
                console.log(err);
                render_error(res,500,'/dashboard','Dashboard')
        }
})
module.exports = router
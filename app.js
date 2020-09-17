var express = require('express')
var dotenv = require('dotenv')
var connectdb = require('./config/db')
var morgan = require('morgan')
var index = require('./routes/index')
var auth = require('./routes/auth')
var sessions = require('express-session')
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(sessions)
var passport = require('passport')
dotenv.config({path:'./config/config.env'})
connectdb();
var app = express();
function render_error(res,code, redirect_link,redirect_label){
        res.status(code);
        res.render('error',{
                err_code:`${code}`,
                err_redirect_link:redirect_link,
                err_redirect:redirect_label
                })
}

app.set('view engine', 'ejs')
require('./config/passport')(passport);
if (process.env.NODE_ENV === "development"){
    app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
}
app.use(sessions({
    secret:'key',
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}))
app.use(express.static(`${__dirname}/public/`))
app.use(passport.initialize())
app.use(passport.session())
app.use("/", index)
app.use("/auth", auth)
app.use("/story", require('./routes/story'))
app.use(function (req,res){
	render_error(res,404,'/',"Dashboard")
})
app.listen(process.env.PORT, process.env.HOST,()=>{
    console.log(`server running on ${process.env.NODE_ENV} mode on port ${process.env.PORT}..`)
})
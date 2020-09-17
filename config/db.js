var mongoose = require('mongoose');

module.exports = async () => {
    mongoose.connect(process.env.MONGO_URI).then((val)=>{
    console.log('Database Connected Successfully')
    }).catch((e)=>{
        if (e) throw e;
    })
}
